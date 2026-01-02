const express = require('express')
const { Server } = require("socket.io");
const cors = require('cors')
const http = require('http');
const app = express()
const fs = require('fs');
const axios = require('axios')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const { Readable } = require('stream');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')

const server = http.createServer(app);
const OpenAI = require("openai")
const dotenv = require('dotenv')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

dotenv.config()

ffmpeg.setFfmpegPath(ffmpegPath)

/**
 * Extracts audio from a video file for efficient Whisper AI transcription.
 * 
 * This function uses FFmpeg to extract only the audio track from a video file,
 * dramatically reducing file size (typically 90-95% smaller). The extracted
 * audio is optimized for speech recognition with:
 * - MP3 format (widely supported by Whisper)
 * - 64kbps bitrate (sufficient for speech clarity)
 * - Mono channel (speech doesn't need stereo)
 * 
 * @param videoPath - Full path to the source video file
 * @returns Promise resolving to the path of the extracted audio file
 */
async function extractAudio(videoPath) {
  const audioPath = videoPath.replace(/\.[^.]+$/, '_audio.mp3')
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('64k')
      .audioChannels(1)
      .output(audioPath)
      .on('end', () => {
        console.log('🟢 Audio extracted successfully')
        resolve(audioPath)
      })
      .on('error', (err) => {
        console.log('🔴 Audio extraction failed:', err.message)
        reject(err)
      })
      .run()
  })
}

// Configure CORS to allow both Electron and web app
app.use(cors({
  origin: [
    process.env.ELECTRON_HOST || "http://localhost:5173",
    "http://localhost:3000", // Next.js web app
    process.env.WEB_APP_HOST || "http://localhost:3000"
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp_upload/')
  },
  filename: function (req, file, cb) {
    const uniqueId = crypto.randomUUID()
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueId}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.mp4', '.webm', '.mov', '.avi']
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, MOV, and AVI are allowed.'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: fileFilter
})

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// Helper function to process video (used by both socket and HTTP upload)
async function processVideo(filename, userId, customTitle = null, customDescription = null) {
  try {
    const file = fs.readFileSync('temp_upload/' + filename)
    
    const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/processing`, {
      filename: filename,
    })

    if(processing.data.status !== 200) {
      console.log("Oops! something went wrong")
      return { success: false, error: "Failed to start processing" }
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    let ContentType = 'video/webm'
    if (ext === '.mp4') ContentType = 'video/mp4'
    else if (ext === '.mov') ContentType = 'video/quicktime'
    else if (ext === '.avi') ContentType = 'video/x-msvideo'

    const Key = filename
    const Bucket = process.env.BUCKET_NAME
    const command = new PutObjectCommand({
      Key,
      Bucket,
      ContentType,
      Body: file
    })
    const fileStatus = await s3.send(command)

    if(fileStatus['$metadata'].httpStatusCode === 200) {
      console.log("video uploaded to aws")

      // Start transcription for pro plan
      if(processing.data.plan === "PRO") {
        let audioPath = null
        
        try {
          // Extract audio from video for efficient transcription
          // Audio is typically 5-10% of video size, allowing much longer recordings
          console.log('🔵 Extracting audio from video for transcription...')
          audioPath = await extractAudio('temp_upload/' + filename)
          
          const audioStat = fs.statSync(audioPath)
          console.log(`🔵 Audio size: ${(audioStat.size / 1024 / 1024).toFixed(2)}MB`)
          
          // Check if extracted audio is within Whisper's 25MB limit
          if(audioStat.size < 25000000) {
            const transcription = await openai.audio.transcriptions.create({
              file: fs.createReadStream(audioPath),
              model: "whisper-1",
              response_format: "text"
            })

            if(transcription) {
              // If custom title/description provided, use those; otherwise generate with AI
              let titleAndSummaryContent
              if (customTitle && customDescription) {
                titleAndSummaryContent = JSON.stringify({
                  title: customTitle,
                  summary: customDescription
                })
              } else {
                const completion = await openai.chat.completions.create({
                  model: 'gpt-3.5-turbo',
                  response_format: { type: "json_object" },
                  messages: [
                    {
                      role: 'system',
                      content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription(${transcription}) and then return it in json format as {"title": <the title you gave>, "summary": <the summary you created>}`
                    }
                  ]
                })
                titleAndSummaryContent = completion.choices[0].message.content
              }

              const titleAndSummaryGenerated = await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/transcribe`, {
                filename: filename,
                content: titleAndSummaryContent,
                transcript: transcription
              })

              if(titleAndSummaryGenerated.data.status !== 200) {
                console.log("🔴 Error: Something went wrong when generating title and summary")
              }
            }
          } else {
            console.log("⚠️ Extracted audio too large for AI processing (>25MB)")
          }
        } catch (aiError) {
          if (aiError.status === 400 || aiError.message?.includes('Invalid file format')) {
            console.log("⚠️ AI transcription skipped - file format not supported or no audio track")
          } else {
            console.log("🔴 Error in AI processing:", aiError.message)
          }
        } finally {
          // Clean up temporary audio file
          if (audioPath && fs.existsSync(audioPath)) {
            fs.unlink(audioPath, (err) => {
              if (!err) console.log('🟢 Temporary audio file cleaned up')
            })
          }
        }
      }

      const stopProcessing = await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/complete`, {
        filename: filename,
      })

      if(stopProcessing.data.status !== 200) {
        console.log("🔴 Error: Something went wrong when stopping the process and trying to complete processing stage")
        return { success: false, error: "Failed to complete processing" }
      }

      if(stopProcessing.status === 200) {
        fs.unlink('temp_upload/' + filename, (err) => {
          if(!err) console.log(`🟢 ${filename} deleted successfully!`)
        })
      }

      return { success: true, filename: filename }
    }
    else {
      console.log("Upload failed! process aborted")
      return { success: false, error: "Upload to S3 failed" }
    }
  } catch (error) {
    console.log("🔴 Error processing video:", error)
    return { success: false, error: error.message }
  }
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  },
  region: process.env.BUCKET_REGION
})

// HTTP Upload endpoint
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    const { userId, title, description } = req.body

    if (!userId) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ success: false, error: 'userId is required' })
    }

    console.log(`🔵 Processing uploaded file: ${req.file.filename}`)

    // Process the video using the same logic as socket upload
    const result = await processVideo(req.file.filename, userId, title, description)

    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        filename: result.filename,
        message: 'Video uploaded and processing started'
      })
    } else {
      return res.status(500).json({ success: false, error: result.error })
    }
  } catch (error) {
    console.log('🔴 Upload error:', error)
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    })
  }
})

const io = new Server(server, {
  cors: {
    origin: process.env.ELECTRON_HOST || "http://localhost:3000",
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Socket is Connected: ' + socket.id)
  
  // Per-socket chunk storage - each recording session gets its own array
  let recordedChunks = []

  socket.on('video-chunks', async (data) => {
    console.log("🔵 Receiving video chunks... ", { filename: data.filename, chunkSize: data.chunks?.length });

    // Record and save the video chunks to a temp file
    const writeStream = fs.createWriteStream('temp_upload/' + data.filename)
    recordedChunks.push(data.chunks)

    // Create a blob from the recorded chunks
    const videoBlob = new Blob(recordedChunks, {type: 'video/webm; codecs=vp9'})
    const buffer = Buffer.from(await videoBlob.arrayBuffer())
    const readStream = Readable.from(buffer)

    // Pipe the read stream to the write stream
    readStream.pipe(writeStream).on('finish', () => {
      console.log("🟢 Chunk saved")
    })
  })

  socket.on('process-video', async (data) => {
    const chunkCount = recordedChunks.length
    console.log(`🔵 Processing video: ${data.filename} with ${chunkCount} chunks`)
    
    // Clear chunks immediately for this socket so a new recording can start fresh
    recordedChunks = []
    
    // Use the shared processVideo function
    const result = await processVideo(data.filename, data.userId)
    
    if (!result.success) {
      console.log("🔴 Error processing video:", result.error)
    } else {
      console.log(`🟢 Video processed successfully: ${data.filename}`)
    }
  })

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`)
    recordedChunks = []
  })
})

server.listen(5001, () => {
  console.log('🟢 Listening to port 5001')
});

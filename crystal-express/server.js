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

    // Capture videoId and workspaceId from processing response
    const videoId = processing.data.videoId
    const workspaceId = processing.data.workspaceId

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
            let transcription
            try {
              console.log('🔵 Starting Whisper transcription...')
              transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(audioPath),
                model: "whisper-1",
                response_format: "verbose_json"
              })
              console.log('🟢 Whisper transcription completed')
            } catch (whisperError) {
              console.log('🔴 Whisper transcription failed:', whisperError.message)
              throw whisperError
            }

            if(transcription) {
              // Extract plain text and timestamped segments from verbose_json response
              const plainTranscript = transcription.text
              const segments = transcription.segments?.map(seg => ({
                start: seg.start,
                end: seg.end,
                text: seg.text.trim()
              })) || []

              console.log(`🔵 Transcript length: ${plainTranscript.length} characters`)

              // If custom title/description provided, use those; otherwise generate with AI
              let titleAndSummaryContent
              if (customTitle && customDescription) {
                titleAndSummaryContent = JSON.stringify({
                  title: customTitle,
                  summary: customDescription
                })
                console.log('🔵 Using custom title and description')
              } else {
                try {
                  console.log('🔵 Generating title and summary with GPT-4...')
                  const completion = await openai.chat.completions.create({
                    model: 'gpt-4',
                    response_format: { type: "json_object" },
                    messages: [
                      {
                        role: 'system',
                        content: `# ROLE & MISSION

You are a Video Content Analyst. Your goal is to generate high-quality metadata for a video archive by analyzing transcripts and creating searchable, scannable summaries.

# TASK

Analyze the provided transcript and generate:
1. A **Title** - Descriptive, specific, and functional
2. A **Summary** - A cohesive one-paragraph overview

## Process:
1. Identify the core topic, key points, and main takeaway
2. Distinguish main topics from tangential discussions
3. Draft title and summary
4. Verify constraints are met

# OUTPUT FORMAT

Return valid JSON:
{
  "_thought_process": "Brief list of 2-3 main points identified",
  "title": "Your generated title",
  "summary": "Your generated summary"
}

## Title Guidelines:
- Goal: Immediate functional understanding
- Style: Descriptive, specific, boringly accurate
- Length: Concise but complete
- Avoid: Clickbait, vague language, unnecessary punctuation

**Examples:**
- ✅ Good: "React Hooks Tutorial: useState and useEffect Basics"
- ❌ Bad: "You Won't BELIEVE These React Tips!" (clickbait)
- ❌ Bad: "Video About Programming" (too vague)

## Summary Guidelines:
- Format: ONE single paragraph (no line breaks)
- Length: 80-120 words, 3-5 sentences
- Style: Narrative synthesis (not a linear "first...then...finally" structure)
- Tone: Professional, objective, clear
- Content: Focus on WHAT the video covers and WHY it matters
- Ignore: Small talk, filler words, intro/outro fluff

# SPECIAL CASES

- **No clear topic:** Use "Recording of [general activity/discussion]"
- **Multiple topics:** Focus on the primary topic (majority of content)
- **Very long transcript:** Prioritize beginning and conclusion for main points
- **Incoherent content:** Create generic but accurate description

# VALIDATION

Before returning, verify:
- Summary is exactly ONE paragraph (no \\n\\n breaks)
- Word count is 80-120 words
- JSON is valid and parseable
- Title clearly states the subject matter`
                      },
                      {
                        role: 'user',
                        content: `Generate the title and summary for this video transcript. Follow the format and constraints specified.

<transcript>
${plainTranscript}
</transcript>

Remember: One paragraph summary (80-120 words), descriptive title, valid JSON output.`
                      }
                    ]
                  })
                  titleAndSummaryContent = completion.choices[0].message.content
                  console.log('🟢 GPT-4 title and summary generated')
                } catch (gptError) {
                  console.log('🔴 GPT-4 generation failed:', gptError.message)
                  throw gptError
                }
              }

              try {
                console.log('🔵 Saving transcription to database...')
                const titleAndSummaryGenerated = await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/transcribe`, {
                  filename: filename,
                  content: titleAndSummaryContent,
                  transcript: plainTranscript,
                  segments: segments
                })

                if(titleAndSummaryGenerated.data.status === 200) {
                  console.log("🟢 Transcription saved successfully to database")
                } else {
                  console.log("🔴 Error: Database returned status", titleAndSummaryGenerated.data.status)
                  console.log("🔴 Response:", titleAndSummaryGenerated.data)
                }
              } catch (dbError) {
                console.log('🔴 Failed to save transcription to database:', dbError.message)
                if (dbError.response) {
                  console.log('🔴 Response status:', dbError.response.status)
                  console.log('🔴 Response data:', dbError.response.data)
                }
                throw dbError
              }
            }
          } else {
            console.log("⚠️ Extracted audio too large for AI processing (>25MB)")
          }
        } catch (aiError) {
          // More specific error handling based on where it failed
          if (aiError.message?.includes('Audio extraction') || aiError.code === 'ENOENT') {
            console.log("🔴 Audio extraction failed - video may not have an audio track")
          } else if (aiError.message?.includes('Whisper') || aiError.message?.includes('transcription')) {
            console.log("🔴 Whisper transcription failed - audio format may be unsupported")
          } else if (aiError.message?.includes('GPT') || aiError.message?.includes('completion')) {
            console.log("🔴 GPT-4 title/summary generation failed")
          } else if (aiError.message?.includes('database') || aiError.response?.status) {
            console.log("🔴 Failed to save transcription to database - status:", aiError.response?.status || 'unknown')
          } else {
            console.log("🔴 AI processing error:", aiError.message || aiError)
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

      return { success: true, filename: filename, videoId: videoId, workspaceId: workspaceId }
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
        videoId: result.videoId,
        workspaceId: result.workspaceId,
        message: 'Video uploaded and processed successfully'
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

  socket.on('video-chunks', (data) => {
    // Only accumulate chunks in memory - no file writes during recording
    // This prevents race conditions from concurrent file writes
    recordedChunks.push(data.chunks)
    console.log(`🔵 Chunk received (${recordedChunks.length} total)`, { filename: data.filename, chunkSize: data.chunks?.length })
  })

  socket.on('process-video', async (data) => {
    const chunkCount = recordedChunks.length
    console.log(`🔵 Processing video: ${data.filename} with ${chunkCount} chunks`)
    
    if (chunkCount === 0) {
      console.log("🔴 No chunks to process")
      return
    }

    try {
      // Write complete video file ONCE from all accumulated chunks
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm; codecs=vp9' })
      const buffer = Buffer.from(await videoBlob.arrayBuffer())
      
      const filePath = 'temp_upload/' + data.filename
      fs.writeFileSync(filePath, buffer)
      console.log(`🟢 Video file written: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`)
      
      // Clear chunks after successful write
      recordedChunks = []
      
      // Process the video
      const result = await processVideo(data.filename, data.userId)
      
      if (!result.success) {
        console.log("🔴 Error processing video:", result.error)
      } else {
        console.log(`🟢 Video processed successfully: ${data.filename}`)
      }
    } catch (error) {
      console.log("🔴 Error writing video file:", error.message)
      recordedChunks = []
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

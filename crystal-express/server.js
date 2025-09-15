const express = require('express')
const { Server } = require("socket.io");
const cors = require('cors')
const http = require('http');
const app = express()
const fs = require('fs');
const axios = require('axios')

const { Readable } = require('stream');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')

const server = http.createServer(app);
const OpenAI = require("openai")
const dotenv = require('dotenv')

dotenv.config()

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  },
  region: process.env.BUCKET_REGION
})

const io = new Server(server, {
  cors: {
    origin: process.env.ELECTRON_HOST || "http://localhost:3000",
    methods: ['GET', 'POST']
  }
});

let recordedChunks = []

io.on('connection', (socket) => {
  console.log('🟢 Socket is Connected: ' + socket.id)

  socket.on('video-chunks', async (data) => {
    console.log("🔵 Sending video chucks... ", data);

    // record and save the video chunks to a temp file
    const writeStream = fs.createWriteStream('temp_upload/' + data.filename)
    recordedChunks.push(data.chunks)

    // create a blob from the recorded chunks
    const videoBlob = new Blob(recordedChunks, {type: 'video/webm; codecs=vp9'})
    const buffer = Buffer.from(await videoBlob.arrayBuffer())
    const readStream = Readable.from(buffer)

    // pipe the read stream to the write stream
    readStream.pipe(writeStream).on('finish', () => {
      console.log("🟢 Chunk saved")
    })
  })

  socket.on('process-video', async (data) => {
    console.log("🔵 Processing video... ", data)
    recordedChunks = []
    fs.readFile('temp_upload/'+ data.filename, async (err, file) => {

      const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`, {
        filename: data.filename,
      })

      if(processing.data.status !== 200)
        return console.log("🔴 Error! Something went wrong with creating the processing file.")

      const Key = data.filename
      const Bucket = process.env.BUCKET_NAME
      const ContentType = 'video/webm'
      const command = new PutObjectCommand({
        Key,
        Bucket,
        ContentType,
        Body: file
      })
      const fileStatus = await s3.send(command)

      //start transcription for pro plan
      //check plan serverside to stop fake client side authorization
      if (processing.data.plan === "PRO") {
        fs.stat('temp_upload/' + data.filename, async (err, stat) => {
          if(!err) {
            //whisper is restricted to 25mb uploads to avoid errors
            //add a check for file size before transcribing
            if(stat.size < 25000000) {
              const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(`temp_upload/${data.filename}`),
                model: "whisper-1",
                response_format: "text"
              })

              if(transcription) {
                const completion = await openai.chat.completions.create({
                  model: 'gpt-3.5-turbo',
                  response_format: { type: "json_object" },
                  messages: [
                    {role: 'system',
                      content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription(${transcription}) and then return it in json format as {"title": <the title you gave>, "summery": <the summary you created>}`}
                  ]
                })

                const titleAndSummeryGenerated = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`, {
                  filename: data.filename,
                  content: completion.choices[0].message.content,
                  transcript: transcription
                })

                if(titleAndSummeryGenerated.data.status !== 200) console.log("Oops! something went wrong")
              }
            }
          }
        })
      }
    })
  })

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  })
})

server.listen(5001, () => {
  console.log('🟢 Listening to port 5001')
});

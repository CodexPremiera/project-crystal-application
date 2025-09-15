const express = require('express')
const { Server } = require("socket.io");
const cors = require('cors')
const http = require('http');
const app = express()
const fs = require('fs');

const { Readable } = require('stream');

const server = http.createServer(app);
const dotenv = require('dotenv')

dotenv.config()

app.use(cors());


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
  })

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  })
})

server.listen(5001, () => {
  console.log('🟢 Listening to port 5001')
});

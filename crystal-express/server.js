const express = require('express')
const { Server } = require("socket.io");
const cors = require('cors')
const http = require('http');
const app = express()

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

io.on('connection', (socket) => {
  console.log('🟢 Socket is Connected: ' + socket.id)
})

server.listen(5001, () => {
  console.log('🟢 Listening to port 5001')
});

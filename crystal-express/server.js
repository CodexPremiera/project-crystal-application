const express = require('express')
const app = express()

const cors = require('cors')
const http = require('http');

const server = http.createServer(app);

app.use(cors());




server.listen(5000, () => console.log('listening to port 5000'))

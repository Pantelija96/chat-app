const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const message = "Welcome!"
const message2 = "New user entered!"

io.on('connection', (socket) => {
    console.log('new connection established')

    socket.emit('newConnection', message)
    socket.broadcast.emit('newConnection', 'A new user has join!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (location) => {
        socket.broadcast.emit('message', location)
    })

    socket.on('disconnect', () => {
        io.emit('newConnection', 'User has disconnected!')
    })
})

server.listen(port, () => {
    console.log('App on port: ' + port)
})
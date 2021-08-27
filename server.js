const express = require('express')
const app = express()

const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// setting up socket

const io = require('socket.io')(http)
const users = {};
io.on('connection', (socket) => {

    // console.log('connected...')

    socket.on('user-joined', (name) => {
        var x = socket.id
        users[x] = name
        // console.log(`the user name is ${name}`)
        // console.log(x)
        // console.log(users)
        io.to(x).emit('assignId', { id: x, name: users[x] })
    })
    socket.on('updateList', (data) => {
        // console.log("event listen")
        // console.log(data)
        io.to(data.id).emit('updated', users)
    })
    socket.on('update-members', (person) => {
        var sz = Object.keys(users).length
        // console.log(person)
        socket.broadcast.emit('members-updated', { person: person, sz: sz })
    })

    socket.on('update-top', () => {
        var sz = Object.keys(users).length
        // console.log('event listened')
        // console.log(sz)
        socket.emit('top-updated', sz)
    })
    socket.on('sendM', (message) => {
        // console.log(message)
        socket.broadcast.emit('recieve', message)
    })

    socket.on('disconnect', () => {
        var sz = Object.keys(users).length
        socket.broadcast.emit('user-left', { id: socket.id, name: users[socket.id], sz: sz })
        delete users[socket.id]
    })

})
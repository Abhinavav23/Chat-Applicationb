const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { Generatemessage, generateLocation } = require('./utils/message')
const { addUser, removeUser, getUSer, getUsersInRoom } = require('./utils/user')

const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath  = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// app.listen(port, () => {
//     console.log(`server is running on port ${port}` )
// })

let count = 0
io.on('connection', (socket) => {
    
    socket.on('join', ({ username, chatroom }, callback) => {
        
        const { error, user } = addUser({ id: socket.id, username, chatroom })
        if(error){
            return callback(error)
        }
        socket.join(user.chatroom)
        socket.emit('welcome', Generatemessage('Admin', 'Welcome!!'))  
        socket.broadcast.to(user.chatroom).emit('welcome', Generatemessage('Admin',`${user.username} has joined!! to group ${user.chatroom}`))
        io.to(user.chatroom).emit('roomData', {
            room: user.chatroom,
            usersInroom: getUsersInRoom(user.chatroom)
        })
    })

       
    socket.on('greeting', (message, callback) => {
        const user = getUSer(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback( Generatemessage(user.username,'message can bot be printed'))
        }
        io.to(user.chatroom).emit('welcome', Generatemessage(user.username,message))
        callback('Delivered')
    })
    

    socket.on('sendLocation', (cords, callback) =>{
        const user = getUSer(socket.id)
        io.to(user.chatroom).emit('LocationMessage', generateLocation(user.username, `https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.chatroom).emit('welcome',  Generatemessage('Admin',`${user.username} has left!`))
            io.to(user.chatroom).emit('roomData', {
                room: user.chatroom,
                usersInroom: getUsersInRoom(user.chatroom)
            })
        }
    })


    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //     io.emit('countUpdated', count)
    // })
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

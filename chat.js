var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

const { dbHelper } = require('./routes/dbHelper');


require('dotenv').config({path:'.env'})
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const MONGO_DB_NAME = process.env.MONGO_DB_NAME

app.use(require("body-parser").json())

app.use('/api/auth', require('./routes/AuthRoute'))
app.use('/api/chat', require('./routes/ChatRoute'))
app.use('/api/chatworker', require('./routes/ChatWorkerRoute'))  // ??????


async function start() {

  try {

    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    // Set all user in offline status default
    await dbHelper.setAllUsersOffline()

    // Create server socket for every new client
    io.on('connection', (socket) => { 

      // Closure to catch current user and chat
      var currentUser = null
      var currentLogin = null
      var currentChat = null
      
      // Run when client just connected
      socket.on('Client just enter', async (chat, user, count)  => {
        console.log('New user connected on socket:', socket.id)
        // Subscribe this user to current room (chat)
        socket.join(chat)
        // Set current user in online status
        await dbHelper.setUserOnline(chat, user)
        // Send old messages to current user
        const oldMessages = await dbHelper.getPrevMsg(chat, count=50)
        socket.emit('Old messages', oldMessages)
        // SBroadcast all users in this room include current user
        const onlineUsers = await dbHelper.getOnlineUsers(chat)
        io.in(chat).emit('Refresh online users', onlineUsers)
        // Broadcast all users in this room include current user
        const login = await dbHelper.getUsername(user)
        // io.in(chat).emit('New user connected to chatroom', user, login)
        // For closure
        currentUser = user
        currentLogin = login
        currentChat = chat
      })
      

      // Set listener on new message from client.
      // After that emit all users in chatroom (include current)
      socket.on('New message from client', async (text, chat, user)  => {
        const newMessage = await dbHelper.saveMsg(text, chat, user)
        io.in(chat).emit('New user message from server', newMessage)
      })


      // When user just leave chatroom
      socket.on('disconnect', async () => {
        socket.leave(currentChat)
        await dbHelper.setUserOffline(currentChat, currentUser)
        const onlineUsers = await dbHelper.getOnlineUsers(currentChat)
        io.in(currentChat).emit('Refresh online users', onlineUsers)
      })
    })
  

    // Start backend server
    http.listen(PORT, () => { console.log(`Server has been started on port ${PORT}...`) })


  } catch (e) {
    console.log('Error while starting:', e.message)
    process.exit(1)
  }
}

start()
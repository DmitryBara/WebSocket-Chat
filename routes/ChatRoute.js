const {Router} = require('express')
const router = Router()
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const authMiddleware = require('../middleware/auth.middleware')


require('dotenv').config({path:'../.env'});
const BASE_URL = process.env.BASE_URL


// Create new chatroom
router.post('/create', authMiddleware, async(req, res) => {
  try {
    const {chatname, private} = req.body

    // Check is chatname free or not
    const exChat = await Chat.findOne({ chatname })
    if (exChat) {
      res.status(400).json({ message: 'Chat with that name already exist'})
    }

    // Param req.user.userId taken from authMiddleware
    const chat = new Chat ({ chatname, creator: req.user.userId, private})
    await chat.save()
    res.status(201).json({ message: 'Chat has been created', chatId: chat._id })

  } catch {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})



// All chatrooms. Need to make pagination in future
router.get('/chatrooms', authMiddleware, async(req, res) => {
  try {
    const chatrooms = await Chat.find() // find all chats from collection
    res.json(chatrooms)
  } catch {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})



// All chatrooms created by current User. Will be realized soon
router.get('/myself_created_chatrooms', authMiddleware, async(req, res) => {
  try {
    const userChatrooms = await Chat.find( {creator: req.user.userId} ) 
    res.json(userChatrooms)
  } catch {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})



// One chat window
router.get('/chatrooms/:id', authMiddleware, async(req, res) => {
  try {
    var chat = await Chat.findById( req.params.id )
    // msgContent = await Message.find( {chat: req.params.id })
    res.json(chat)
  } catch {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})

module.exports = router
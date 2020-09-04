const {Router} = require('express')
const router = Router()
const Message = require('../models/Message')
const authMiddleware = require('../middleware/auth.middleware')


require('dotenv').config({path:'../.env'});
const BASE_URL = process.env.BASE_URL



// One chat window
router.post('/chatrooms/:id/send_new_message', authMiddleware, async(req, res) => {
  try {

    const {text} = req.body

    const message = new Message ({ text, chat: req.params.id, user: req.user.userId })
    await message.save()

    // Message in json - just info message
    res.status(201).json({ message: 'Message has been received by server', messageId: message._id })


  } catch {
    res.status(500).json({message: 'Ooops! Internal server error'})
  }
})

module.exports = router
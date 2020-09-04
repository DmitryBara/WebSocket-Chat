const Message = require('../models/Message')
const Chat = require('../models/Chat')
const User = require('../models/User')



class DataBaseHelper {
  constructor() {}

  // Save new user message to database
  async saveMsg(text, chat, user) {
    const obj = await User.findOne( {_id: user }, { login:1, _id: 0})
    const login = obj['login']
    const message = new Message ({ text, chat, user, login })
    await message.save()
    return message
  }

  // Get 50 last messages from current chat for new user
  async getPrevMsg (chat, count=50) {
    const prevMessages = await Message.find({ chat: chat }).sort({ date: -1 }).limit(count).sort({ date: 1 })
    return prevMessages
  }

  // Set user in online status on connect
  async setUserOnline (chat, user) {
    const _ = await Chat.updateOne( { _id: chat },  { $push: { onlineUsers: user } } )
    return
  }

  // Set user in offline status on disconnect
  async setUserOffline (chat, user) {
    const _ = await Chat.updateMany( { _id: chat },  { $pull: { onlineUsers: user } } )
    return
  }

  // Get online users (id and login)
  async getOnlineUsers(chat) {
    try {
      const obj = await Chat.findOne({ _id: chat }, { onlineUsers:1, _id:0 } ) //only onlineusers id
      const ids = obj['onlineUsers']
      const users = await User.find({}, { login: 1 }).where('_id').in(ids)
      return users
    } catch {}
  }

  // Get username by id
  async getUsername(userId) {
    const obj = await User.findOne({ _id: userId}, { login: 1 })
    const login = obj['login']
    return login
  }

  // When start up server refresh online list
  async setAllUsersOffline() {
    await Chat.updateMany({}, {$set: {onlineUsers: []}})
  }

}

const dbHelper = new DataBaseHelper()

module.exports = { dbHelper }
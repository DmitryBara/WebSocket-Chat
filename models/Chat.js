const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  chatname: {type: String, required: true},
  creator: {type: Types.ObjectId, ref: 'User'},
  onlineUsers: [{ type: Types.ObjectId, ref: 'User'}],
  date: {type: Date, default: Date.now},
  private: {type: Boolean, default: false}
})

module.exports = model('Chat', schema)
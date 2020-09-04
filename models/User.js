const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  chatrooms: [{ type: Types.ObjectId, ref: 'chatroom'}]
})

module.exports = model('User', schema)
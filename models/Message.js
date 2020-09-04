const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  text: {type: String, required: true}, 
  chat: {type: Types.ObjectId, ref: 'Chat', required: true},
  user: {type: Types.ObjectId, ref: 'User'},
  login: {type: String, required: true},
  date: {type: Date, default: Date.now}
})

module.exports = model('Message', schema)
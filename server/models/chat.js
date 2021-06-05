const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  })

chatSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Chat', chatSchema)
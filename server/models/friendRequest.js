const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    fromUser: {type: Schema.Types.ObjectId, ref: 'User'},
    toUser: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date
  })

  friendRequestSchema.plugin(uniqueValidator)
module.exports = mongoose.model('FriendRequest', friendRequestSchema)
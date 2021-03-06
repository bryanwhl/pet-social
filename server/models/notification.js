const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    fromUser: {type: Schema.Types.ObjectId, ref: 'User'},
    toUser: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    notificationType: String,
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    friendRequest: {type: Schema.Types.ObjectId, ref: 'FriendRequest'},
    comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
  })

notificationSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Notification', notificationSchema)
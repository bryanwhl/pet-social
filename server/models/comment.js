const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user.js')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    text: String,
    likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    isEdited: Boolean,
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  })

commentSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Comment', commentSchema)
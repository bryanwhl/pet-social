const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    date: Date,
    text: String,
    likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    isEdited: Boolean,
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  })

commentSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Comment', commentSchema)
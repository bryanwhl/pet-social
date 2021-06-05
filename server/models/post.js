const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user.js')
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  postType: String,
  privacy: String,
  imageFilePath: String,
  videoFilePath: String,
  tagged: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  location: String,
  text: String,
  likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  isEdited: Boolean
})

postSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Post', postSchema)
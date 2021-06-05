const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  accountType: String,
  givenName: String,
  familyName: String,
  avatarPath: String,
  profilePicturePath: String,
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  savedPosts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  blockedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}],
  notifications: [{type: Schema.Types.ObjectId, ref: 'Notification'}],
  online: Boolean,
  registeredDate: Date,
  profileBio: String,
  playgroups: [{type: Schema.Types.ObjectId, ref: 'Playgroup'}],
  pets: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  familyNameFirst: Boolean,
  defaultPrivacy: String,
  likeNotification: Boolean,
  commentNotification: Boolean,
  shareNotification: Boolean
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)
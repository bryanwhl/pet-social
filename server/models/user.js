const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const Name = new Schema({
  givenName: String,
  familyName: String,
})

const Settings = new Schema({
  familyNameFirst: Boolean,
  defaultPrivacy: String,
  likeNotification: Boolean,
  commentNotification: Boolean,
  shareNotification: Boolean,
})

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  accountType: String,
  name: Name,
  avatarPath: String,
  profilePicturePath: String,
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  savedPosts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  blockedUser: [{type: Schema.Types.ObjectId, ref: 'User'}],
  chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}],
  notifications: [{type: Schema.Types.ObjectId, ref: 'Notification'}],
  online: Boolean,
  registeredDate: Date,
  profileBio: String,
  playgroups: [{type: Schema.Types.ObjectId, ref: 'Playgroup'}],
  pets: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  settings: Settings,
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)
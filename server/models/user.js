/**
 * User Model
 * Mongoose schema for user accounts in Pet Social
 * Handles user authentication, profile data, social connections, and settings
 */

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

/**
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 * Includes personal information, social connections, content, and preferences
 */
const userSchema = new Schema({
  // Authentication and basic info
  username: String,
  password: String,
  email: String,
  accountType: String,
  givenName: String,
  familyName: String,
  avatarPath: String,
  
  // Content and social connections
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  savedPosts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  blockedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}],
  notifications: [{type: Schema.Types.ObjectId, ref: 'Notification'}],
  
  // Friend request management
  sentFriendRequests: [{type: Schema.Types.ObjectId, ref: 'FriendRequest'}],
  receivedFriendRequests: [{type: Schema.Types.ObjectId, ref: 'FriendRequest'}],
  
  // Status and profile
  online: Boolean,
  registeredDate: Date,
  profileBio: String,
  playgroups: [{type: Schema.Types.ObjectId, ref: 'Playgroup'}],
  pets: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  
  // User preferences and settings
  familyNameFirst: Boolean,
  defaultPrivacy: String,
  likeNotification: Boolean,
  commentNotification: Boolean,
  shareNotification: Boolean
})

// Add unique validation plugin for username/email uniqueness
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
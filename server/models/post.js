/**
 * Post Model
 * Mongoose schema for user posts in Pet Social
 * Handles social media posts with media, tagging, privacy settings, and engagement
 */

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

/**
 * Post Schema Definition
 * Defines the structure for post documents in MongoDB
 * Supports text, images, videos, pet tagging, privacy controls, and social interactions
 */
const postSchema = new Schema({
  // Post ownership and metadata
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  postType: String,
  privacy: String,
  
  // Media content
  imageFilePath: String,
  videoFilePath: String,
  
  // Content and tagging
  tagged: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
  location: String,
  text: String,
  
  // Social engagement
  likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  
  // Post status
  isEdited: Boolean
})

postSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Post', postSchema)
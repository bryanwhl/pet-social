/**
 * Chat Model
 * Mongoose schema for chat conversations in Pet Social
 * Handles group and direct messaging between users
 */

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

/**
 * Chat Schema Definition
 * Defines the structure for chat documents in MongoDB
 * Supports multiple users, message history, and chat naming
 */
const chatSchema = new Schema({
    // Chat participants and content
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    
    // Chat metadata
    name: String,
})

chatSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Chat', chatSchema)
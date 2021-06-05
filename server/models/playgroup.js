const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user.js')
const Schema = mongoose.Schema;

const playgroupSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    playgroupAdmin: [{type: Schema.Types.ObjectId, ref: 'User'}],
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    meetingDates: [Date],
    meetingLocation: [Number],
    dateCreated: Date,
    playgroupChat: {type: Schema.Types.ObjectId, ref: 'Chat'}
  })

playgroupSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Playgroup', playgroupSchema)
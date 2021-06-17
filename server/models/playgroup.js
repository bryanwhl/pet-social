const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const playgroupSchema = new Schema({
    name: String,
    description: String,
    playgroupAdmin: {type: Schema.Types.ObjectId, ref: 'User'},
    //playgroupAdmin: [{type: Schema.Types.ObjectId, ref: 'User'}],
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    meetingDate: Date,
    meetingLat: Number,
    meetingLng: Number,
    dateCreated: Date,
    playgroupChat: {type: Schema.Types.ObjectId, ref: 'Chat'}
})

playgroupSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Playgroup', playgroupSchema)
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    isEdited: Boolean,
    isSeen: Boolean
  })

messageSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Message', messageSchema)
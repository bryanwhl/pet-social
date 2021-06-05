const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user.js')
const Schema = mongoose.Schema;

const petSchema = new Schema({
    name: String,
    owners: [{type: Schema.Types.ObjectId, ref: 'User'}],
    dateOfBirth: Date,
    gender: String,
    breed: String,
    picturePath: String
  })

petSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Pet', petSchema)
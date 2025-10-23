/**
 * Pet Model
 * Mongoose schema for pet profiles in Pet Social
 * Stores pet information including ownership, basic details, and profile pictures
 */

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

/**
 * Pet Schema Definition
 * Defines the structure for pet documents in MongoDB
 * Supports multiple owners, basic pet information, and profile pictures
 */
const petSchema = new Schema({
    // Basic pet information
    name: String,
    owners: [{type: Schema.Types.ObjectId, ref: 'User'}],
    dateOfBirth: Date,
    gender: String,
    breed: String,
    
    // Media
    picturePath: String
})

petSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Pet', petSchema)
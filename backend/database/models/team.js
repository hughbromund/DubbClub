const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const teamSchema = new Schema({
    teamId: { type: Number, unique: true, required: true},
    teamName: { type: String, unique: true, required: true},
    teamImage: { type: String, unique: false, required: false},
    wins: { type: Number, unique: false, required: true},
    losses: { type: Number, unique: false, required: false},
    conferenceName: { type: String, unique: false, required: true},
    place: { type: Number, unique: false, required: false},
}, { collection: "Team"})

// Define schema methods
teamSchema.methods = {}


const Team = mongoose.model('Team', teamSchema)
module.exports = Team
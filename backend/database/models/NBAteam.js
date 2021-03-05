const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const NBAteamSchema = new Schema({
    teamId: { type: Number, unique: false, required: true},
    teamName: { type: String, unique: false, required: true},
    teamImage: { type: String, unique: false, required: false},
    wins: { type: Number, unique: false, required: true},
    losses: { type: Number, unique: false, required: false},
    conferenceName: { type: String, unique: false, required: true},
    place: { type: Number, unique: false, required: false},
}, { collection: "NBAteam"})

// Define schema methods
NBAteamSchema.methods = {}


const NBAteam = mongoose.model('NBAteam', NBAteamSchema)
module.exports = NBAteam
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const EPLteamSchema = new Schema({
    teamId: { type: Number, unique: false, required: true},
    teamName: { type: String, unique: false, required: true},
    teamImage: { type: String, unique: false, required: false},
    wins: { type: Number, unique: false, required: true},
    draws: { type: Number, unique: false, required: true},
    losses: { type: Number, unique: false, required: false},
    elo: {type: Number, unique: false, required: true},
    position: {type: Number, unique: false, required: false},
    lastGameID: {type: Number, unique: false, required: true},
    goalsFor: { type: Number, unique: false, required: false},
    goalsAgainst: { type: Number, unique: false, required: false},
    biggestWinAway: { type: String, unique: false, required: false},
    biggestWinHome: { type: String, unique: false, required: false},
    goalsAverageAway: { type: String, unique: false, required: false},
    goalsAverageHome: { type: String, unique: false, required: false},
}, { collection: "EPLteam"})

// Define schema methods
EPLteamSchema.methods = {}


const EPLteam = mongoose.model('EPLteam', EPLteamSchema)
module.exports = EPLteam
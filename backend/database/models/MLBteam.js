const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const MLBteamSchema = new Schema({
    teamId: { type: Number, unique: false, required: true},
    teamName: { type: String, unique: false, required: true},
    teamImage: { type: String, unique: false, required: false},
    wins: { type: Number, unique: false, required: true},
    losses: { type: Number, unique: false, required: false},
    elo: {type: Number, unique: false, required: true},
    lastGameID: {type: Number, unique: false, required: true},
    standing: {type: Number, unique: false, required: false},
    league: {type: String, unique: false, required: false},
    division: {type: String, unique: false, required: false},
    streak: {type: String, unique: false, required: false},
    gamesBehind: {type: Number, unique: false, required: false}
}, { collection: "MLBteam"})

// Define schema methods
MLBteamSchema.methods = {}


const MLBteam = mongoose.model('MLBteam', MLBteamSchema)
module.exports = MLBteam
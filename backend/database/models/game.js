const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const gameSchema = new Schema({
    gameId: { type: String, unique: true, required: true},
    date: { type: String, unique: true, required: true},
    arena: { type: String, unique: true, required: true},
    home: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', unique: false, required: true},
    away: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', unique: false, required: true},
    teamName: { type: String, unique: true, required: true},
}, { collection: "Game"})

// Define schema methods
gameSchema.methods = {}


const Team = mongoose.model('Game', gameSchema)
module.exports = Game
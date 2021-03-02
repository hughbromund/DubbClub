const mongoose = require('mongoose')
const path = require("path");
const Team = require(path.resolve(__dirname, "./team")).schema;
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const gameSchema = new Schema({
    _id: { type: String, unique: false, required: true},
    date: { type: String, unique: false, required: true},
    arena: { type: String, unique: false, required: false, default: "TBD"},
    home: [Team],
    away: [Team],
    predictedWinner: { type: Number, unique: false, required: false},
    confidence: { type: Number, unique: false, required: false}
}, { collection: "Game"})

// Define schema methods
gameSchema.methods = {}


const Game = mongoose.model('Game', gameSchema)
module.exports = Game
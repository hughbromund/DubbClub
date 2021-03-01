const mongoose = require('mongoose')
const Team = require('./team')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const gameSchema = new Schema({
    gameId: { type: String, unique: true, required: true},
    date: { type: String, unique: false, required: true},
    arena: { type: String, unique: false, required: false},
    home: { type: Team, unique: false, required: true},
    away: { type: Team, unique: false, required: true},
    predictedWinner: { type: Number, unique: false, required: false},
    confidence: { type: Number, unique: false, required: false},
    gameStats: { 
        home: {
            teamId: { type: Number, unique: true, required: true},
            score: { type: Number, unique: true, required: true},
            lineScore: { type: Number, unique: true, required: true},
            leaders: { type: Number, unique: true, required: true}
        },
        away: {
            teamId: { type: Number, unique: true, required: true},
            score: { type: Number, unique: true, required: true},
            lineScore: { any: Object, unique: true, required: true},
            leaders: { any: Object, unique: true, required: true}
        }
    }
}, { collection: "Game"})

// Define schema methods
gameSchema.methods = {}


const Game = mongoose.model('Game', gameSchema)
module.exports = Game
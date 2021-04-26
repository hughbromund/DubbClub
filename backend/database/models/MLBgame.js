const mongoose = require('mongoose')
const path = require("path");
const MLBteam = require(path.resolve(__dirname, "./MLBteam")).schema;
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const MLBgameSchema = new Schema({
    id: { type: Number, unique: false, required: true},
    date: { type: Date, unique: false, required: true},
    arena: { type: String, unique: false, required: false, default: "TBD"},
    home: MLBteam,
    away: MLBteam,
    predictedWinner: { type: Number, unique: false, required: false},
    confidence: { type: Number, unique: false, required: false},
    homeVoters: {type: Array, unique: false, required: false, default: []},
    awayVoters: {type: Array, unique: false, required: false, default: []},
    status: {type: String, unique : false, required: true},
    livePredictions: {type: Array, unique: false, required: false, default: []},
    playedGameStats: {type: Object, unique: false, required: false, default: {}},
    lineScore: {type: Array, unique: false, required: false, default: []},
    homeScore: { type: Number, unique: false, required: false},
    awayScore: { type: Number, unique: false, required: false},
    inning: { type: Number, unique: false, required: false},
    half: { type: String, unique: false, required: false}
}, { collection: "MLBgame"})

// Define schema methods
MLBgameSchema.methods = {}


const MLBgame = mongoose.model('MLBgame', MLBgameSchema)
module.exports = MLBgame
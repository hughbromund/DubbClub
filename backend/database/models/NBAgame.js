const mongoose = require('mongoose')
const path = require("path");
const NBAteam = require(path.resolve(__dirname, "./NBAteam")).schema;
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const NBAgameSchema = new Schema({
    id: { type: Number, unique: false, required: true},
    date: { type: Date, unique: false, required: true},
    arena: { type: String, unique: false, required: false, default: "TBD"},
    home: [NBAteam],
    away: [NBAteam],
    predictedWinner: { type: Number, unique: false, required: false},
    confidence: { type: Number, unique: false, required: false},
    homeVoters: {type: Array, unique: false, required: false, default: []},
    awayVoters: {type: Array, unique: false, required: false, default: []},
    status: {type: String, unique : false, required: true},
    livePredictions: {type: Array, unique: false, required: false, default: []},
    playedGameStats: {type: Object, unique: false, required: false, default: {}}
}, { collection: "NBAgame"})

// Define schema methods
NBAgameSchema.methods = {}


const NBAgame = mongoose.model('NBAgame', NBAgameSchema)
module.exports = NBAgame
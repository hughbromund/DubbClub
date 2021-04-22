const mongoose = require('mongoose')
const path = require("path");
const EPLteam = require(path.resolve(__dirname, "./EPLteam")).schema;
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const EPLgameSchema = new Schema({
    id: { type: Number, unique: false, required: true},
    date: { type: Date, unique: false, required: true},
    arena: { type: String, unique: false, required: false, default: "TBD"},
    home: [EPLteam],
    away: [EPLteam],
    predictedWinner: { type: Number, unique: false, required: false},
    homeWinProb: { type: Number, unique: false, required: false},
    awayWinProb: { type: Number, unique: false, required: false},
    drawProb: { type: Number, unique: false, required: false},
    homeVoters: {type: Array, unique: false, required: false, default: []},
    awayVoters: {type: Array, unique: false, required: false, default: []},
    status: {type: String, unique : false, required: true},
    livePredictions: {type: Array, unique: false, required: false, default: []},
    playedGameStats: {type: Object, unique: false, required: false, default: {}},
    homeScore: { type: Number, unique: false, required: false},
    awayScore: { type: Number, unique: false, required: false},
    period: { type: Number, unique: false, required: false},
    clock: { type: String, unique: false, required: false},
    playedGameStats: {
        home: {
            teamId: { type: Number, unique: false, required: false},
            points: { type: Number, unique: false, required: false},
            lineScore: {type: Array, unique: false, required: false},
            shotsOnGoal: { type: Number, unique: false, required: false},
            shotsOffGoal: { type: Number, unique: false, required: false},
            totalShots: { type: Number, unique: false, required: false},
            blockedShot: { type: Number, unique: false, required: false},
            shotsInsidebox: { type: Number, unique: false, required: false},
            shotsOutsidebox: { type: Number, unique: false, required: false},
            fouls: { type: Number, unique: false, required: false},
            cornerKicks: { type: Number, unique: false, required: false},
            offsides: { type: Number, unique: false, required: false},
            ballPossessionPercentage: { type: Number, unique: false, required: false},
            yellowCards: { type: Number, unique: false, required: false},
            redCards: { type: Number, unique: false, required: false},
            goalkeeperSaves: { type: Number, unique: false, required: false},
            totalPasses: { type: Number, unique: false, required: false},
            passesAccurate: { type: Number, unique: false, required: false},
            passesPercentage: { type: Number, unique: false, required: false},
        },
        away: {
            teamId: { type: Number, unique: false, required: false},
            points: { type: Number, unique: false, required: false},
            lineScore: {type: Array, unique: false, required: false},
            shotsOnGoal: { type: Number, unique: false, required: false},
            shotsOffGoal: { type: Number, unique: false, required: false},
            totalShots: { type: Number, unique: false, required: false},
            blockedShot: { type: Number, unique: false, required: false},
            shotsInsidebox: { type: Number, unique: false, required: false},
            shotsOutsidebox: { type: Number, unique: false, required: false},
            fouls: { type: Number, unique: false, required: false},
            cornerKicks: { type: Number, unique: false, required: false},
            offsides: { type: Number, unique: false, required: false},
            ballPossessionPercentage: { type: Number, unique: false, required: false},
            yellowCards: { type: Number, unique: false, required: false},
            redCards: { type: Number, unique: false, required: false},
            goalkeeperSaves: { type: Number, unique: false, required: false},
            totalPasses: { type: Number, unique: false, required: false},
            passesAccurate: { type: Number, unique: false, required: false},
            passesPercentage: { type: Number, unique: false, required: false},
        }
    },
}, { collection: "EPLgame"})

// Define schema methods
EPLgameSchema.methods = {}


const EPLgame = mongoose.model('EPLgame', EPLgameSchema)
module.exports = EPLgame
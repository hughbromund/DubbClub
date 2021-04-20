const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const NBAplayerSchema = new Schema({
    playerInfo: {
        firstName: {type: String, unique: false, required: true},
        lastName: {type: String, unique: false, required: true},
        teamId: {type: Number, unique: false, required: false},
        teamImage: {type: String, unique: false, required: false},
        yearsPro: {type: Number, unique: false, required: false},
        collegeName: {type: String, unique: false, required: false},
        country: {type: String, unique: false, required: false},
        playerId: {type: String, unique: false, required: true},
        dateOfBirth: {type: Date, unique: false, required: false},
        affiliation: {type: String, unique: false, required: false},
        startNba: {type: String, unique: false, required: false},
        heightInMeters: {type: Number, unique: false, required: false},
        weightInKilograms: {type: Number, unique: false, required: false},
        jersey: {type: Number, unique: false, required: false},
        active: {type: Number, unique: false, required: false},
        pos: {type: String, unique: false, required: false},
    },
    seasons: [
        {
            season: {type: String, unique: false, required: true},
            teamId: {type: Number, unique: false, required: true},
            teamImage: {type: String, unique: false, required: true},
            points: {type: Number, unique: false, required: true},
            pos: {type: String, unique: false, required: true},
            min: {type: Number, unique: false, required: true},
            fgm: {type: Number, unique: false, required: true},
            fga: {type: Number, unique: false, required: true},
            fgp: {type: Number, unique: false, required: true},
            ftm: {type: Number, unique: false, required: true},
            fta: {type: Number, unique: false, required: true},
            ftp: {type: Number, unique: false, required: true},
            tpm: {type: Number, unique: false, required: true},
            tpa: {type: Number, unique: false, required: true},
            tpp: {type: Number, unique: false, required: true},
            offReb: {type: Number, unique: false, required: true},
            defReb: {type: Number, unique: false, required: true},
            totReb: {type: Number, unique: false, required: true},
            assists: {type: Number, unique: false, required: true},
            pFouls: {type: Number, unique: false, required: true},
            steals: {type: Number, unique: false, required: true},
            turnovers: {type: Number, unique: false, required: true},
            blocks: {type: Number, unique: false, required: true},
            plusMinus: {type: Number, unique: false, required: true},
            playerId: {type: Number, unique: false, required: true},
        }
    ],
    career: {
        season: "historical",
        teamId: {type: Number, unique: false, required: true},
        teamImage: {type: String, unique: false, required: true},
        points: {type: Number, unique: false, required: true},
        pos: {type: String, unique: false, required: true},
        min: {type: Number, unique: false, required: true},
        fgm: {type: Number, unique: false, required: true},
        fga: {type: Number, unique: false, required: true},
        fgp: {type: Number, unique: false, required: true},
        ftm: {type: Number, unique: false, required: true},
        fta: {type: Number, unique: false, required: true},
        ftp: {type: Number, unique: false, required: true},
        tpm: {type: Number, unique: false, required: true},
        tpa: {type: Number, unique: false, required: true},
        tpp: {type: Number, unique: false, required: true},
        offReb: {type: Number, unique: false, required: true},
        defReb: {type: Number, unique: false, required: true},
        totReb: {type: Number, unique: false, required: true},
        assists: {type: Number, unique: false, required: true},
        pFouls: {type: Number, unique: false, required: true},
        steals: {type: Number, unique: false, required: true},
        turnovers: {type: Number, unique: false, required: true},
        blocks: {type: Number, unique: false, required: true},
        plusMinus: {type: Number, unique: false, required: true},
        playerId: {type: Number, unique: false, required: true},
    },
    mostRecentGame: {
        gameId: {type: Number, unique: false, required: true},
        teamId: {type: Number, unique: false, required: true},
        points: {type: Number, unique: false, required: true},
        pos: {type: String, unique: false, required: true},
        min: {type: Number, unique: false, required: true},
        fgm: {type: Number, unique: false, required: true},
        fga: {type: Number, unique: false, required: true},
        fgp: {type: Number, unique: false, required: true},
        ftm: {type: Number, unique: false, required: true},
        fta: {type: Number, unique: false, required: true},
        ftp: {type: Number, unique: false, required: true},
        tpm: {type: Number, unique: false, required: true},
        tpa: {type: Number, unique: false, required: true},
        tpp: {type: Number, unique: false, required: true},
        offReb: {type: Number, unique: false, required: true},
        defReb: {type: Number, unique: false, required: true},
        totReb: {type: Number, unique: false, required: true},
        assists: {type: Number, unique: false, required: true},
        pFouls: {type: Number, unique: false, required: true},
        steals: {type: Number, unique: false, required: true},
        turnovers: {type: Number, unique: false, required: true},
        blocks: {type: Number, unique: false, required: true},
        plusMinus: {type: Number, unique: false, required: true},
        playerId: {type: Number, unique: false, required: true},
    }
}, { collection: "NBAplayer"})

// Define schema methods
NBAplayerSchema.methods = {}


const NBAplayer = mongoose.model('NBAplayer', NBAplayerSchema)
module.exports = NBAplayer
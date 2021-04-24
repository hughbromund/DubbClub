const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const NBAplayerSchema = new Schema({
    playerInfo: {
        firstName: {type: String, unique: false, required: false},
        lastName: {type: String, unique: false, required: false},
        teamId: {type: Number, unique: false, required: false},
        teamImage: {type: String, unique: false, required: false},
        yearsPro: {type: Number, unique: false, required: false},
        collegeName: {type: String, unique: false, required: false},
        country: {type: String, unique: false, required: false},
        playerId: {type: Number, unique: false, required: false},
        externPlayerId: {type: Number, unique: false, required: false},
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
            season: {type: String, unique: false, required: false},
            teamId: {type: Number, unique: false, required: false},
            teamImage: {type: String, unique: false, required: false},
            points: {type: Number, unique: false, required: false},
            pos: {type: String, unique: false, required: false},
            min: {type: String, unique: false, required: false},
            fgm: {type: Number, unique: false, required: false},
            fga: {type: Number, unique: false, required: false},
            fgp: {type: Number, unique: false, required: false},
            ftm: {type: Number, unique: false, required: false},
            fta: {type: Number, unique: false, required: false},
            ftp: {type: Number, unique: false, required: false},
            tpm: {type: Number, unique: false, required: false},
            tpa: {type: Number, unique: false, required: false},
            tpp: {type: Number, unique: false, required: false},
            offReb: {type: Number, unique: false, required: false},
            defReb: {type: Number, unique: false, required: false},
            reb: {type: Number, unique: false, required: false},
            assists: {type: Number, unique: false, required: false},
            pFouls: {type: Number, unique: false, required: false},
            steals: {type: Number, unique: false, required: false},
            turnovers: {type: Number, unique: false, required: false},
            blocks: {type: Number, unique: false, required: false}
        }
    ],
    career: {
        season: {type: String, unique: false, required: false, default: "Historical"},
        points: {type: Number, unique: false, required: false},
        pos: {type: String, unique: false, required: false},
        min: {type: String, unique: false, required: false},
        fgm: {type: Number, unique: false, required: false},
        fga: {type: Number, unique: false, required: false},
        fgp: {type: Number, unique: false, required: false},
        ftm: {type: Number, unique: false, required: false},
        fta: {type: Number, unique: false, required: false},
        ftp: {type: Number, unique: false, required: false},
        tpm: {type: Number, unique: false, required: false},
        tpa: {type: Number, unique: false, required: false},
        tpp: {type: Number, unique: false, required: false},
        offReb: {type: Number, unique: false, required: false},
        defReb: {type: Number, unique: false, required: false},
        reb: {type: Number, unique: false, required: false},
        assists: {type: Number, unique: false, required: false},
        pFouls: {type: Number, unique: false, required: false},
        steals: {type: Number, unique: false, required: false},
        turnovers: {type: Number, unique: false, required: false},
        blocks: {type: Number, unique: false, required: false}
    },
    mostRecentGame: {
        gameId: {type: Number, unique: false, required: false},
        teamId: {type: Number, unique: false, required: false},
        points: {type: Number, unique: false, required: false},
        pos: {type: String, unique: false, required: false},
        min: {type: String, unique: false, required: false},
        fgm: {type: Number, unique: false, required: false},
        fga: {type: Number, unique: false, required: false},
        fgp: {type: Number, unique: false, required: false},
        ftm: {type: Number, unique: false, required: false},
        fta: {type: Number, unique: false, required: false},
        ftp: {type: Number, unique: false, required: false},
        tpm: {type: Number, unique: false, required: false},
        tpa: {type: Number, unique: false, required: false},
        tpp: {type: Number, unique: false, required: false},
        offReb: {type: Number, unique: false, required: false},
        defReb: {type: Number, unique: false, required: false},
        totReb: {type: Number, unique: false, required: false},
        assists: {type: Number, unique: false, required: false},
        pFouls: {type: Number, unique: false, required: false},
        steals: {type: Number, unique: false, required: false},
        turnovers: {type: Number, unique: false, required: false},
        blocks: {type: Number, unique: false, required: false},
        plusMinus: {type: Number, unique: false, required: false},
        playerId: {type: Number, unique: false, required: false},
    }
}, { collection: "NBAplayer"})

// Define schema methods
NBAplayerSchema.methods = {}


const NBAplayer = mongoose.model('NBAplayer', NBAplayerSchema)
module.exports = NBAplayer
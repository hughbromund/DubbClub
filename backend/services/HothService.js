const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const MLBteam = require(path.resolve(__dirname, "../database/models/MLBteam"));

const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();


// TO BE IMPLEMENTED BY ADITYA
exports.getHothPredictions = async function(games) {
  
}

exports.updateDbWithGamesAndPredictions = async function(upcoming, predictions) {
    for (var i = 0; i < upcoming.length; i++) {

        gameInDb = await MLBgame.findOne({ id : upcoming[i].gamePk }).exec()

        if (gameInDb === null) {
            let homeTeam = await MLBteam.findOne({ teamId : upcoming[i].teams.home.team.id }).exec()
            let awayTeam = await MLBteam.findOne({ teamId : upcoming[i].teams.away.team.id }).exec()
    
            let arena = upcoming[i].venue.name
    
            const game = new MLBgame({
                id: upcoming[i].gamePk,
                date: new Date(upcoming[i].gameDate),
                arena: arena,
                home: homeTeam,
                away: awayTeam,
                predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence,
                status: "Scheduled"
            })
    
            MLBgame.updateOne({ id : upcoming[i].gamePk }, {$set : game}, {upsert : true}).exec()
        } else {
            let homeTeam = await MLBteam.findOne({ teamId : upcoming[i].teams.home.team.id }).exec()
            let awayTeam = await MLBteam.findOne({ teamId : upcoming[i].teams.away.team.id }).exec()
            gameInDb = await MLBgame.findOneAndUpdate({ id : upcoming[i].gamePk}, {predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence, home : homeTeam, away: awayTeam}).exec()
        }
    }
}
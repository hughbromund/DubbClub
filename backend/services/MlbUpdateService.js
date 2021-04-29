const path = require("path");
const axios = require("axios");
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const MLBteam = require(path.resolve(__dirname, "../database/models/MLBteam"));

const mlbService = require(path.resolve(__dirname, "../services/MlbService.js"));
const mlbUserService = require(path.resolve(__dirname, "../services/MlbUserService"));
const hothService = require(path.resolve(__dirname, "../services/HothService.js"));

function getUpdatedElos(hElo, aElo, runDiff) {

    hElo = 1601.24
    aElo = 1556.87
    
    Oh = 0
    Oa = 0
    if (runDiff < 0) {
        Oh = 0
        Oa = 1
    } else if (runDiff == 0) {
        Oh = 0.5
        Oa = 0.5
    } else {
        Oh = 1
        Oa = 0
    }
    
    K = 20
    homeAd = 24
    dr = hElo - aElo + homeAd
    Eh = 1.0 / (1 + Math.pow(10, (-dr / 400.0)))
    Ea = 1 - Eh
    
    G = 1
    if (Math.abs(runDiff) > 1) {
        G = Math.log2(1.0 * Math.abs(runDiff)) * 0.7 / (2 + 0.001 * dr)
    }
    
    hEloPost = hElo + K * G * (Oh - Eh)
    aEloPost = aElo + K * G * (Oa - Ea)

    return [hEloPost, aEloPost]
}

exports.refresh = async function refresh() {
   let upcoming = await mlbService.getUpcomingGameInfoPlusCurr()

   for (let i = 0; i < upcoming.length; i++) {
      gameId = upcoming[i].gamePk
      gameInDb = await MLBgame.findOne({ id : gameId }).exec()
      
      if (gameInDb != null) {
        //transition to live game
        if (gameInDb.status === "Scheduled" && upcoming[i].status.statusCode === "I") {
            await MLBgame.findOneAndUpdate({id : gameId}, {status: "In Play"}).exec()
            console.log("Updated game " + gameId + " to In Play.")
            mlbUserService.notifications(gameInDb)
        }

        //transition to finished game
        if (gameInDb.status === "In Play" && upcoming[i].status.statusCode === "F") {
            await MLBgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
            console.log("Updated game " + gameId + " to Finished.")

            // Recalculate ELO for teams
            let homeTeam = await MLBteam.findOne({ teamId : gameInDb.home.teamId }).exec()
            let awayTeam = await MLBteam.findOne({ teamId : gameInDb.away.teamId }).exec()
            let homeElo = homeTeam.elo
            let awayElo = awayTeam.elo
            let runDiff = gameInDb.homeScore - gameInDb.awayScore

            let newElos = getUpdatedElos(homeElo, awayElo, runDiff)

            await MLBteam.findOneAndUpdate({teamId : gameInDb.home.teamId }, {elo: newElos[0]}).exec()
            await MLBteam.findOneAndUpdate({teamId : gameInDb.away.teamId }, {elo: newElos[1]}).exec()
            // End ELO calc
            
        }

        if (upcoming[i].status.statusCode === "I") {
            await updateDbWithLivePredictions(upcoming[i].gamePk, gameInDb)
        }
      }
   }
}

async function updateDbWithLivePredictions(gameId, gameInDb) {
    let game = await axios.get("https://statsapi.mlb.com/api/v1/game/" + gameId + "/winProbability")
    let gameData = await axios.get("http://statsapi.mlb.com/api/v1.1/game/" + gameId + "/feed/live")
    game = game.data[(game.data).length - 1]


    let liveObj = {
        "awayConfidence": game.awayTeamWinProbability / 100,
        "homeConfidence": game.homeTeamWinProbability / 100,
        "period": 1,
        "timeElapsed": gameInDb.livePredictions.length + 1,
        "inning": game.about.inning,
        "half": game.about.halfInning
    }

    let lineScore = []
    let inningData = gameData.data.liveData.linescore.innings
    for (let i = 0; i < inningData.length; i++) {
        let homeRuns = 0
        let awayRuns = 0
        if (inningData[i].home.runs != null) {
            homeRuns = inningData[i].home.runs
        }
        if (inningData[i].away.runs != null) {
            awayRuns = inningData[i].away.runs
        }
        lineScore.push({"inning" : inningData[i].num, "homeScore": homeRuns, "awayScore": awayRuns})
    }

    // ADITYA ADD ELO CHANGES HERE

    gameData = gameData.data.liveData.boxscore.teams
    MLBgame.updateOne(
        { id: gameId }, {"homeScore": gameData.home.teamStats.batting.runs, "awayScore": gameData.away.teamStats.batting.runs, 
        "inning": game.about.inning, "half": game.about.halfInning, "lineScore": lineScore, "$push": {livePredictions: liveObj }}
     ).exec()

}
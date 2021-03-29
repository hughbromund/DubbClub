const path = require("path");
const axios = require("axios");
const NBAteam = require("../database/models/NBAteam");
const NBAgame = require("../database/models/NBAgame");

//async not working with mustafar
exports.getMustafarPredictions = async function(gameIds) {
    let results = []

    for (var i = 0; i < gameIds.length; i++) {
        let url = "https://mustafar.dubb.club/predictnbawin/" + gameIds[i]
        let res = await axios.get(url)
        results.push(res.data)
    }

    return results
}

exports.updateDbWithPredictions = async function(upcoming, predictions) {
    for (var i = 0; i < upcoming.length; i++) {

        gameInDb = await NBAgame.findOne({ id : upcoming[i].gameId }).exec()

        if (gameInDb === null) {
            const homeTeam = new NBAteam({
                teamId: upcoming[i].home.teamId,
                teamName: upcoming[i].home.teamName,
                teamImage: upcoming[i].home.teamImage,
                wins: upcoming[i].home.wins,
                losses: upcoming[i].home.losses,
                conferenceName: upcoming[i].home.conferenceName,
                place: upcoming[i].home.place,
            });
    
            const awayTeam = new NBAteam({
                teamId: upcoming[i].away.teamId,
                teamName: upcoming[i].away.teamName,
                teamImage: upcoming[i].away.teamImage,
                wins: upcoming[i].away.wins,
                losses: upcoming[i].away.losses,
                conferenceName: upcoming[i].away.conferenceName,
                place: upcoming[i].away.place,
            });
    
            let arena = (upcoming[i].arena === "" || upcoming[i].arena === undefined) ? "TBD" : upcoming[i].arena
    
            const game = new NBAgame({
                id: upcoming[i].gameId,
                date: new Date(upcoming[i].date),
                arena: arena,
                home: homeTeam,
                away: awayTeam,
                predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence,
                status: "Scheduled"
            });
    
            NBAgame.updateOne({ id : upcoming[i].gameId }, {$set : game}, {upsert : true}).exec()
        } else {
            gameInDb = await NBAgame.findOneAndUpdate({ id : upcoming[i].gameId}, {predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence}).exec()
        }

        
    }
}

exports.updateDbWithLivePredictions = async function(upcoming, liveGames) {

    home = await NBAteam.findOne({ teamId : parseInt(upcoming.hTeam.teamId, 10) }).exec()
    away = await NBAteam.findOne({ teamId : parseInt(upcoming.vTeam.teamId, 10) }).exec()
    
    liveGame = {}

    gamesList = liveGames.api.games

    for (let i = 0; i < gamesList.length; i++) {
        if (parseInt(gamesList[i].gameId, 10) === parseInt(upcoming.gameId, 10)) {
            liveGame = gamesList[i]
            break
        }
    }

    let request = {
        "period": liveGame.currentPeriod.slice(0,1),
        "clock": liveGame.clock,
        "homeScore": liveGame.hTeam.score.points,
        "awayScore": liveGame.vTeam.score.points,
        "homeELO": home.elo,
        "awayELO": away.elo,
        "homeID": liveGame.hTeam.teamId,
        "awayID": liveGame.vTeam.teamId
    }

    let url = "https://mustafar.dubb.club/predictnbalivewin"
    res = await axios.get(url, {params: request})

    console.log(res.data)

    NBAgame.updateOne(
        { id: parseInt(upcoming.gameId, 10) },
        { "$push": {livePredictions: res.data }}
     ).exec()

     return res.data
}
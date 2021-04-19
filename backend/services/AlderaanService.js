const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const EPLteam = require("../database/models/EPLteam");
const EPLgame = require("../database/models/EPLgame");


//async not working with mustafar

exports.getAlderaanPredictions = async function(upcoming) {
    //upcoming contains all data from the api
    //will likely require you lookup each team from database as needed before call to alderaan.

    let results = []
    //temp results
    for (var i = 0; i < upcoming.length; i++) {
        results.push({pred_winner: upcoming[i].teams.away.id, confidence: .6})
    }

    /*
    for (var i = 0; i < upcoming.length; i++) {
        let url = "https://mustafar.dubb.club/predictnbawin/" + gameIds[i]
        let res = await axios.get(url)
        results.push(res.data)
    }
    */
    return results
}



exports.getUpcomingGamesAPI = async function() {
    var start = new Date();
    var end = new Date();
    // console.log(start)
    start.setDate(start.getDate() - 1)
    end.setDate(end.getDate() + 2)
  
    var options = {
        method: 'GET',
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures", //+ start.toISOString().slice(0,10),
        headers: {
            'x-rapidapi-key': config.nbaApiKey,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        },
        params: {
            league: 39,
            from: start.toISOString().slice(0,10),
            to: end.toISOString().slice(0,10),
            timezone: "America/Indiana/Indianapolis",
            season: 2020,
        }
    }
    let request = await axios.request(options)    
    return request.data.response;
 }


exports.updateDbWithPredictions = async function(upcoming, predictions) {
    for (var i = 0; i < upcoming.length; i++) {

        gameInDb = await EPLgame.findOne({ id : upcoming[i].fixture.id }).exec()

        if (gameInDb === null) {
            console.log(predictions[i])
            const homeTeam = new EPLteam({
                teamId: upcoming[i].teams.home.id,
                teamName: upcoming[i].teams.home.name,
                teamImage: upcoming[i].teams.home.logo,
                /*
                wins: 
                draws: 
                losses: 
                standing: 
                elo: ,
                position: ,
                lastGameID: ,
                goalsFor: ,
                goalsAgainst: ,
                biggestWinAway: ,
                biggestWinHome: ,
                goalsAverageAway: ,
                goalsAverageHome: ,
                */
            });
    
            const awayTeam = new EPLteam({
                teamId: upcoming[i].teams.away.id,
                teamName: upcoming[i].teams.away.name,
                teamImage: upcoming[i].teams.away.logo,
            });
    
            let arena = (upcoming[i].fixture.venue.name === "" || upcoming[i].fixture.venue.name === undefined) ? "TBD" : upcoming[i].fixture.venue.name
    
            const game = new EPLgame({
                id: upcoming[i].fixture.id,
                date: new Date(upcoming[i].fixture.date),
                arena: arena,
                home: homeTeam,
                away: awayTeam,
                predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence,
                status: "Scheduled"
            });
    
            EPLgame.updateOne({ id : upcoming[i].fixture.id }, {$set : game}, {upsert : true}).exec()
        } else {
            gameInDb = await EPLgame.findOneAndUpdate({ id : upcoming[i].fixture.id}, {predictedWinner: predictions[i].pred_winner,
                confidence: predictions[i].confidence}).exec()
        }

        
    }
}

 


exports.updateDbWithLivePredictions = async function(upcoming) {

    home = await EPLteam.findOne({ teamId : parseInt(upcoming.teams.home.id, 10) }).exec()
    away = await EPLteam.findOne({ teamId : parseInt(upcoming.teams.away.id, 10) }).exec()
    

    /*
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

    liveObj = {
        "awayConfidence": res.data.awayConfidence,
        "homeConfidence": res.data.homeConfidence,
        "period": res.data.period,
        "timeElapsed": res.data.timeElapsed,
        "homeScore": liveGame.hTeam.score.points,
        "awayScore": liveGame.vTeam.score.points
    }
    */

    /*

    EPLgame.updateOne(
        { id: parseInt(upcoming.fixture.id, 10) }, 
        {
            "$push": {livePredictions: liveObj }
        }
     ).exec()
    */
    
}
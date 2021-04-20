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

        homeId = upcoming[i].teams.home.id
        awayId = upcoming[i].teams.away.id
        fixtureSeason = upcoming[i].league.season
        fixtureLeague = upcoming[i].league.id

        // Home stats
        var options = {
            method: 'GET',
            url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
            headers: {
                'x-rapidapi-key': config.nbaApiKey,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            },
            params: {season: fixtureSeason.toString(), team: homeId.toString(), league: fixtureLeague.toString()},
        }
        let request = await axios.request(options)    
        let homeData = request.data.response;

        // Away stats
        var options = {
            method: 'GET',
            url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
            headers: {
                'x-rapidapi-key': config.nbaApiKey,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            },
            params: {season: fixtureSeason.toString(), team: awayId.toString(), league: fixtureLeague.toString()},
        }
        request = await axios.request(options)
        let awayData = request.data.response;

        // Calculate last 5 win percentage for each team
        let hWinPercent5 = 0.0
        if (homeData.fixtures.played.total < 5) {
            hWinPercent5 = parseFloat(homeData.fixtures.wins.total) / parseFloat(homeData.fixtures.played.total)
        } else {
            let hForm5 = homeData.form
            hForm5 = hForm5.substr(hForm5.length - 5)
            let hCount = 0
            for (let i = 0; i < hForm5.length; i++) {
                if (hForm5.charAt(i) == 'W') {
                    hCount++
                }
            }
            hWinPercent5 = parseFloat(hCount / 5.0)
        }

        // Calculate last 5 win percentage for each team
        let aWinPercent5 = 0.0
        if (awayData.fixtures.played.total < 5) {
            aWinPercent5 = parseFloat(awayData.fixtures.wins.total) / parseFloat(awayData.fixtures.played.total)
        } else {
            let aForm5 = awayData.form
            aForm5 = aForm5.substr(aForm5.length - 5)
            let aCount = 0
            for (let i = 0; i < aForm5.length; i++) {
                if (aForm5.charAt(i) == 'W') {
                    aCount++
                }
            }
            aWinPercent5 = parseFloat(aCount / 5.0)
        }

        // TODO: fill ELO's from DB
        let alderaan_params = {
            "hEloBefore": 1500.0,
            "aEloBefore": 1500.0,
            "hMatchPlayed": homeData.fixtures.played.total,
            "aMatchPlayed": awayData.fixtures.played.total,
            "hGoalDiff": homeData.goals.for.total.total - homeData.goals.against.total.total,
            "aGoalDiff": awayData.goals.for.total.total - awayData.goals.against.total.total,
            "hWinPercent": parseFloat(homeData.fixtures.wins.total) / parseFloat(homeData.fixtures.played.total),
            "aWinPercent": parseFloat(awayData.fixtures.wins.total) / parseFloat(awayData.fixtures.played.total),
            "hWinPercentLast5": hWinPercent5,
            "aWinPercentLast5": aWinPercent5,
            "goalDiffDiff": homeData.goals.for.total.total - homeData.goals.against.total.total - 
                (awayData.goals.for.total.total - awayData.goals.against.total.total)
        }
    
        // TODO: change to deployed URL
        let url = "https://alderaan-dot-dubbclub.uc.r.appspot.com/predicteplpregame"
        // let url = "http://127.0.0.1:5000/predicteplpregame"
        res = await axios.get(url, {params: alderaan_params})

        console.log(res.data)

        results.push(res.data)
    }
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
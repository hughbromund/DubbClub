const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const EPLteam = require("../database/models/EPLteam");
const EPLgame = require("../database/models/EPLgame");


function getUpdatedElos(hElo, aElo, goalDiff) {
    Oh = 0
    Oa = 0
    if (goalDiff < 0) {
        Oh = 0
        Oa = 1
    } else if (goalDiff == 0) {
        Oh = 0.5
        Oa = 0.5
    } else {
        Oh = 1
        Oa = 0
    }

    K = 20
    homeAd = 65
    dr = hElo - aElo + homeAd
    Eh = 1.0 / (1 + Math.pow(10, (-dr / 400.0)))
    Ea = 1 - Eh

    G = 1
    if (Math.abs(goalDiff) > 1) {
        G = Math.log2(1.7 * Math.abs(goalDiff)) * 2 / (2 + 0.001 * dr)
    }

    hEloPost = hElo + K * G * (Oh - Eh)
    aEloPost = aElo + K * G * (Oa - Ea)

    return [hEloPost, aEloPost]
}

//async not working with mustafar

exports.getAlderaanPredictions = async function(upcoming) {
    //upcoming contains all data from the api
    //will likely require you lookup each team from database as needed before call to alderaan.

    var fixtureOptions = {
        method: 'GET',
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures", //+ start.toISOString().slice(0,10),
        headers: {
            'x-rapidapi-key': config.nbaApiKey,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        },
        params: {}
    }

    let results = []
    //temp results
    for (var i = 0; i < upcoming.length; i++) {

        homeId = upcoming[i].teams.home.id
        awayId = upcoming[i].teams.away.id

        console.log(upcoming[i].teams.home.name)
        console.log(upcoming[i].teams.away.name)
        console.log(upcoming[i].fixture.id)

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

        // Get last game ID's from DB
        home = await EPLteam.findOne({ teamId : parseInt(homeId) }).exec()
        away = await EPLteam.findOne({ teamId : parseInt(awayId) }).exec()

        var hLastGameDB = home.lastGameID
        var aLastGameDB = away.lastGameID

        // Get home recorded last game
        var apiParams = {
            id: hLastGameDB
        }
        fixtureOptions.params = apiParams
        request = await axios.request(fixtureOptions)
        hRecordedGameObj = request.data.response[0]

        // Get away recorded last game
        apiParams = {
            id: aLastGameDB
        }
        fixtureOptions.params = apiParams
        request = await axios.request(fixtureOptions)
        aRecordedGameObj = request.data.response[0]

        // Get home last game
        apiParams = {
            league: fixtureLeague,
            last: 1,
            team: homeId,
            season: fixtureSeason,
        }
        fixtureOptions.params = apiParams
        request = await axios.request(fixtureOptions)
        hLatestGameObj = request.data.response[0]

        // Get home last game
        apiParams = {
            league: fixtureLeague,
            last: 1,
            team: awayId,
            season: fixtureSeason,
        }
        fixtureOptions.params = apiParams
        request = await axios.request(fixtureOptions)
        aLatestGameObj = request.data.response[0]

        hDBGameDate = new Date(hRecordedGameObj.fixture.date)
        aDBGameDate = new Date(aRecordedGameObj.fixture.date)
        hLatestDate = new Date(hLatestGameObj.fixture.date)
        aLatestDate = new Date(aLatestGameObj.fixture.date)

        if (hDBGameDate < hLatestDate) {
            // Update elos for home team latest game fixture
            var goalDiff = hLatestGameObj.goals.home - hLatestGameObj.goals.away
            var hLatestHTeam = await EPLteam.findOne({ teamId : parseInt(hLatestGameObj.teams.home.id) }).exec()
            var hLatestATeam = await EPLteam.findOne({ teamId : parseInt(hLatestGameObj.teams.away.id) }).exec()
            var hLatestHElo = hLatestHTeam.elo
            var hLatestAElo = hLatestATeam.elo

            var elos = getUpdatedElos(hLatestHElo, hLatestAElo, goalDiff)

            var otherId = -1

            if (hLatestGameObj.teams.home.id == homeId) {
                EPLteam.updateOne({ teamId : homeId }, {$set : {elo: elos[0], lastGameID: hLatestGameObj.fixture.id}}, {upsert : true}).exec()
                otherId = hLatestGameObj.teams.away.id
            } else {
                EPLteam.updateOne({ teamId : homeId }, {$set : {elo: elos[1], lastGameID: hLatestGameObj.fixture.id}}, {upsert : true}).exec()
                otherId = hLatestGameObj.teams.home.id
            }

            // Check if other team's last game should be updated
            otherTeam = await EPLteam.findOne({ teamId : parseInt(otherId) }).exec()
            apiParams = {
                id: otherTeam.lastGameID
            }
            fixtureOptions.params = apiParams
            request = await axios.request(fixtureOptions)
            var otherLastGame = request.data.response[0]
            otherGameDate = new Date(otherLastGame.fixture.date)

            if (otherGameDate < hLatestDate) {
                if (hLatestGameObj.teams.home.id == homeId) {
                    EPLteam.updateOne({ teamId : otherId }, {$set : {elo: elos[1], lastGameId: hLatestGameObj.fixture.id}}, {upsert : true}).exec()
                } else {
                    EPLteam.updateOne({ teamId : otherId }, {$set : {elo: elos[0], lastGameID: hLatestGameObj.fixture.id}}, {upsert : true}).exec()
                }
            }
        }

        if (aDBGameDate < aLatestDate) {
            // Update elos for away team latest game fixture
            var goalDiff = aLatestGameObj.goals.home - aLatestGameObj.goals.away
            var aLatestHTeam = await EPLteam.findOne({ teamId : parseInt(aLatestGameObj.teams.home.id) }).exec()
            var aLatestATeam = await EPLteam.findOne({ teamId : parseInt(aLatestGameObj.teams.away.id) }).exec()
            var aLatestHElo = aLatestHTeam.elo
            var aLatestAElo = aLatestATeam.elo

            var elos = getUpdatedElos(aLatestHElo, aLatestAElo, goalDiff)

            var otherId = -1

            if (aLatestGameObj.teams.home.id == awayId) {
                EPLteam.updateOne({ teamId : awayId }, {$set : {elo: elos[0], lastGameID: aLatestGameObj.fixture.id}}, {upsert : true}).exec()
                otherId = aLatestGameObj.teams.away.id
            } else {
                EPLteam.updateOne({ teamId : awayId }, {$set : {elo: elos[1], lastGameID: aLatestGameObj.fixture.id}}, {upsert : true}).exec()
                otherId = aLatestGameObj.teams.home.id
            }

            // Check if other team's last game should be updated
            otherTeam = await EPLteam.findOne({ teamId : parseInt(otherId) }).exec()
            apiParams = {
                id: otherTeam.lastGameID
            }
            fixtureOptions.params = apiParams
            request = await axios.request(fixtureOptions)
            var otherLastGame = request.data.response[0]
            otherGameDate = new Date(otherLastGame.fixture.date)

            if (otherGameDate < hLatestDate) {
                if (aLatestGameObj.teams.home.id == awayId) {
                    EPLteam.updateOne({ teamId : otherId }, {$set : {elo: elos[1], lastGameID: aLatestGameObj.fixture.id}}, {upsert : true}).exec()
                } else {
                    EPLteam.updateOne({ teamId : otherId }, {$set : {elo: elos[0], lastGameID: aLatestGameObj.fixture.id}}, {upsert : true}).exec()
                }
            }

        }

        home = await EPLteam.findOne({ teamId : parseInt(homeId) }).exec()
        away = await EPLteam.findOne({ teamId : parseInt(awayId) }).exec()

        let alderaan_params = {
            "hEloBefore": home.elo,
            "aEloBefore": away.elo,
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
    
        let url = "https://alderaan-dot-dubbclub.uc.r.appspot.com/predicteplpregame"
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
    end.setDate(end.getDate() + 4)
  
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
            const homeTeam = new EPLteam({
                teamId: upcoming[i].teams.home.id,
                teamName: upcoming[i].teams.home.name,
                teamImage: upcoming[i].teams.home.logo,
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
                homeWinProb: predictions[i].homeWinProb,
                awayWinProb: predictions[i].awayWinProb,
                drawProb: predictions[i].drawProb,
                status: "Scheduled"
            });
    
            EPLgame.updateOne({ id : upcoming[i].fixture.id }, {$set : game}, {upsert : true}).exec()
        } else {
            gameInDb = await EPLgame.findOneAndUpdate({ id : upcoming[i].fixture.id}, {
                homeWinProb: predictions[i].homeWinProb,
                awayWinProb: predictions[i].awayWinProb,
                drawProb: predictions[i].drawProb,
            }).exec()
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
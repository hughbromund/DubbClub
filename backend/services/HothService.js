const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const MLBteam = require(path.resolve(__dirname, "../database/models/MLBteam"));

// TO BE IMPLEMENTED BY ADITYA
exports.getHothPredictions = async function(games) {

    predArr = []
    var now = new Date()
    var tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 2)

    var startDateStr = (tenDaysAgo.getMonth() + 1) + "/" + tenDaysAgo.getDate() + "/" + tenDaysAgo.getFullYear()
    var endDateStr = (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear()

    for (let i = 0; i < games.length; i++) {

        let gameId = games[i].gameId

        // Get team id's for game
        let game = await axios.get("http://statsapi.mlb.com/api/v1.1/game/" + gameId + "/feed/live")
        let homeId = game.data.gameData.teams.home.id
        let awayId = game.data.gameData.teams.away.id

        // Get various statistics in last 10 days
        statParams = {
            stats: "byDateRange",
            group: "hitting",
            season: 2021,
            startDate: startDateStr,
            endDate: endDateStr
        }
        let hittingStats = await axios.get("https://statsapi.mlb.com/api/v1/teams/stats", { params: statParams })
        hittingStats = hittingStats.data.stats[0].splits
        statParams.group = "fielding"
        let fieldingStats = await axios.get("https://statsapi.mlb.com/api/v1/teams/stats", { params: statParams })
        fieldingStats = fieldingStats.data.stats[0].splits
        statParams.group = "pitching"
        let pitchingStats = await axios.get("https://statsapi.mlb.com/api/v1/teams/stats", { params: statParams })
        pitchingStats = pitchingStats.data.stats[0].splits

        let hothParams = {}
        // Fill in batting stats
        for (let i = 0; i < hittingStats.length; i++) {
            if (hittingStats[i].team.id == homeId) {
                // Add hitting stats for home team
                let gamesPlayed = hittingStats[i].stat.gamesPlayed.toFixed(2)
                hothParams.hAtBats = hittingStats[i].stat.atBats / gamesPlayed
                hothParams.hHits = hittingStats[i].stat.hits / gamesPlayed
                hothParams.h2 = hittingStats[i].stat.doubles / gamesPlayed
                hothParams.h3 = hittingStats[i].stat.triples / gamesPlayed
                hothParams.hHR = hittingStats[i].stat.homeRuns / gamesPlayed
                hothParams.hRBI = hittingStats[i].stat.rbi / gamesPlayed
                hothParams.hSacFlies = hittingStats[i].stat.sacFlies / gamesPlayed
                hothParams.hHitByPitch = hittingStats[i].stat.hitByPitch / gamesPlayed
                hothParams.hBasesStolen = hittingStats[i].stat.stolenBases / gamesPlayed
                hothParams.hCaughtStealing = hittingStats[i].stat.caughtStealing / gamesPlayed
                hothParams.hGround2 = hittingStats[i].stat.groundIntoDoublePlay / gamesPlayed
                hothParams.hLeftOnBase = hittingStats[i].stat.leftOnBase / gamesPlayed
                hothParams.hRuns = hittingStats[i].stat.runs / gamesPlayed
            } else if (hittingStats[i].team.id == awayId) {
                // Add hitting stats for away team
                let gamesPlayed = hittingStats[i].stat.gamesPlayed.toFixed(2)
                hothParams.aAtBats = hittingStats[i].stat.atBats / gamesPlayed
                hothParams.aHits = hittingStats[i].stat.hits / gamesPlayed
                hothParams.a2 = hittingStats[i].stat.doubles / gamesPlayed
                hothParams.a3 = hittingStats[i].stat.triples / gamesPlayed
                hothParams.aHR = hittingStats[i].stat.homeRuns / gamesPlayed
                hothParams.aRBI = hittingStats[i].stat.rbi / gamesPlayed
                hothParams.aSacFlies = hittingStats[i].stat.sacFlies / gamesPlayed
                hothParams.aHitByPitch = hittingStats[i].stat.hitByPitch / gamesPlayed
                hothParams.aBasesStolen = hittingStats[i].stat.stolenBases / gamesPlayed
                hothParams.aCaughtStealing = hittingStats[i].stat.caughtStealing / gamesPlayed
                hothParams.aGround2 = hittingStats[i].stat.groundIntoDoublePlay / gamesPlayed
                hothParams.aLeftOnBase = hittingStats[i].stat.leftOnBase / gamesPlayed
                hothParams.aRuns = hittingStats[i].stat.runs / gamesPlayed
            }
        }

        // Fill in fielding stats
        for (let i = 0; i < fieldingStats.length; i++) {
            if (fieldingStats[i].team.id == homeId) {
                // Add fielding stats for home team
                let gamesPlayed = fieldingStats[i].stat.games.toFixed(2)
                hothParams.hPutouts = fieldingStats[i].stat.putOuts / gamesPlayed
                hothParams.hAssists = fieldingStats[i].stat.assists / gamesPlayed
                hothParams.hErrors = fieldingStats[i].stat.errors / gamesPlayed
                hothParams.h2Plays = fieldingStats[i].stat.doublePlays / gamesPlayed
                hothParams.h3Plays = fieldingStats[i].stat.triplePlays / gamesPlayed
            } else if (hittingStats[i].team.id == awayId) {
                // Add fielding stats for away team
                let gamesPlayed = fieldingStats[i].stat.games.toFixed(2)
                hothParams.aPutouts = fieldingStats[i].stat.putOuts / gamesPlayed
                hothParams.aAssists = fieldingStats[i].stat.assists / gamesPlayed
                hothParams.aErrors = fieldingStats[i].stat.errors / gamesPlayed
                hothParams.a2Plays = fieldingStats[i].stat.doublePlays / gamesPlayed
                hothParams.a3Plays = fieldingStats[i].stat.triplePlays / gamesPlayed
            }
        }

        // Fill in pitching stats
        for (let i = 0; i < pitchingStats.length; i++) {
            if (pitchingStats[i].team.id == homeId) {
                // Add pitching stats for home team
                let gamesPlayed = pitchingStats[i].stat.gamesPlayed
                hothParams.hWalks = parseFloat(pitchingStats[i].stat.walksPer9Inn) * parseFloat(pitchingStats[i].stat.inningsPitched) / 9.0 / gamesPlayed
                hothParams.hIntWalks = pitchingStats[i].stat.intentionalWalks / gamesPlayed
                hothParams.hKO = pitchingStats[i].stat.strikeOuts / gamesPlayed
                hothParams.hEarnedRuns = pitchingStats[i].stat.earnedRuns / gamesPlayed
                hothParams.hWildPitches = pitchingStats[i].stat.wildPitches / gamesPlayed
                hothParams.hBalks = pitchingStats[i].stat.balks / gamesPlayed
            } else if (hittingStats[i].team.id == awayId) {
                // Add pitching stats for away team
                let gamesPlayed = pitchingStats[i].stat.gamesPlayed.toFixed(2)
                hothParams.aWalks = parseFloat(pitchingStats[i].stat.walksPer9Inn) * parseFloat(pitchingStats[i].stat.inningsPitched) / 9.0 / gamesPlayed
                hothParams.aIntWalks = pitchingStats[i].stat.intentionalWalks / gamesPlayed
                hothParams.aKO = pitchingStats[i].stat.strikeOuts / gamesPlayed
                hothParams.aEarnedRuns = pitchingStats[i].stat.earnedRuns / gamesPlayed
                hothParams.aWildPitches = pitchingStats[i].stat.wildPitches / gamesPlayed
                hothParams.aBalks = pitchingStats[i].stat.balks / gamesPlayed
            }
        }

        hothParams.hId = homeId
        hothParams.aId = awayId

        homeObj = await MLBteam.findOne({ teamId : parseInt(homeId) }).exec()
        awayObj = await MLBteam.findOne({ teamId : parseInt(awayId) }).exec()

        hothParams.hEloBefore = homeObj.elo
        hothParams.aEloBefore = awayObj.elo

        // Get pitcher data if necessary
        if (games[i].homePitcher + '' === '' || games[i].awayPitcher + '' === '') {
            console.log('Missing pitcher(s)')
            hothParams.hasPitcher = "false"
        } else {
            console.log('Have pitchers')
            hothParams.hasPitcher = "true"
            pitcherParams = {
                season: 2021,
                hydrate: "stats(type=season,season=2021,gameType=R)",
                personIds: games[i].homePitcher
            }

            // Home pitcher
            homePitcherStats = await axios.get("https://statsapi.mlb.com/api/v1/people", { params: pitcherParams })
            homePitcherStats = homePitcherStats.data.people[0].stats[0].splits[0].stat

            // Away pitcher
            pitcherParams.personIds = games[i].awayPitcher
            awayPitcherStats = await axios.get("https://statsapi.mlb.com/api/v1/people", { params: pitcherParams })
            awayPitcherStats = awayPitcherStats.data.people[0].stats[0].splits[0].stat

            // Calculate RGS
            homePitcherRGS = 47.4 + homePitcherStats.strikeOuts + (homePitcherStats.outs * 1.5) - 
                (parseFloat(homePitcherStats.walksPer9Inn) * parseFloat(homePitcherStats.inningsPitched) / 9.0 * 2.0) - 
                (homePitcherStats.hits * 2.0) - (homePitcherStats.runs * 3.0) - (homePitcherStats.homeRuns * 4.0)

            awayPitcherRGS = 47.4 + awayPitcherStats.strikeOuts + (awayPitcherStats.outs * 1.5) - 
                (parseFloat(awayPitcherStats.walksPer9Inn) * parseFloat(awayPitcherStats.inningsPitched) / 9.0 * 2.0) - 
                (awayPitcherStats.hits * 2.0) - (awayPitcherStats.runs * 3.0) - (awayPitcherStats.homeRuns * 4.0)

            hothParams.hRGS = homePitcherRGS
            hothParams.aRGS = awayPitcherRGS
        }

        let pred = await axios.get("https://hoth-dot-dubbclub.uc.r.appspot.com/predictmlbpregame", { params: hothParams })
        predArr.push(pred.data)
    }

    return predArr
  
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
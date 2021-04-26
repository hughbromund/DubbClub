const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));
const NBAplayer = require(path.resolve(__dirname, "../database/models/NBAplayer"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


exports.getPlayer = async function getPlayer(playerId) {
    let player = await NBAplayer.findOne({ "playerInfo.playerId" : playerId }).exec()
    if (player === null) {
        let res = await updatePlayerById(playerId)
        player = await NBAplayer.findOne({ "playerInfo.playerId" : playerId }).exec()
    } 
    return player
}

//2020 - 2021: 8133-
//2019 - 2020: 7699-8125
//2018 - 2019: 4308-6221
//2017 - 2018: 2842-4234
//2016 - 2017: 1428-2840
//2015 - 2016: 1-1427

updatePlayerById = async function updatePlayerByID(playerId) {
    var gmOptions = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/statistics/players/playerId/" + playerId,
        headers: {
          'x-rapidapi-key': config.nbaApiKey,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    }

    let playerStats = await axios.request(gmOptions)
    playerStats = playerStats.data.api.statistics

    let player = await NBAplayer.findOne({ "playerInfo.playerId" : playerId }).exec()

    //if a new player -> create new player and upload to db
    if (player === null) {
        let playerInfo = await createPlayerInfo(playerId)
        let externId = await findExternApiId(playerInfo.firstName, playerInfo.lastName)
        if (externId === -1) {
            console.log("Can't correlate " + playerInfo.firstName + " " + playerInfo.lastName)
            return
        }
        playerInfo.externPlayerId = externId
        let seasonAvgs = await createSeasonAvgs(externId, playerInfo.startNba)
        let careerAvgs = await createCareerAvg(seasonAvgs)
        let mostRecentGame = await createMostRecentGame(playerStats[playerStats.length - 1])
        nbaPlayer = {"playerInfo": playerInfo, "mostRecentGame": mostRecentGame, "seasons": seasonAvgs, "career": careerAvgs}
        let res = await NBAplayer.updateOne({"playerInfo.playerId" : playerId}, {$set: nbaPlayer}, {upsert : true}).exec()
        console.log("added player with ID " + playerId)
        return res
    } else {
        let mostRecentGame = await createMostRecentGame(playerStats[playerStats.length - 1])
        await NBAplayer.updateOne({"playerInfo.playerId": playerId}, {"mostRecentGame": mostRecentGame}).exec()
        console.log("updated player with ID " + playerId)
    }
}

exports.updatePlayerById = updatePlayerById

exports.updatePlayersByGame = async function populateDb(gameId) {
    var gmOptions = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/statistics/players/gameId/" + gameId,
        headers: {
          'x-rapidapi-key': config.nbaApiKey,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    }

    let playersInGame = await axios.request(gmOptions)
    playersInGame = playersInGame.data.api.statistics

    for (let i = 0; i < playersInGame.length; i++) {
        let player = await NBAplayer.findOne({ "playerInfo.playerId" : playersInGame[i].playerId }).exec()

        //if a new player -> create new player and upload to db
        if (player === null && playersInGame[i].min != "0:00" && playersInGame[i].teamId != null) {
            let playerInfo = await createPlayerInfo(playersInGame[i].playerId)
            let externId = await findExternApiId(playerInfo.firstName, playerInfo.lastName)
            if (externId === -1) {
                console.log("Can't correlate " + playerInfo.firstName + " " + playerInfo.lastName)
                continue
            }
            playerInfo.externPlayerId = externId
            let seasonAvgs = await createSeasonAvgs(externId, playerInfo.startNba)
            let careerAvgs = await createCareerAvg(seasonAvgs)
            let mostRecentGame = await createMostRecentGame(playersInGame[i])
            nbaPlayer = {"playerInfo": playerInfo, "mostRecentGame": mostRecentGame, "seasons": seasonAvgs, "career": careerAvgs}
            await NBAplayer.updateOne({"playerInfo.playerId" : playersInGame[i].playerId}, {$set: nbaPlayer}, {upsert : true}).exec()
            console.log("added player with ID " + playerInfo.playerId)
        } else if (player != null) {
            let mostRecentGame = await createMostRecentGame(playersInGame[i])
            await NBAplayer.updateOne({"playerInfo.playerId": playersInGame[i].playerId}, {"mostRecentGame": mostRecentGame}).exec()
            console.log("updated player with ID " + playersInGame[i].playerId)
        }
    }

}

async function createPlayerInfo(playerId) {
    var options = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/players/playerId/" + playerId,
        headers: {
          'x-rapidapi-key': config.nbaApiKey,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    }

    let player = await axios.request(options)
    player = player.data.api.players[0]
    let playerInfo = {}

    if (player.startNba == 0) {
        player.startNba = 2019
    }

    if (player.teamId === null) {
        playerInfo = {
            firstName: player.firstName,
            lastName: player.lastName,
            yearsPro: player.yearsPro,
            collegeName: player.collegeName,
            country: player.country,
            playerId: player.playerId,
            externPlayerId: 0,
            dateOfBirth: player.dateOfBirth,
            affiliation: player.affiliation,
            startNba: player.startNba,
            heightInMeters: player.heightInMeters,
            weightInKilograms: player.weightInKilograms,
            jersey: player.leagues.standard.jersey,
            active: player.leagues.standard.active,
            pos: player.leagues.standard.pos,
        }
    } else {
        let team = await NBAteam.findOne({ teamId : player.teamId }).exec()

        playerInfo = {
            firstName: player.firstName,
            lastName: player.lastName,
            teamId: player.teamId,
            teamImage: team.teamImage,
            yearsPro: player.yearsPro,
            collegeName: player.collegeName,
            country: player.country,
            playerId: player.playerId,
            externPlayerId: 0,
            dateOfBirth: player.dateOfBirth,
            affiliation: player.affiliation,
            startNba: player.startNba,
            heightInMeters: player.heightInMeters,
            weightInKilograms: player.weightInKilograms,
            jersey: player.leagues.standard.jersey,
            active: player.leagues.standard.active,
            pos: player.leagues.standard.pos,
        }
    }

    return playerInfo
}

async function createMostRecentGame(player) {
    return {
        "points": player.points,
        "min": player.min,
        "fgm": player.fgm,
        "fga": player.fga,
        "fgp": player.fgp / 100,
        "ftm": player.ftm,
        "fta": player.fta,
        "ftp": player.ftp / 100,
        "tpm": player.tpm,
        "tpa": player.tpa,
        "tpp": player.tpp / 100,
        "offReb": player.offReb,
        "defReb": player.defReb,
        "reb": player.totReb,
        "assists": player.assists,
        "pFouls": player.pFouls,
        "steals": player.steals,
        "turnovers": player.turnovers,
        "blocks": player.blocks
    }
}

async function createSeasonAvgs(externId, startNba) {
    let year = startNba
    let seasons = []

    let end = 2021

    if (year == 0) {
        year = 2019
    }
    
    while (year < end) {
        console.log(year)
        let seasonAvg = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=" + year + "&player_ids[]=" + externId)
        seasonAvg = seasonAvg.data.data[0]
        if (seasonAvg === undefined) {
            year++
            continue
        }
        seasons.push(await createSeasonObj(seasonAvg, externId))
        year++
    }

    return seasons
}

async function createCareerAvg(seasonAvgs) {
    let totalGames = 0
    let pointsGm = 0
    let seconds = 0
    let fgm = 0
    let fga = 0
    let fgp = 0
    let ftm = 0
    let fta = 0
    let ftp = 0
    let tpm = 0
    let tpa = 0
    let tpp = 0
    let offRebGm = 0
    let defRebGm = 0
    let rebGm = 0
    let assistsGm = 0
    let pFoulsGm = 0
    let stealsGm = 0
    let turnoversGm = 0
    let blocksGm = 0

    for (let i = 0; i < seasonAvgs.length; i++) {
        totalGames += seasonAvgs[i].numGames
    }

    for (let i = 0; i < seasonAvgs.length; i++) {
        let percentPlayed = seasonAvgs[i].numGames / totalGames
        pointsGm += percentPlayed * seasonAvgs[i].points
        seconds += (parseInt(seasonAvgs[i].min.substring(0, seasonAvgs[i].min.indexOf(":")), 10) * 60) 
        + parseInt(seasonAvgs[i].min.substring(seasonAvgs[i].min.indexOf(":") + 1) ,10) 
        //min += percentPlayed * seasonAvgs[i].min
        fgm += percentPlayed * seasonAvgs[i].fgm
        fga += percentPlayed * seasonAvgs[i].fga
        fgp += percentPlayed * seasonAvgs[i].fgp
        ftm += percentPlayed * seasonAvgs[i].ftm
        fta += percentPlayed * seasonAvgs[i].fta
        ftp += percentPlayed * seasonAvgs[i].ftp
        tpm += percentPlayed * seasonAvgs[i].tpm
        tpa += percentPlayed * seasonAvgs[i].tpa
        tpp += percentPlayed * seasonAvgs[i].tpp
        offRebGm += percentPlayed * seasonAvgs[i].offReb
        defRebGm += percentPlayed * seasonAvgs[i].defReb
        rebGm += percentPlayed * seasonAvgs[i].reb
        assistsGm += percentPlayed * seasonAvgs[i].assists
        pFoulsGm += percentPlayed * seasonAvgs[i].pFouls
        stealsGm += percentPlayed * seasonAvgs[i].steals
        turnoversGm += percentPlayed * seasonAvgs[i].turnovers
        blocksGm += percentPlayed * seasonAvgs[i].blocks
    }

    return {
        "season": "historical",
        "numGames": totalGames,
        "points": pointsGm,
        "min": Math.round((seconds / 60)) + ":" + (seconds % 60),
        "fgm": fgm,
        "fga": fga,
        "fgp": fgp,
        "ftm": ftm,
        "fta": fta,
        "ftp": ftp,
        "tpm": tpm,
        "tpa": tpa,
        "tpp": tpp,
        "offReb": offRebGm,
        "defReb": defRebGm,
        "reb": rebGm,
        "assists": assistsGm,
        "pFouls": pFoulsGm,
        "steals": stealsGm,
        "turnovers": turnoversGm,
        "blocks": blocksGm
    }
}

async function findExternApiId(firstName, lastName) {
    let secondRes = await axios.get("https://www.balldontlie.io/api/v1/players?search=" + lastName)
    secondRes = secondRes.data.data

    if (secondRes.length === 1) {
        return secondRes[0].id
    }

    let firstRes = await axios.get("https://www.balldontlie.io/api/v1/players?search=" + firstName)
    firstRes = firstRes.data.data

    if (firstRes.length === 1) {
        return firstRes[0].id
    }

    let firstList = []
    let lastList = []
    
    for (let i = 0; i < firstRes.length; i++) {
        firstList.push(firstRes[i].id)
    }

    for (let i = 0; i < secondRes.length; i++) {
        lastList.push(secondRes[i].id)
    }

    for (let i = 0; i < lastList.length; i++) {
        if (firstList.includes(lastList[i])) {
            return lastList[i]
        }
    }

    return -1
}

async function createSeasonObj(seasonAvg, externId) {
    let teamName = await axios.get("https://www.balldontlie.io/api/v1/stats?seasons[]=" + seasonAvg.season + "&player_ids[]=" + externId)
    teamNm = teamName.data.data[0].team.full_name
    let team = await NBAteam.findOne({ teamName : teamNm }).exec()
    return {
        "teamId": team.teamId,
        "teamImage": team.teamImage,
        "season": seasonAvg.season,
        "numGames": seasonAvg.games_played,
        "points": seasonAvg.pts,
        "min": seasonAvg.min,
        "fgm": seasonAvg.fgm,
        "fga": seasonAvg.fga,
        "fgp": seasonAvg.fg_pct,
        "ftm": seasonAvg.ftm,
        "fta": seasonAvg.fta,
        "ftp": seasonAvg.ft_pct,
        "tpm": seasonAvg.fg3m,
        "tpa": seasonAvg.fg3a,
        "tpp": seasonAvg.fg3_pct,
        "offReb": seasonAvg.oreb,
        "defReb": seasonAvg.dreb,
        "reb": seasonAvg.reb,
        "assists": seasonAvg.ast,
        "pFouls": seasonAvg.pf,
        "steals": seasonAvg.stl,
        "turnovers": seasonAvg.turnover,
        "blocks": seasonAvg.blk
    }
}
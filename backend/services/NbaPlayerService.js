const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));

exports.playerStub = async function() {
    let mostRecentGame = {
        "gameId": "8998",
        "teamId": "1",
        "points": "12",
        "pos": "C",
        "min": "28:19",
        "fgm": "5",
        "fga": "7",
        "fgp": "71.4",
        "ftm": "2",
        "fta": "4",
        "ftp": "50.0",
        "tpm": "0",
        "tpa": "0",
        "tpp": "0.0",
        "offReb": "5",
        "defReb": "7",
        "totReb": "12",
        "assists": "1",
        "pFouls": "3",
        "steals": "0",
        "turnovers": "1",
        "blocks": "3",
        "plusMinus": "31",
        "playerId": "92"
    }

    let second = {
        "season": "2020-21",
        "teamId": "1",
        "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png",
        "points": "24",
        "pos": "C",
        "min": "32:10",
        "fgm": "10",
        "fga": "16",
        "fgp": "62.5",
        "ftm": "4",
        "fta": "6",
        "ftp": "66.7",
        "tpm": "0",
        "tpa": "0",
        "tpp": "0.0",
        "offReb": "5",
        "defReb": "13",
        "totReb": "18",
        "assists": "0",
        "pFouls": "3",
        "steals": "1",
        "turnovers": "1",
        "blocks": "2",
        "plusMinus": "-3",
        "playerId": "92"
    }

    let third = {
        "season": "2019-20",
        "teamId": "1",
        "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png",
        "points": "14",
        "pos": "C",
        "min": "28:42",
        "fgm": "5",
        "fga": "8",
        "fgp": "62.5",
        "ftm": "4",
        "fta": "6",
        "ftp": "66.7",
        "tpm": "0",
        "tpa": "0",
        "tpp": "0.0",
        "offReb": "2",
        "defReb": "8",
        "totReb": "10",
        "assists": "0",
        "pFouls": "2",
        "steals": "2",
        "turnovers": "2",
        "blocks": "6",
        "plusMinus": "20",
        "playerId": "92"
    }

    let historical = {
        "season": "historical",
        "points": "28",
        "pos": "C",
        "min": "44:25",
        "fgm": "9",
        "fga": "15",
        "fgp": "60.0",
        "ftm": "10",
        "fta": "10",
        "ftp": "100",
        "tpm": "0",
        "tpa": "0",
        "tpp": "0.0",
        "offReb": "6",
        "defReb": "11",
        "totReb": "17",
        "assists": "0",
        "pFouls": "3",
        "steals": "0",
        "turnovers": "0",
        "blocks": "5",
        "plusMinus": "3",
        "playerId": "92"
    }

    let playerInfo = {
        "firstName": "Clint",
        "lastName": "Capela",
        "teamId": "1",
        "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png",
        "yearsPro": "6",
        "collegeName": "Elan Chalon",
        "country": "Switzerland",
        "playerId": "92",
        "dateOfBirth": "1994-05-18",
        "affiliation": "Elan Chalon/Switzerland",
        "startNba": "2014",
        "heightInMeters": "2.08",
        "weightInKilograms": "108.9",
        "leagues": {
            "standard": {
                "jersey": "15",
                "active": "1",
                "pos": "C"
            }
        }
    }

    return {"playerInfo": playerInfo, "mostRecentGame": mostRecentGame, "seasons": [third, second], "career": historical}
}

//2020 - 2021: 8133-
//2019 - 2020: 7699-8125
//2018 - 2019: 4308-6221
//2017 - 2018: 2842-4234
//2016 - 2017: 1428-2840
//2015 - 2016: 1-1427

exports.populateDb = async function populateDb() {
    var options = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/players/playerId/92",
        headers: {
          'x-rapidapi-key': config.nbaApiKey,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    }

    let player = await axios.request(options)
    player = player.data.api.players[0]

    let team = await NBAteam.findOne({ teamId : player.teamId }).exec()

    let playerInfo = {
        firstName: player.firstName,
        lastName: player.lastName,
        teamId: player.teamId,
        teamImage: team.teamImage,
        yearsPro: player.yearsPro,
        collegeName: player.collegeName,
        country: player.country,
        playerId: player.playerId,
        dateOfBirth: player.dateOfBirth,
        affiliation: player.affiliation,
        startNba: player.startNba,
        heightInMeters: player.heightInMeters,
        weightInKilograms: player.weightInKilograms,
        jersey: player.leagues.standard.jersey,
        active: player.leagues.standard.active,
        pos: player.leagues.standard.pos,
    }

    let year = playerInfo.startNba
    let totalGamesPlayed = 0
    let seasons = []
    

    while (year < new Date().getFullYear - 1) {
        let seasonAvgs = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=" + year + " &player_ids[]=83")
        seasonAvgs = seasonAvgs.data[0]
        totalGamesPlayed += seasonAvgs.games_played
        seasons.push(createSeasonObj(seasonAvgs))
    }

    return seasons

}

async function createSeasonObj(seasonAvgs) {
    console.log(seasonAvgs)
    let team = await NBAteam.findOne({ teamId : teamId }).exec()
    return {
        "teamId": teamId,
        "teamImage": team.teamImage,
        "season": season,
        "numGames": numGames,
        "points": totPoints,
        "min": min,
        "fgm": fgm,
        "fga": fga,
        "fgp": fgp,
        "ftm": ftm,
        "fta": fta,
        "ftp": ftp,
        "tpm": tpm,
        "tpa": tpa,
        "tpp": tpp,
        "offReb": totOffReb,
        "defReb": totDefReb,
        "totReb": totReb,
        "totRebGm": totRebGm,
        "totAssists": totAssists,
        "assistsGm": assistsGm,
        "totPFouls": totPFouls,
        "pFoulsGm": pFoulsGm,
        "totSteals": totSteals,
        "stealsGm": stealsGm,
        "totTurnovers": totTurnovers,
        "turnoversGm": turnoversGm,
        "totBlocks": totBlocks,
        "blocksGm": blocksGm,
        "totPlusMinus": totPlusMinus,
        "plusMinusGm": plusMinusGm
    }
}

exports.doobedo = async function() {
    let res = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=1&player_ids[]=2")
    console.log(res.data.data)

    return res.data
}
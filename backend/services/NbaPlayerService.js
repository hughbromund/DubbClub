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

    return [mostRecentGame, third, second, historical]
}
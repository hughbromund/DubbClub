const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));


exports.getUpcomingGameIdsStub = function() {
    result = []
    for (var i = 0; i < Math.floor(Math.random() * (50 - 10) + 10); i++) {
        var num = Math.floor(Math.random() * (9999 - 1000) + 1000)
        result.push(num)
    }
    
    return result;
}

exports.getGameIdsByDateStub = function(date) {
    result = []
    for (var i = 0; i < Math.floor(Math.random() * (50 - 10) + 10); i++) {
        var num = Math.floor(Math.random() * (9999 - 1000) + 1000)
        result.push(num)
    }
    
    return result;
}

exports.getGameIdsByTeamStub = function() {
    result = []
    for (var i = 0; i < Math.floor(Math.random() * (50 - 10) + 10); i++) {
        var num = Math.floor(Math.random() * (9999 - 1000) + 1000)
        result.push(num)
    }
    
    return result;
}


exports.getGameDetailsByGameIdStub = function(gameId) {
    var rand = Math.random()
    /*
    result = {
        id: ,
        date: ,
        arena: ,
        home: ,
        away: ,
        status: ,
        playedGameStats: ,
        homeScore: ,
        awayScore: ,
        period: ,
        clock:  ,
        predictedWinner: ,
        confidence: ,
        homeVoters: ,
        awayVoters: ,

    } 
    */

    if (rand <= .33) {

        result = {
            game: {
                id: 592809,
                date: "2021-04-16T19:00:00+00:00",
                arena: "Goodison Park",
                home: {
                    teamId: 45,
                    teamName: "Everton",
                    teamImage: "https://media.api-sports.io/football/teams/45.png",
                },
                away: {
                    teamId: 47,
                    teamName: "Tottenham",
                    teamImage: "https://media.api-sports.io/football/teams/47.png",
                },
                status: "Scheduled",
                homeScore: null,
                awayScore: null,
                predictedWinner: "home",
                confidence: .51,
                homeVoters: [],
                awayVoters: [],
            },
            votedTeam: "none",
            message: "Success!",
        }
        /*
        result = { 
            "fixture": {
                "id": 592809,
                "referee": null,
                "timezone": "UTC",
                "date": "2021-04-16T19:00:00+00:00",
                "timestamp": 1618599600,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": 8560,
                    "name": "Goodison Park",
                    "city": "Liverpool"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2020,
                "round": "Regular Season - 32"
            },
            "teams": {
                "home": {
                    "id": 45,
                    "name": "Everton",
                    "logo": "https://media.api-sports.io/football/teams/45.png",
                    "winner": null
                },
                "away": {
                    "id": 47,
                    "name": "Tottenham",
                    "logo": "https://media.api-sports.io/football/teams/47.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        }
        */
    }
    else if (rand <= .67) {
        result = {
            game: {
                id: 592804,
                date: "2021-04-12T17:00:00+00:00",
                arena: "The Hawthorns",
                home: {
                    teamId: 60,
                    teamName: "West Brom",
                    teamImage: "https://media.api-sports.io/football/teams/60.png",
                },
                away: {
                    teamId: 41,
                    teamName: "Southampton",
                    teamImage: "https://media.api-sports.io/football/teams/41.png",
                },
                status: "Finished",
                homeScore: 3,
                awayScore: 0,
                predictedWinner: "away",
                confidence: .58,
                homeVoters: [],
                awayVoters: [],
                livePredictions: [],
                playedGameStats: {
                    home: {
                        teamId: 60,
                        points: 3,
                        shotsOnGoal: 3,
                        shotsOffGoal: 2,
                        totalShots: 9,
                        blockedShot: 4,
                        shotsInsidebox: 4,
                        shotsOutsidebox: 5,
                        fouls: 22,
                        cornerKicks: 3,
                        offsides: 1,
                        ballPossessionPercentage: 32,
                        yellowCards: 5,
                        redCards: 1,
                        goalkeeperSaves: 0,
                        totalPasses: 242,
                        passesAccurate: 121,
                        passesPercentage: 50,
                    },
                    away: {
                        teamId: 41,
                        points: 0,
                        shotsOnGoal: 5,
                        shotsOffGoal: 3,
                        totalShots: 11,
                        blockedShot: 3,
                        shotsInsidebox: 2,
                        shotsOutsidebox: 7,
                        fouls: 13,
                        cornerKicks: 2,
                        offsides: 3,
                        ballPossessionPercentage: 68,
                        yellowCards: 3,
                        redCards: 2,
                        goalkeeperSaves: 1,
                        totalPasses: 213,
                        passesAccurate: 130,
                        passesPercentage: 62,
                    }
                },
                period: 2,
                clock: 90
            },
            votedTeam: "none",
            message: "Success!",
        }

        /*
        result = {
            "fixture": {
                "id": 592804,
                "referee": "Simon Hooper, England",
                "timezone": "UTC",
                "date": "2021-04-12T17:00:00+00:00",
                "timestamp": 1618246800,
                "periods": {
                    "first": 1618246800,
                    "second": 1618250400
                },
                "venue": {
                    "id": 597,
                    "name": "The Hawthorns",
                    "city": "West Bromwich"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2020,
                "round": "Regular Season - 31"
            },
            "teams": {
                "home": {
                    "id": 60,
                    "name": "West Brom",
                    "logo": "https://media.api-sports.io/football/teams/60.png",
                    "winner": true
                },
                "away": {
                    "id": 41,
                    "name": "Southampton",
                    "logo": "https://media.api-sports.io/football/teams/41.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 3,
                "away": 0
            },
            "score": {
                "halftime": {
                    "home": 2,
                    "away": 0
                },
                "fulltime": {
                    "home": 3,
                    "away": 0
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        }
        */
    }
    else {
        result = {
            game: {
                id: 592804,
                date: "2021-04-12T17:00:00+00:00",
                arena: "The Hawthorns",
                home: {
                    teamId: 2649,
                    teamImage: "https://media.api-sports.io/football/teams/2649.png",
                    teamName: "Borac Cacak",
                },
                away: {
                    teamId: 2640,
                    teamImage: "https://media.api-sports.io/football/teams/2640.png",
                    teamName: "Radnicki Pirot",
                },
                status: "In Play",
                homeScore: 0,
                awayScore: 0,
                predictedWinner: "away",
                confidence: .67,
                homeVoters: [],
                awayVoters: [],
                livePredictions: [],
                playedGameStats: {
                    home: {
                        teamId: 2649,
                        points: 3,
                        shotsOnGoal: 3,
                        shotsOffGoal: 2,
                        totalShots: 9,
                        blockedShot: 4,
                        shotsInsidebox: 4,
                        shotsOutsidebox: 5,
                        fouls: 22,
                        cornerKicks: 3,
                        offsides: 1,
                        ballPossessionPercentage: 32,
                        yellowCards: 5,
                        redCards: 1,
                        goalkeeperSaves: 0,
                        totalPasses: 242,
                        passesAccurate: 121,
                        passesPercentage: 50,
                    },
                    away: {
                        teamId: 2640,
                        points: 0,
                        shotsOnGoal: 5,
                        shotsOffGoal: 3,
                        totalShots: 11,
                        blockedShot: 3,
                        shotsInsidebox: 2,
                        shotsOutsidebox: 7,
                        fouls: 13,
                        cornerKicks: 2,
                        offsides: 3,
                        ballPossessionPercentage: 68,
                        yellowCards: 3,
                        redCards: 2,
                        goalkeeperSaves: 1,
                        totalPasses: 213,
                        passesAccurate: 130,
                        passesPercentage: 62,
                    }
                },
                period: 1,
                clock: 7
            },
            votedTeam: "none",
            message: "Success!",
        }
        /*
        result = {
            "fixture": {
                "date": "2021-04-07T14:00:00+00:00",
                "id": 568987,
                "periods": {
                    "first": 1617804000,
                    "second": NULL,
                },
                "referee": NULL,
                "status": {
                    "elapsed": 7,
                    "long": "First Half",
                    "short": "1H",
                },
                "timestamp": 1617804000,
                "timezone": "UTC",
                "venue": {
                    "city": "Pirot",
                    "id": 2909,
                    "name": "Stadion Dragan Nikolić",
                },
            },
            "goals":{
                "away": 0,
                "home": 0,
            },
            "league":{
                "country": "Serbia",
                "flag": "https://media.api-sports.io/flags/rs.svg",
                "id": 287,
                "logo": "https://media.api-sports.io/football/leagues/287.png",
                "name": "Prva Liga",
                "round": "Regular Season - 26",
                "season": 2020,
            },
            "score":{
                "extratime": {
                    "away": NULL,
                    "home": NULL,
                },
                "fulltime": {
                    "away": NULL,
                    "home": NULL,
                },
                "halftime": {
                    "away": 0,
                    "home": 0,
                },
                "penalty": {
                    "away": NULL,
                    "home": NULL,
                },
            },
            "teams": {
                "away": {
                    "id": 2649,
                    "logo": "https://media.api-sports.io/football/teams/2649.png",
                    "name": "Borac Cacak",
                    "winner": NULL,
                },
                "home": {
                    "id":2640,
                    "logo": "https://media.api-sports.io/football/teams/2640.png",
                    "name": "Radnicki Pirot",
                    "winner": NULL,
                },
            }
        }*/
    }
    return result;
}

exports.getTeamStatsStub = function(teamId) {
    result = {
        teamId: 33,
        teamName: "Manchester United",
        teamImage: "https://media.api-sports.io/football/teams/33.png",
        wins: 18,
        draws: 7,
        losses: 10,
        goalsFor: 58,
        goalsAgainst: 33,
        position: 2,
        elo: 1600,
        lastGameID: 3243,
        biggestWinAway: "1-4",
        biggestWinHome: "9-0",
        goalsAverageAway: "0.9",
        goalsAverageHome: "1.3",
    }

    return result;
}
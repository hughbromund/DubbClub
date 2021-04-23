const path = require("path");
const EPLgame = require("../database/models/EPLgame");

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


exports.getGameDetails = async function (gameId, userId) {
    var start = new Date();
    let result = await EPLgame.findOne({id: gameId}).exec();

    if (!result) {
        return { message: "Game Not found." }
    }

    var votedTeamVal = "none"
  
    if (userId) {
        if (result.homeVoters.includes(userId)) {
        votedTeamVal = "home"
        }
        else if (result.awayVoters.includes(userId)) {
        votedTeamVal = "away"
        }
    }
  
      return {
        votedTeam: votedTeamVal,
        game: result,
        message: "Successful!"
      }
  }

  exports.getUpcomingGameIds = async function() {
    let start = new Date()
    let end = new Date()
    end.setDate(end.getDate() + 4)
    
    let results = await EPLgame.find({date: {$gt: start, $lt:end}})
    results = {gameIds: results.map(a => a.id)}
    return results
  }
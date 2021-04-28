const path = require("path");
const EPLgame = require("../database/models/EPLgame");
const EPLteam = require("../database/models/EPLteam");
const User = require("../database/models/user");

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


exports.getTeamStats = async function(teamId) {
    result = await EPLteam.findOne({teamId: teamId}).exec();

    if (!result) {
        return { message: "Team Not found." }
    }

    return {team: result, message: "Success!" };
}

exports.getGameDetails = async function (gameId, userId) {
    var start = new Date();
    let result = await EPLgame.findOne({id: gameId}).exec();

    if (!result) {
        return { message: "Game Not found." }
    }
    result = result.toObject();

    result.confidence = result.homeWinProb;
    result.predictedWinner = result.home[0].teamId;

    if (result.awayWinProb > result.homeWinProb) {
        result.confidence = result.awayWinProb;
        result.predictedWinner = result.away[0].teamId;
    }

    if (result.drawProb > result.awayWinProb) {
        result.confidence = result.drawProb;
        result.predictedWinner = -1;
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
    results = {gameIds: results.map(a => a.id), message: "Success!"}
    return results
  }

  exports.getGameIdsByDate = async function(date) {
    let start = new Date(date)
    start.setHours(start.getHours() + 7)
    let end = new Date(start)
    end.setDate(end.getDate() + 1)
    let results = await EPLgame.find({date: {$gte: start, $lte:end}})
    results = {gameIds: results.map(a => a.id), message: "Success!"}
    
    return results;
}

exports.getGameIdsByTeam = async function(teamId) {
    let results = await EPLgame.find({"$or": [{"playedGameStats.home.teamId": teamId}, {"playedGameStats.away.teamId": teamId}]})
    results = {gameIds: results.map(a => a.id), message: "Success!"}

    return results;
}

exports.getDashboard = async function(userId) {
    let start = new Date()
    let end = new Date()
    start.setDate(start.getDate() - 3)
    end.setDate(end.getDate() + 4)
    

    favTeams = {}
    if (userId != undefined) {
      favTeams = await User.findOne({_id: userId}).exec()
      favTeams = favTeams.toObject().favoriteTeams.EPL
    }
  
    let results = await EPLgame.find({date: {$gt: start, $lt:end}})
    let favUpcoming = []
    let regUpcoming = []
    let favLive = []
    let regLive = []
    let favFinished = []
    let regFinished = []
  
    for (let i = 0; i < results.length; i++) {
      if (userId != undefined) {
        if (favTeams.includes(parseInt(results[i].home[0].teamId, 10)) || favTeams.includes(parseInt(results[i].away[0].teamId, 10))) {
            if (results[i].status === "Scheduled") {
                favUpcoming.push(results[i].id)
              } else if (results[i].status === "In Play") {
                favLive.push(results[i].id)
              } else if (results[i].status === "Finished") {
                favFinished.push(results[i].id)
              }
        }
      }
      if (results[i].status === "Scheduled") {
        regUpcoming.push(results[i].id)
      } else if (results[i].status === "In Play") {
        regLive.push(results[i].id)
      } else if (results[i].status === "Finished") {
        regFinished.push(results[i].id)
      }
    }
  
    return {"regFinished": regFinished, "regLive": regLive, "regUpcoming": regUpcoming,
     "favFinished": favFinished, "favLive": favLive, "favUpcoming": favUpcoming}
  
  }

  exports.getAllTeamStats = async function() {
    let results = await EPLteam.find({})
    results = {teams: results, message: "Success!"}

    return results;
}
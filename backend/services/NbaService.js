const path = require("path");
const axios = require("axios");
const User = require("../database/models/user");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));
const nodemailer = require("nodemailer")

exports.getBasicGameInfo = async function() {
  var start = new Date();
  let result = [];

  let requests = [];
  for (var i = 0; i < 4; i++) {
    var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    requests.push(axios.request(options))
    start.setDate(start.getDate() + 1);
  }

  let finishedRequests = await Promise.all(requests)
  start = Date.now()

  for (var i = 0; i < finishedRequests.length; i++) {
    for (var j = 0; j < finishedRequests[i].data.api.games.length; j++) {
      let currGame = finishedRequests[i].data.api.games[j]
      let gameDate = new Date(currGame.startTimeUTC);
      if (currGame.league === "standard" && gameDate > start) {
        let [home, away] = await Promise.all([getTeamStats(currGame.hTeam.teamId, currGame.hTeam.fullName, currGame.hTeam.logo),
          getTeamStats(currGame.vTeam.teamId, currGame.vTeam.fullName, currGame.vTeam.logo)]);
        var game = {"gameId" : currGame.gameId, "date" : currGame.startTimeUTC, "arena" : currGame.arena,
        "home" : home, "away" : away}
        result.push(game);
      }
    } 
  }
  return result;
}

exports.getLightGameInfo = async function() {
  var start = new Date();
  let result = [];

  let requests = [];
  for (var i = 0; i < 4; i++) {
    var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    requests.push(axios.request(options))
    start.setDate(start.getDate() + 1);
  }

  let finishedRequests = await Promise.all(requests)
  start = Date.now()

  for (var i = 0; i < finishedRequests.length; i++) {
    for (var j = 0; j < finishedRequests[i].data.api.games.length; j++) {
      let currGame = finishedRequests[i].data.api.games[j]
      let gameDate = new Date(currGame.startTimeUTC);
      if (currGame.league === "standard" && gameDate > start) {
        result.push(currGame);
      }
    } 
  }
  return result;
}

getLightGameInfoPlusCurr = async function() {
  var start = new Date();
  // console.log(start)
  start.setDate(start.getDate() - 1)
  let result = [];

  let requests = [];
  for (var i = 0; i < 4; i++) {
    var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    requests.push(axios.request(options))
    start.setDate(start.getDate() + 1);
  }

  let finishedRequests = await Promise.all(requests)
  start = new Date(Date.now())
  // console.log(start)
  start.setDate(start.getDate() - 1)

  for (var i = 0; i < finishedRequests.length; i++) {
    for (var j = 0; j < finishedRequests[i].data.api.games.length; j++) {
      let currGame = finishedRequests[i].data.api.games[j]
      let gameDate = new Date(currGame.startTimeUTC);
      if (currGame.league === "standard" && gameDate > start) {
        result.push(currGame);
      }
    } 
  }
  return result;
}
exports.getLightGameInfoPlusCurr = getLightGameInfoPlusCurr

exports.getDashboard = async function(userId) {
  let start = new Date()
  let end = new Date()
  start.setDate(start.getDate() - 3)
  end.setDate(end.getDate() + 4)

  favTeams = {}
  if (userId != undefined) {
    favTeams = await User.findOne({_id: userId}).exec()
    favTeams = favTeams.toObject().favoriteTeams.NBA
  }

  let results = await NBAgame.find({date: {$gt: start, $lt:end}})
  let favUpcoming = []
  let regUpcoming = []
  let favLive = []
  let regLive = []
  let favFinished = []
  let regFinished = []

  for (let i = 0; i < results.length; i++) {
    if (userId != undefined) {
      console.log(favTeams)
      for (let j = 0; j < favTeams.length; j++) {
        if (parseInt(favTeams[j], 10) === parseInt(results[i].home[0].teamId, 10) || parseInt(favTeams[j], 10) === parseInt(results[i].away[0].teamId, 10)) {
          if (results[i].status === "Scheduled") {
            favUpcoming.push(results[i].id)
          } else if (results[i].status === "In Play") {
            favLive.push(results[i].id)
          } else if (results[i].status === "Finished") {
            favFinished.push(results[i].id)
          }
          break
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

exports.getGamesByTeamFromDb = async function(teamId) {
  let results = await NBAgame.find({"$or": [{"home.teamId": teamId}, {"away.teamId": teamId}]})
  let ids = []
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id)
  }
  return ids
}

exports.getGamesByDateFromDb = async function(date) {
  let start = new Date(date)
  start.setHours(start.getHours() + 7)
  let end = new Date(start)
  end.setDate(end.getDate() + 1)
  let results = await NBAgame.find({date: {$gte: start, $lte:end}})

  let ids = []
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id)
    console.log(results[i].date)
  }
  return ids
}

exports.getUpcomingGameIds = async function() {
  var start = new Date();
  let result = [];
  let requests = [];
  for (var i = 0; i < 4; i++) {
    var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    requests.push(axios.request(options))
    start.setDate(start.getDate() + 1);
  }

  let finishedRequests = await Promise.all(requests)
  start = Date.now()

  for (var i = 0; i < finishedRequests.length; i++) {
    for (var j = 0; j < finishedRequests[i].data.api.games.length; j++) {
      let gameDate = new Date(finishedRequests[i].data.api.games[j].startTimeUTC);
      if (finishedRequests[i].data.api.games[j].league === "standard" &&
      gameDate > start) {
        result.push(finishedRequests[i].data.api.games[j].gameId);
      }
    }
  }
  return result;
}

exports.getGamesByDate = async function(date) {
  let result = [];
  var options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/games/date/" + date,
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };
  
  try {
    let res = await axios.request(options);
    let games = res.data.api.games

    for(var i = 0; i < games.length; i++) {
      if (games[i].league === "standard") {
        let [home, away] = await Promise.all([getTeamStats(games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo),
          getTeamStats(games[i].vTeam.teamId, games[i].vTeam.fullName, games[i].vTeam.logo)]);
        let game = {"gameId" : games[i].gameId, "date" : games[i].startTimeUTC, "arena" : games[i].arena,
        "home" : home, "away" : away}
        result.push(game);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

exports.getRecentGamesByTeam = async function(teamId) {
  var start = new Date();
  let result = [];
  var options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/games/teamId/" + teamId,
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    let res = await axios.request(options);
    var games = res.data.api.games
    let foundGames = 0;

    for(var i = games.length - 1; i > 0; i--) {
      let gameDate = new Date(games[i].startTimeUTC);
      if (gameDate <= start) {
        let [home, away, gameStats] = await Promise.all([getTeamStats(games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo),
          getTeamStats(games[i].vTeam.teamId, games[i].vTeam.fullName, games[i].vTeam.logo), getPlayedGameStats(games[i].gameId)]);
        var game = {"gameId" : games[i].gameId, "date" : games[i].startTimeUTC, "arena" : games[i].arena,
        "home" : home, "away" : away, "gameStats" : gameStats}
        result.push(game);
        if (++foundGames == 10) {
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  return result;
}

exports.getGameDetailsByGameId = async function(gameId) {
  let gameStats = await getPlayedGameStats(gameId)
  return gameStats;
}

async function getTeamStats(teamId, teamName, teamImage) {
  var options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/standings/standard/2020/teamId/" + teamId,
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  var team = {}
  try {
    let res = await axios.request(options);
    team = {"teamId" : teamId, "teamName" : teamName, "teamImage" : teamImage,
    "wins" : res.data.api.standings[0].win, "losses" : res.data.api.standings[0].loss,
    "conferenceName" : res.data.api.standings[0].conference.name,
    "place" : res.data.api.standings[0].conference.rank}
  } catch (error) {
    console.log(error)
  }
  return team;
}


getPlayedGameStats = async function(gameId) {
  var options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/gameDetails/" + gameId,
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  let team = {}
  try {
    let res = await axios.request(options);
    let home = {"teamId" : res.data.api.game[0].hTeam.teamId, "points" : res.data.api.game[0].hTeam.score.points,
     "lineScore" : res.data.api.game[0].hTeam.score.linescore, "leaders" : res.data.api.game[0].hTeam.leaders}
    let away = {"teamId" : res.data.api.game[0].vTeam.teamId, "points" : res.data.api.game[0].vTeam.score.points,
    "lineScore" : res.data.api.game[0].vTeam.score.linescore, "leaders" : res.data.api.game[0].vTeam.leaders}
    team = {"home" : home, "away" : away}
  } catch (error) {
    console.log(error)
  }

  return team;
}

exports.getPlayedGameStats = getPlayedGameStats




exports.getGameFromDb = (req, res) => {
  var start = new Date();
  var gameId = req.params.gameId
  NBAgame.findOne({id: gameId}).exec((err, game) => {
    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    if (!game) {
      return res.status(404).send({ message: "Game Not found." });
    }
    var votedTeamVal = "none"

    if (req.userId) {
      if (game.homeVoters.includes(req.userId)) {
        votedTeamVal = "home"
      }
      else if (game.awayVoters.includes(req.userId)) {
        votedTeamVal = "away"
      }
    }

    res.status(200).send({
      votedTeam: votedTeamVal,
      game: game,
      message: "Successful!"
    })
  })
}

exports.getUpcomingGamesFromDb = async function() {
  let start = new Date()
  let end = new Date()
  end.setDate(end.getDate() + 4)
  
  let results = await NBAgame.find({date: {$gt: start, $lt:end}})
  return results
}

exports.getUpcomingGameIdsFromDb = async function() {
  let start = new Date()
  let end = new Date()
  end.setDate(end.getDate() + 4)
  
  let results = await NBAgame.find({date: {$gt: start, $lt:end}})
  ids = []
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id)
  }
  return ids
}

exports.getHighVoteGames = (req, res) => {
  let currdate = new Date()

  NBAgame.find({"date": {"$gte": currdate}}).exec((err, game) => {
    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    if (!game) {
      return res.status(404).send({ message: "Games Not found." });
    }

    for (var i = 0; i < game.length; i++) {
      game[i] = game[i].toObject()

      homeCount = game[i].homeVoters.length
      awayCount = game[i].awayVoters.length
      game[i].voteCount = homeCount + awayCount
      //console.log(game[i])

      var votedTeamVal = "none"

      if (req.userId) {
        if (game[i].homeVoters.includes(req.userId)) {
          votedTeamVal = "home"
        }
        else if (game[i].awayVoters.includes(req.userId)) {
          votedTeamVal = "away"
        }
      }
      game[i].votedTeam = votedTeamVal
    }

    console.log(game[0])

    game.sort((a, b) => (a.voteCount > b.voteCount ? -1 : 1)) //sort by vote count
    //console.log(game)

    /*
    
    */

    res.status(200).send({
      games: game,
      message: "Successful!"
    })
  })

}

exports.getHighPredictDiffGames = (req, res) => {
  let currdate = new Date()

  NBAgame.find({"date": {"$gte": currdate}}).exec((err, game) => {
    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    if (!game) {
      return res.status(404).send({ message: "Games Not found." });
    }

    for (var i = 0; i < game.length; i++) {
      game[i] = game[i].toObject()

      homeCount = game[i].homeVoters.length
      awayCount = game[i].awayVoters.length

      if (homeCount == 0 && awayCount == 0) {
        game[i].predictedWinnerVote = game[i].home[0].teamId
        game[i].confidenceVote = .5
      }
      else {
        if (homeCount >= awayCount) {
          game[i].predictedWinnerVote = game[i].home[0].teamId
          game[i].confidenceVote = homeCount / (homeCount + awayCount)
        }
        else {
          game[i].predictedWinnerVote = game[i].away[0].teamId
          game[i].confidenceVote = awayCount / (homeCount + awayCount)
        }
      }


      if (game[i].predictedWinnerVote == game[i].predictedWinner) {
        game[i].confidenceDifference = Math.abs(game[i].confidence - game[i].confidenceVote)
      }
      else {
        game[i].confidenceDifference = ((game[i].confidence - .5) + (game[i].confidenceVote - .5))
      }


      //console.log(game[i])

      var votedTeamVal = "none"

      if (req.userId) {
        if (game[i].homeVoters.includes(req.userId)) {
          votedTeamVal = "home"
        }
        else if (game[i].awayVoters.includes(req.userId)) {
          votedTeamVal = "away"
        }
      }
      game[i].votedTeam = votedTeamVal
    }

    console.log(game[0])

    game.sort((a, b) => (a.confidenceDifference > b.confidenceDifference ? -1 : 1)) //sort by vote count
    //console.log(game)

    /*
    
    */

    res.status(200).send({
      games: game,
      message: "Successful!"
    })
  })

}

exports.updateTeamStandings = async function() {
  var options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/seasons/",
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  var latest_season = ""

  try {
    let result1 = await axios.request(options);

    var seasonList = result1.data.api.seasons
    latest_season = seasonList[seasonList.length - 1]
  } catch (error) {
    console.log(error)
  }

  options.url = "https://api-nba-v1.p.rapidapi.com/standings/standard/" + latest_season

  try {
    let result2 = await axios.request(options);
    var teamList = result2.data.api.standings
    
    for (var i = 0; i < teamList.length; i++) {
      team = teamList[i]
      var standings_dict = {
        standing: parseInt(team.conference.rank, 10), 
        conference: team.conference.name,
        wins: parseInt(team.win, 10),
        losses: parseInt(team.loss, 10),
        lastTenWins: parseInt(team.lastTenWin, 10),
        lastTenLosses: parseInt(team.lastTenLoss, 10),
        streak: parseInt(team.streak, 10),
        winStreak: parseInt(team.winStreak, 10),
        gamesBehind: parseInt(team.gamesBehind, 10)
      }

      teamInDb = await NBAteam.updateOne({ teamId : team.teamId }, {$set : standings_dict}, {upsert : true}).exec()
    }
  } catch (error) {
    console.log(error)
  }

  return teamList
}

exports.getTeamsFromDb = async function() {
  let teams = await NBAteam.find().exec()
  return teams
}

exports.getLiveGamePreds = (req, res) => {

  var gameId = parseInt(req.params.gameId, 10);

  periodHeader = { 1: 720, 2: 720, 3: 720, 4: 720, 5: 300 };

  NBAgame.findOne({id: gameId}).exec((err, team) => {

    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    predArr = team.livePredictions

    res.status(200).send({
      data: { periodLengths: periodHeader, predictions: predArr },
      message: "Successful!",
    });
  });

};


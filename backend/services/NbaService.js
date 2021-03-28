const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));

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


async function getPlayedGameStats(gameId) {
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
    let home = {"teamId" : res.data.api.game[0].hTeam.teamId, "logo" : res.data.api.game[0].hTeam.logo, "points" : res.data.api.game[0].hTeam.score.points,
     "lineScore" : res.data.api.game[0].hTeam.score.linescore, "leaders" : res.data.api.game[0].hTeam.leaders}
    let away = {"teamId" : res.data.api.game[0].vTeam.teamId, "logo" : res.data.api.game[0].vTeam.logo, "points" : res.data.api.game[0].vTeam.score.points,
    "lineScore" : res.data.api.game[0].vTeam.score.linescore, "leaders" : res.data.api.game[0].vTeam.leaders}
    team = {"home" : home, "away" : away}
  } catch (error) {
    console.log(error)
  }

  return team;
}


exports.userVote = (req, res) => {
  var gameId = req.body.gameId
  var homeAwayOpposite = "away"
  if (req.body.homeAway == "away") {
    var homeAwayOpposite = "home"
  }
  var votersVar = req.body.homeAway + "Voters"
  var votersOpp = homeAwayOpposite + "Voters"

  NBAgame.updateOne({id: gameId}, {"$addToSet": {[votersVar]: req.userId}, "$pull": {[votersOpp]: req.userId}}).exec((err, game) => {
    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    if (!game) {
      return res.status(404).send({ message: "Game Not found." });
    }

    res.status(200).send({message: "Successfully Voted."})
  })

}

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
        winStreak: parseInt(team.streak, 10),
        gamesBehind: parseInt(team.gamesBehind, 10)
      }

      teamInDb = await NBAteam.updateOne({ teamId : team.teamId }, {$set : standings_dict}, {upsert : true}).exec()
    }
  } catch (error) {
    console.log(error)
  }

  return teamList
}

exports.getTeamStandings = (req, res) => {

  NBAteam.find().exec((err, teams) => {

    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    retArr = []

    for (var i = 0; i < teams.length; i++) {
      team = teams[i]
      teams[i] = {
        teamId: team.teamId, 
        conference: team.conference, 
        standing: team.standing,
        wins: team.win,
        losses: team.losses,
        lastTenWins: team.lastTenWins,
        lastTenLosses: team.lastTenLosses,
        winStreak: team.winStreak,
        gamesBehind: team.gamesBehind
      }
    }

    res.status(200).send({
      teams: teams,
      message: "Successful!"
    })
  });
}

exports.getLiveGamePreds = (req, res) => {

  console.log(req.params)

  var league = req.params.league
  league = league.toUpperCase()
  var gameId = parseInt(req.params.gameId, 10)

  periodHeader = {}
  if (league === "NBA") {
    periodHeader = {1: 720, 2: 720, 3: 720, 4: 720, "other": 300}
  }

  // TODO query DB for actual live game info based on game ID
  tempData = [
    {
      "homeConfidence": 0.5,
      "awayConfidence": 0.5,
      "period": 1,
      "timeElapsed": 10
    },
    {
      "homeConfidence": 0.6,
      "awayConfidence": 0.4,
      "period": 1,
      "timeElapsed": 300
    },
    {
      "homeConfidence": 0.7,
      "awayConfidence": 0.4,
      "period": 1,
      "timeElapsed": 700
    },
    {
      "homeConfidence": 0.5,
      "awayConfidence": 0.5,
      "period": 2,
      "timeElapsed": 10
    },
    {
      "homeConfidence": 0.6,
      "awayConfidence": 0.4,
      "period": 2,
      "timeElapsed": 300
    },
    {
      "homeConfidence": 0.7,
      "awayConfidence": 0.4,
      "period": 2,
      "timeElapsed": 700
    },
    {
      "homeConfidence": 0.5,
      "awayConfidence": 0.5,
      "period": 3,
      "timeElapsed": 10
    },
    {
      "homeConfidence": 0.6,
      "awayConfidence": 0.4,
      "period": 3,
      "timeElapsed": 300
    },
    {
      "homeConfidence": 0.7,
      "awayConfidence": 0.4,
      "period": 3,
      "timeElapsed": 700
    }
  ]

  res.status(200).send({
    data: {"periodLengths": periodHeader, "predictions": tempData},
    message: "Successful!"
  })
}
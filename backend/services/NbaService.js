const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));

exports.getBasicGameInfo = async function() {
  var start = new Date();
  let result = [];
  for (var i = 0; i < 3; i++) {
    var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };

    try {
      let res = await axios.request(options);
      var games = res.data.api.games

      for(var i = 0; i < games.length; i++) {
        if (games[i].league === "standard") {
          var home = await getTeamStats(games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo)
          var away = await getTeamStats(games[i].vTeam.teamId, games[i].vTeam.fullName, games[i].vTeam.logo)
          var game = {"gameId" : games[i].gameId, "date" : start.toISOString().slice(0,10), "arena" : games[i].arena,
          "home" : home, "away" : away}
          result.push(game);
        }
      }
    } catch (error) {
      console.log(error);
    }
    
    start.setDate(start.getDate() + 1);
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
        let home = await getTeamStats(games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo)
        let away = await getTeamStats(games[i].vTeam.teamId, games[i].vTeam.fullName, games[i].vTeam.logo)
        let game = {"gameId" : games[i].gameId, "date" : date, "arena" : games[i].arena,
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
        var gameStats = await getPlayedGameStats(games[i].gameId, games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo)
        var game = {"gameId" : games[i].gameId, "date" : start.toISOString().slice(0,10), "arena" : games[i].arena,
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
  let game = {}
  try {
    game = await axios.request(options);
    let home = {"points" : game.api.game.hTeam.score.points, "lineScore" : game.api.game.hTeam.score.points, 
    "leaders" : game.api.game.hTeam.score.leaders}
    let away = {"points" : game.api.game.vTeam.score.points, "lineScore" : game.api.game.vTeam.score.points, 
    "leaders" : game.api.game.vTeam.score.leaders}
    team = {"home" : home, "away" : away}
  } catch (error) {
    console.log(error)
  }

  return team;
}

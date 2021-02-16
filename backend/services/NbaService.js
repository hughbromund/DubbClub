const { json } = require("express");
const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));

exports.getBasicGameInfo = async function() {
  var start = new Date();
  let result = [];
  for (var i = 0; i < 1; i++) {
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
          var game = {"gameId" : games[i].gameId, "date" : start.toISOString().slice(0,10),
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


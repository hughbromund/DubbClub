const { json } = require("express");
const path = require("path");
const request = require('request');
const config = require(path.resolve(__dirname, "../config.json"));

/*
const options = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020',
  headers: {
    'x-rapidapi-key': '5362a63490mshea01f5d67c0821bp19ffd2jsna718407b8af5',
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
    useQueryString: true
  }
};

{
  gameID
  date and time of game
  Team Info : {
    teamID
    teamname
    team image
    team record
    standing
  }
  Team Info : {
    teamID
    teamname
    team image
    team record
    standing
  }
}

*/

exports.getBasicGameInfo = async function() {
  var start = new Date();
  var json = [];
  for (var i = 0; i < 1; i++) {
    const options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/date/" + start.toISOString().slice(0,10),
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        useQueryString: true
      }
    };

    //console.log(options.url);
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var games = JSON.parse(body);
      games = games.api.games;

      for(var i = 0; i < games.length; i++) {
        //console.log(games[i])
        if (games[i].league === "standard") {
          var home = getTeamStats(games[i].hTeam.teamId, games[i].hTeam.fullName, games[i].hTeam.logo)
          var away = getTeamStats(games[i].vTeam.teamId, games[i].vTeam.fullName, games[i].vTeam.logo)
          var game = {"gameId" : games[i].gameId, "date" : start.toISOString().slice(0,10),
          "home" : home, "away" : away}
          //console.log(game)
          json.concat(game);
        }
      }
    });

    start.setDate(start.getDate() + 1);
  }
}

function getTeamStats(teamId, teamName, teamImage) {
  const options = {
    method: 'GET',
    url: "https://api-nba-v1.p.rapidapi.com/standings/standard/2020/teamId/" + teamId,
    headers: {
      'x-rapidapi-key': config.nbaApiKey,
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      useQueryString: true
    }
  };

  res = {};

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res = JSON.parse(body);

    //console.log(res);

    var team = {"teamId" : teamId, "teamName" : teamName, "teamImage" : teamImage,
    "wins" : res.api.standings[0].win, "losses" : res.api.standings[0].loss,
    "place" : res.api.standings[0].conference.rank}
    console.log(team)
    return team;
  });
}

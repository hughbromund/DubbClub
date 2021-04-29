const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const MLBteam = require(path.resolve(__dirname, "../database/models/MLBteam"));
const User = require("../database/models/user");

/*
108 LAA Angels
109 ARI D-backs
110 BAL Orioles
111 BOS Red So
112 CHC Cubs
113 CIN Reds
114 CLE Indians
115 COL Rockies
116 DET Tigers
117 HOU Astros
118 KC Royals
119 LAD Dodgers
120 WSH Nationals
121 NYM Mets
133 OAK Athletics
134 PIT Pirates
135 SD Padres
136 SEA Mariners
137 SF Giants
138 STL Cardinals
139 TB Rays
140 TEX Rangers
141 TOR Blue Jays
142 MIN Twins
143 PHI Phillies
144 ATL Braves
145 CWS White Sox
146 MIA Marlins
147 NYY Yankees
158 MIL Brewers
*/

getGameFromDb = async function (gameId, userId) {
  let game = await MLBgame.findOne({ id : gameId }).exec()

  if (game === null) {
    throw new Error("Game not found!")
  }

  var votedTeamVal = "none"

  if (userId) {
    if (game.homeVoters.includes(userId)) {
      votedTeamVal = "home"
    }
    else if (game.awayVoters.includes(userId)) {
      votedTeamVal = "away"
    }
  }

  return {
    votedTeam: votedTeamVal,
    game: game,
    message: "Successful!"
  }
}
exports.getGameFromDb = getGameFromDb;

exports.getLiveGamePreds = async function getLiveGamePreds(gameId) {
  let game = await getGameFromDb(gameId);
  let header = { 1: game.game.livePredictions.length };
  return {
    data: {
      periodLengths: header,
      predictions: game.game.livePredictions,
    },
    message: "Successful!",
  };
};

exports.getTeamFromDb = async function getTeamFromDb(teamId) {
  let res = await MLBteam.findOne({ teamId: teamId }).exec();
  return res;
};

exports.getTeamsFromDb = async function getTeamsFromDb() {
  let res = await MLBteam.find().exec();
  return res;
};

exports.getUpcomingGameIdsPlusCurr = async function() {
    let upcomingGames = []
    let start = new Date()
    start.setDate(start.getDate() - 1)
    for (let i = 0; i < 4; i++) {
        let games = await axios.get("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date="
         + start.toISOString().slice(0,10))
        for (let j = 0; j < (games.data.dates[0]).games.length; j++) {
            upcomingGames.push((games.data.dates[0]).games[j].gamePk)
        }
        start.setDate(start.getDate() + 1);
    }
    return upcomingGames
}

exports.getUpcomingGameIds = async function() {
    let upcomingGames = []
    let start = new Date()
    let currDate = new Date()
    for (let i = 0; i < 4; i++) {
        let games = await axios.get("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date="
         + start.toISOString().slice(0,10))
        for (let j = 0; j < (games.data.dates[0]).games.length; j++) {
            let gameDate = new Date(games.data.dates[0].games[j].gameDate)
            if (gameDate > currDate) {
                upcomingGames.push((games.data.dates[0]).games[j].gamePk)
            }
        }
        start.setDate(start.getDate() + 1);
    }
    return upcomingGames
}

exports.getUpcomingGameInfo = async function() {
    let upcomingGames = []
    let start = new Date()
    let currDate = new Date()
    for (let i = 0; i < 4; i++) {
        let games = await axios.get("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date="
         + start.toISOString().slice(0,10))
        for (let j = 0; j < (games.data.dates[0]).games.length; j++) {
            let gameDate = new Date(games.data.dates[0].games[j].gameDate)
            if (gameDate > currDate) {
                upcomingGames.push((games.data.dates[0]).games[j])
            }
        }
        start.setDate(start.getDate() + 1);
    }
    return upcomingGames
}

exports.getUpcomingGameInfoPlusCurr = async function() {
    let upcomingGames = []
    let start = new Date()
    start.setDate(start.getDate() - 1)
    for (let i = 0; i < 4; i++) {
        let games = await axios.get("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date="
         + start.toISOString().slice(0,10))
        for (let j = 0; j < (games.data.dates[0]).games.length; j++) {
            upcomingGames.push((games.data.dates[0]).games[j])
        }
        start.setDate(start.getDate() + 1);
    }
    return upcomingGames
}

exports.getProbablePitchersForGame = async function(gameId) {
    let game = await axios.get("http://statsapi.mlb.com/api/v1.1/game/" + gameId + "/feed/live")
    let homePitcher = game.data.gameData.probablePitchers.home
    let awayPitcher = game.data.gameData.probablePitchers.away
    if (homePitcher === undefined) {
        homePitcher = ""
    } else {
        homePitcher = homePitcher.id
    }
    if (awayPitcher === undefined) {
        awayPitcher = ""
    } else {
        awayPitcher = awayPitcher.id
    }
    return {"gameId" : gameId, "homePitcher" : homePitcher, "awayPitcher": awayPitcher}
}

exports.updateTeamsInDb = async function updateTeamsInDb() {
  //const result = await mlbStats.getGame({ params: { gamePk: 12345 }});
  //const result = await mlbStats.getGameWinProbability({ pathParams: { gamePk: 12345 }})
  //const result = await mlbStats.getAttendance({params: { teamId: 111, leagueId: 103, leagueListid: 103 }});
  //const result = await mlbStats.getSchedule({params: { start_date:'07/01/2018',end_date:'07/31/2018',team:143,opponent:121}});

  //let result = await mlbStats.getTeamsStats({params: {teamId: 145, leagueId: 1, seasonId: "2020"}})
  let allTeams = await axios.get("http://statsapi.mlb.com/api/v1/teams");
  let standings = await axios.get(
    "http://statsapi.mlb.com/api/v1/standings?leagueId=103"
  );
  standings = standings.data.records;
  allTeams = allTeams.data.teams;
  mlbTeams = [];
  mlbStandings = [];

  for (let i = 0; i < allTeams.length; i++) {
    if (
      allTeams[i].sport != undefined &&
      allTeams[i].sport.name === "Major League Baseball"
    ) {
      mlbTeams.push(allTeams[i]);
    }
  }

  for (let i = 0; i < standings.length; i++) {
    if (standings[i].league.id === 103) {
      for (let j = 0; j < standings[i].teamRecords.length; j++) {
        mlbStandings.push(standings[i].teamRecords[j]);
      }
    }
  }

  standings = await axios.get(
    "http://statsapi.mlb.com/api/v1/standings?leagueId=104"
  );
  standings = standings.data.records;

  for (let i = 0; i < standings.length; i++) {
    if (standings[i].league.id === 104) {
      for (let j = 0; j < standings[i].teamRecords.length; j++) {
        mlbStandings.push(standings[i].teamRecords[j]);
      }
    }


  for (let i = 0; i < mlbTeams.length; i++) {
    for (let j = 0; j < mlbStandings.length; j++) {
      if (mlbTeams[i].id === mlbStandings[j].team.id) {
        //let mlbTeam = createTeamObj(mlbTeams[i], mlbStandings[j])
        console.log(mlbStandings[j].divisionGamesBack);
        let gamesBack =
          mlbStandings[j].divisionGamesBack === "-"
            ? 0
            : mlbStandings[j].divisionGamesBack;
        let res = await MLBteam.updateOne(
          { teamId: mlbTeams[i].id },
          {
            teamId: mlbTeams[i].id,
            teamName: mlbTeams[i].name,
            teamImage: "",
            wins: mlbStandings[j].wins,
            losses: mlbStandings[j].losses,
            place: mlbStandings[j].divisionRank,
            elo: 1500,
            lastGameID: 0,
            league: mlbTeams[i].league.name,
            division: mlbTeams[i].division.name,
            streak: mlbStandings[j].streak.streakCode,
            gamesBehind: gamesBack,
          },
          { upsert: true }
        ).exec();
        break;
      }
    }
  }
};
}

exports.getDashboard = async function(userId) {
  let start = new Date()
  let end = new Date()
  start.setDate(start.getDate() - 3)
  end.setDate(end.getDate() + 4)
  

  favTeams = {}
  if (userId != undefined) {
    favTeams = await User.findOne({_id: userId}).exec()
    favTeams = favTeams.toObject().favoriteTeams.MLB
  }

  console.log(favTeams)

  let results = await MLBgame.find({date: {$gt: start, $lt:end}})
  let favUpcoming = []
  let regUpcoming = []
  let favLive = []
  let regLive = []
  let favFinished = []
  let regFinished = []

  for (let i = 0; i < results.length; i++) {
    if (userId != undefined) {
      console.log(results[i].home.teamId + " " + results[i].away.teamId)
      if (favTeams.includes(parseInt(results[i].home.teamId, 10)) || favTeams.includes(parseInt(results[i].away.teamId, 10))) {
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
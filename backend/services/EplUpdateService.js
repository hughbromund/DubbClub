const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));

var alderaanService = require(path.resolve(__dirname, "../services/AlderaanService"));
const EPLgame = require("../database/models/EPLgame");
const EPLteam = require("../database/models/EPLteam");


exports.refresh = async function refresh() {
   var start = new Date();
   var end = new Date();
   // console.log(start)
   start.setDate(start.getDate() - 3)

   var options = {
      method: 'GET',
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      headers: {
         'x-rapidapi-key': config.nbaApiKey,
         'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      },
      params: {
         league: 39,
         from: start.toISOString().slice(0,10),
         to: end.toISOString().slice(0,10),
         timezone: "America/Indiana/Indianapolis",
         season: 2020,
      }
   };
 
   let liveGames = await axios.request(options);
   let upcoming = liveGames.data.response

   for (let i = 0; i < upcoming.length; i++) {
      gameId = upcoming[i].fixture.id
      gameInDb = await EPLgame.findOne({ id : gameId }).exec()
      
      liveStatuses = ["1H", "HT", "2H", "ET", "P", "BT"]
      endStatuses = ["FT", "AET", "PEN", "AWD", "WO"]
      //transition to live game
      if (gameInDb.status === "Scheduled" && liveStatuses.includes(upcoming[i].fixture.status.short)) {

         //let arena = (upcoming[i].arena === "" || upcoming[i].arena === undefined) ? "TBD" : upcoming[i].arena

         await EPLgame.findOneAndUpdate({id : gameId}, {status: "In Play"}).exec()
         console.log("Updated game " + gameId + " to In Play.")
         //nbaUserService.notifications(gameInDb) add EPL notifications

         await updateDbWithLiveStats(upcoming[i])
         await alderaanService.updateDbWithLivePredictions(upcoming[i])
      }
 
      //transition to finished game
      if (gameInDb.status === "In Play" && endStatuses.includes(upcoming[i].fixture.status.short)) {
         await EPLgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
         //let game = updateDbWithPlayedGameStats(gameId) // no longer required?
         await updateDbWithLiveStats(upcoming[i])
         await updateDbWithTeamStats(upcoming[i])
      }
      else if (gameInDb.status === "In Play") {
         await updateDbWithLiveStats(upcoming[i])
         await alderaanService.updateDbWithLivePredictions(upcoming[i])
      }
      else if (gameInDb.status === "Scheduled" && endStatuses.includes(upcoming[i].fixture.status.short)) {
         await EPLgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
         //let game = updateDbWithPlayedGameStats(gameId) // no longer required?
         await updateDbWithLiveStats(upcoming[i])
         await updateDbWithTeamStats(upcoming[i])
      }
   }
}

updateDbWithLiveStats = async function (game) {
   var options = {
      method: 'GET',
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
         headers: {
            'x-rapidapi-key': config.nbaApiKey,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
         },
      params: {
         fixture: game.fixture.id
      }
   };
   let request = await axios.request(options) 
   request = request.data.response

   let home = request[0]
   let away = request[1]

   if (request[0].team.id == game.teams.away.id) {
      home = request[1]
      away = request[0]
   }

   let period = 1;
   if (game.score.fulltime.away != null) {
      period = 2
   }
   if (game.score.extratime.away != null) {
      period = 3
   }

   let homeStats = {}
   let awayStats = {}

   for (var i = 0; i < home.statistics.length; i++) {
      let statName = home.statistics[i].type
      let value = home.statistics[i].value
      if (value == null) {
         value = 0
      }
      else if (value[value.length - 1] == '%') {
         value = value.substring(0, value.length - 1)
      }
      homeStats[statName] = value
   }
   let homeLineScore = []
   if (game.score.halftime.home != null) {
      homeLineScore.push(game.score.halftime.home)
   }
   if (game.score.fulltime.home != null) {
      homeLineScore.push(game.score.fulltime.home)
   }

   for (var i = 0; i < away.statistics.length; i++) {
      let statName = away.statistics[i].type
      let value = away.statistics[i].value
      if (value == null) {
         value = 0
      }
      else if (value[value.length - 1] == '%') {
         value = value.substring(0, value.length - 1)
      }
      awayStats[statName] = value
   }

   let awayLineScore = []
   if (game.score.halftime.away != null) {
      awayLineScore.push(game.score.halftime.away)
   }
   if (game.score.fulltime.away != null) {
      awayLineScore.push(game.score.fulltime.away)
   }

   await EPLgame.updateOne({ id: parseInt(game.fixture.id, 10) }, 
      {
          homeScore: game.goals.home,
          awayScore: game.goals.away,
          playedGameStats: {
              home: {
               teamId: game.teams.home.id,
               points: game.goals.home,
               lineScore: homeLineScore,
               shotsOnGoal: homeStats['Shots on Goal'],
               shotsOffGoal: homeStats['Shots off Goal'],
               totalShots: homeStats['Total Shots'],
               blockedShot: homeStats['Blocked Shots'],
               shotsInsidebox: homeStats['Shots insidebox'],
               shotsOutsidebox: homeStats['Shots outsidebox'],
               fouls: homeStats['Fouls'],
               cornerKicks: homeStats['Corner Kicks'],
               offsides: homeStats['Offsides'],
               ballPossessionPercentage: homeStats['Ball Possession'],
               yellowCards: homeStats['Yellow Cards'],
               redCards: homeStats['Red Cards'],
               goalkeeperSaves: homeStats['Goalkeeper Saves'],
               totalPasses: homeStats['Total passes'],
               passesAccurate: homeStats['Passes accurate'],
               passesPercentage: homeStats['Passes %'],
              },
              away: {
               teamId: game.teams.away.id,
               points: game.goals.away,
               lineScore: awayLineScore,
               shotsOnGoal: awayStats['Shots on Goal'],
               shotsOffGoal: awayStats['Shots off Goal'],
               totalShots: awayStats['Total Shots'],
               blockedShot: awayStats['Blocked Shots'],
               shotsInsidebox: awayStats['Shots insidebox'],
               shotsOutsidebox: awayStats['Shots outsidebox'],
               fouls: awayStats['Fouls'],
               cornerKicks: awayStats['Corner Kicks'],
               offsides: awayStats['Offsides'],
               ballPossessionPercentage: awayStats['Ball Possession'],
               yellowCards: awayStats['Yellow Cards'],
               redCards: awayStats['Red Cards'],
               goalkeeperSaves: awayStats['Goalkeeper Saves'],
               totalPasses: awayStats['Total passes'],
               passesAccurate: awayStats['Passes accurate'],
               passesPercentage: awayStats['Passes %'],
              },
          },
          period: period,
          clock: game.fixture.status.elapsed,
      }
   ).exec()
}

updateDbWithTeamStats = async function (game) {
   var options = {
      method: 'GET',
      url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
         headers: {
            'x-rapidapi-key': config.nbaApiKey,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
         },
      params: {
         league: "39",
         season: "2020",
         team: game.teams.home.id
      }
   };
   let request = await axios.request(options) 
   request = request.data.response

   var standings = {
      method: 'GET',
      url: "https://api-football-v1.p.rapidapi.com/v3/standings",
         headers: {
            'x-rapidapi-key': config.nbaApiKey,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
         },
      params: {
         league: "39",
         season: "2020",
         team: game.teams.home.id
      }
   };

   let requestStandings = await axios.request(standings)
   requestStandings = requestStandings.data.response[0].league.standings[0][0].rank 

   await EPLteam.updateOne({teamId: request.team.id}, {
      teamId: request.team.id,
      teamName: request.team.name,
      teamImage: request.team.logo,
      wins: request.fixtures.wins.total,
      draws: request.fixtures.draws.total,
      losses: request.fixtures.loses.total,
      lastGameID: game.fixture.id,
      goalsFor: request.goals.for.total.total,
      goalsAgainst: request.goals.against.total.total,
      biggestWinAway: request.biggest.wins.away,
      biggestWinHome: request.biggest.wins.home,
      goalsAverageAway: request.goals.for.average.away,
      goalsAverageHome: request.goals.for.average.home,
      position: requestStandings,
   }, {upsert : true}).exec()

   options.params.team = game.teams.away.id
   request = await axios.request(options) 
   request = request.data.response

   standings.params.team = game.teams.away.id
   requestStandings = await axios.request(standings)
   requestStandings = requestStandings.data.response[0].league.standings[0][0].rank 

   await EPLteam.updateOne({teamId: request.team.id}, {
      teamId: request.team.id,
      teamName: request.team.name,
      teamImage: request.team.logo,
      wins: request.fixtures.wins.total,
      draws: request.fixtures.draws.total,
      losses: request.fixtures.loses.total,
      lastGameID: game.fixture.id,
      goalsFor: request.goals.for.total.total,
      goalsAgainst: request.goals.against.total.total,
      biggestWinAway: request.biggest.wins.away,
      biggestWinHome: request.biggest.wins.home,
      goalsAverageAway: request.goals.for.average.away,
      goalsAverageHome: request.goals.for.average.home,
      position: requestStandings,
   }, {upsert : true}).exec()
}
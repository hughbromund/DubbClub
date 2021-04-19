const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));

var alderaanService = require(path.resolve(__dirname, "../services/AlderaanService"));
const EPLgame = require("../database/models/EPLgame");


exports.refresh = async function refresh() {
   var start = new Date();
   var end = new Date();
   // console.log(start)
   start.setDate(start.getDate() - 1)

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

         await EPLGame.findOneAndUpdate({id : gameId}, {status: "In Play"}).exec()
         console.log("Updated game " + gameId + " to In Play.")
         //nbaUserService.notifications(gameInDb) add EPL notifications
      }
 
      //transition to finished game
      if (gameInDb.status === "In Play" && endStatuses.includes(upcoming[i].fixture.status.short)) {
         await EPLgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
         //let game = updateDbWithPlayedGameStats(gameId) // no longer required?
      }

      if (gameInDb.status === "In Play") {
         await updateDbWithLiveStats(upcoming[i])
         await alderaanService.updateDbWithLivePredictions(upcoming[i])
      }
      else if (gameInDb.status === "Finished") {
         await updateDbWithLiveStats(upcoming[i])
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
      homeStats[statName] = home.statistics[i].value
   }

   for (var i = 0; i < away.statistics.length; i++) {
      let statName = away.statistics[i].type
      awayStats[statName] = away.statistics[i].value
   }
   

   await EPLgame.updateOne({ id: parseInt(game.fixture.id, 10) }, 
      {
          homeScore: game.goals.home,
          awayScore: game.goals.away,
          playedGameStats: {
              home: homeStats,
              away: awayStats,
          },
          period: period,
          clock: game.fixture.status.elapsed,
      }
   ).exec()
}

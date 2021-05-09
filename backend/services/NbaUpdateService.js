const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));

const nbaService = require(path.resolve(__dirname, "../services/NbaService.js"));
const nbaUserService = require(path.resolve(__dirname, "../services/NbaUserService"));
const mustafarService = require(path.resolve(__dirname, "../services/MustafarService.js"));
const nbaPlayerService = require(path.resolve(__dirname, "../services/NbaPlayerService.js"));



exports.refresh = async function refresh() {
   let upcoming = await nbaService.getLightGameInfoPlusCurr()
   updatedIds = []

   var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/games/live/",
      headers: {
        'x-rapidapi-key': config.nbaApiKey,
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
   };

   let liveGames = await axios.request(options);

   for (let i = 0; i < upcoming.length; i++) {
      gameId = upcoming[i].gameId
      gameInDb = await NBAgame.findOne({ id : gameId }).exec()

      //fix gameId if necessary
      if (gameInDb === null) {
         gameInDb = await NBAgame.findOne({ "away.teamName" : upcoming[i].vTeam.fullName,
          "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC}).exec()
         let foundId = gameInDb.id

          // If it's in the db we fix the gameID. Else, the game isn't in the DB and will
          // be added in the next overnight prediction refresh
          if (gameInDb) {
            gameInDb = await NBAgame.findOneAndUpdate({ "away.teamName" : upcoming[i].vTeam.fullName,
            "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC},{id : gameId}).exec()
            updatedIds.push("Updated " + foundId + " to " + gameId)
          }
      }

      //transition to live game
      if (gameInDb.status === "Scheduled" && upcoming[i].statusGame === "In Play") {
         let arena = (upcoming[i].arena === "" || upcoming[i].arena === undefined) ? "TBD" : upcoming[i].arena
         await NBAgame.findOneAndUpdate({id : gameId}, {status: "In Play", arena: arena}).exec()
         console.log("Updated game " + gameId + " to In Play.")
         nbaUserService.notifications(gameInDb)
      }

      //transition to finished game
      if (gameInDb.status === "In Play" && upcoming[i].statusGame === "Finished") {
         await NBAgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
         await updateDbWithPlayedGameStats(gameId)
         try {
            await nbaPlayerService.updatePlayersByGame(gameId)
         } catch (e) {
            console.log("update players didn't work " + e.message)
         }
      }

      if (upcoming[i].statusGame === "In Play") {
         await mustafarService.updateDbWithLivePredictions(upcoming[i], liveGames.data)
      }
   }

   return updatedIds
}

updateDbWithPlayedGameStats = async function(gameId) {
   let stats = await nbaService.getPlayedGameStats(gameId)
   let game = await NBAgame.updateOne({ id : gameId }, {playedGameStats : stats,
      "homeScore": stats.home.points, "awayScore": stats.away.points, 
      "clock": "0:00"}).exec()
   return game
}
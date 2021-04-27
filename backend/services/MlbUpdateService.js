const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const mlbgame = require(path.resolve(__dirname, "../database/models/MLBgame"));

const mlbService = require(path.resolve(__dirname, "../services/MlbService.js"));
//const mlbUserService = require(path.resolve(__dirname, "../services/MlbUserService"));



exports.refresh = async function refresh() {
   let upcoming = await mlbService.getLightGameInfoPlusCurr()
   updatedIds = []

   var options = {
      method: 'GET',
      url: "https://api-mlb-v1.p.rapidapi.com/games/live/",
      headers: {
        'x-rapidapi-key': config.mlbApiKey,
        'x-rapidapi-host': 'api-mlb-v1.p.rapidapi.com'
      }
   };

   let liveGames = await axios.request(options);

   for (let i = 0; i < upcoming.length; i++) {
      gameId = upcoming[i].gameId
      gameInDb = await mlbgame.findOne({ id : gameId }).exec()

      //fix gameId if necessary
      if (gameInDb === null) {
         gameInDb = await mlbgame.findOne({ "away.teamName" : upcoming[i].vTeam.fullName,
          "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC}).exec()
         let foundId = gameInDb.id

          // If it's in the db we fix the gameID. Else, the game isn't in the DB and will
          // be added in the next overnight prediction refresh
          if (gameInDb) {
            gameInDb = await mlbgame.findOneAndUpdate({ "away.teamName" : upcoming[i].vTeam.fullName,
            "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC},{id : gameId}).exec()
            updatedIds.push("Updated " + foundId + " to " + gameId)
          }
      }

      //transition to live game
      if (gameInDb.status === "Scheduled" && upcoming[i].statusGame === "In Play") {
         let arena = (upcoming[i].arena === "" || upcoming[i].arena === undefined) ? "TBD" : upcoming[i].arena
         await mlbgame.findOneAndUpdate({id : gameId}, {status: "In Play", arena: arena}).exec()
         console.log("Updated game " + gameId + " to In Play.")
         mlbUserService.notifications(gameInDb)
      }

      //transition to finished game
      if (gameInDb.status === "In Play" && upcoming[i].statusGame === "Finished") {
         await mlbgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
         let game = updateDbWithPlayedGameStats(gameId)
         try {
            let updated = await mlbPlayerService.updatePlayersByGame(gameId)
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
   let stats = await mlbService.getPlayedGameStats(gameId)
   let game = await mlbgame.updateOne({ id : gameId }, {playedGameStats : stats}).exec()
   return game
}
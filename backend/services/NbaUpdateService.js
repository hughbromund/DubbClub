const path = require("path");
const axios = require("axios");
const { getUpcomingGameIds } = require("./NbaService");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));

const nbaService = require(path.resolve(__dirname, "../services/NbaService.js"));


exports.refresh = async function refresh() {
   let upcoming = await nbaService.getLightGameInfo()
   updatedIds = []

   var options = {
      method: 'GET',
      url: "https://api-nba-v1.p.rapidapi.com/live/",
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
         await NBAgame.findOneAndUpdate({id : gameId}, {status: "In Play"}).exec()
         console.log("Updated game " + gameId + " to In Play.")
      }

      //transition to finished game
      if (gameInDb.status === "In Play" && upcoming[i].statusGame === "Finished") {
         await NBAgame.findOneAndUpdate({id : gameId}, {status: "Finished"}).exec()
         console.log("Updated game " + gameId + " to Finished.")
      }

      if (upcoming[i].statusGame === "In Play") {
         updateDbWithLivePredictions(upcoming[i], liveGames)
      }
   }

   return updatedIds
}
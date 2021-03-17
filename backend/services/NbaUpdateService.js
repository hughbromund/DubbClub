const path = require("path");
const axios = require("axios");
const { getUpcomingGameIds } = require("./NbaService");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));

const nbaService = require(path.resolve(__dirname, "../services/NbaService.js"));


exports.refresh = async function getTeamStats() {
   let upcoming = nbaService.getLightGameInfo()
   for (let i = 0; i < upcoming.length; i++) {
      gameId = upcoming[i].gameId
      gameInDb = NBAgame.findOne({ id : upcoming[i].gameId }).exec()

      //fix gameId if necessary
      if (gameInDb === undefined) {
         gameInDb = NBAgame.findOne({ "away.teamName" : upcoming[i].vTeam.fullName,
          "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC})
          if (gameInDb) {
            gameInDb = NBAgame.findOneAndUpdate({ "away.teamName" : upcoming[i].vTeam.fullName,
            "home.teamName" : upcoming[i].hTeam.fullName, date : upcoming[i].startTimeUTC},
            {id : gameId})
          }
      }

      //transition to live game
      if (gameInDb.status === "Scheduled" && upcoming[i].statusGame === "In Play") {
         //do the thing
      }

      //transition to finished game
      if (gameInDb.status === "In Play" && upcoming[i].statusGame === "Finished") {
         //do the other thing
      }
   }
}
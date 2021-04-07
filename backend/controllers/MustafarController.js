const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));
var mustafarService = require(path.resolve(__dirname, "../services/MustafarService"));


exports.updateDbWithPredictions = async function (req, res, next) {
    try {
        let upcoming = await nbaService.getBasicGameInfo();
        if (upcoming === undefined) {
            throw new Error("No upcoming games found")
        }
        let gameIds = []
        for (var i = 0; i < upcoming.length; i++) {
            gameIds.push(upcoming[i].gameId)
        }
        console.log(gameIds)
        let predictions = await mustafarService.getMustafarPredictions(gameIds);
        if (predictions === undefined) {
            throw new Error("Failed to get predictions from mustafar")
        }
        mustafarService.updateDbWithPredictions(upcoming, predictions)
        return res.status(200).json({message: "Successfully Updated Games."})
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
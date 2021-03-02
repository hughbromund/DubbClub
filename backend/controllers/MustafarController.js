const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));
var mustafarService = require(path.resolve(__dirname, "../services/MustafarService"));


exports.updateDbWithPredictions = async function (req, res, next) {
    try {
        let upcoming = await nbaService.getBasicGameInfo();
        let gameIds = []
        for (var i = 0; i < upcoming.length; i++) {
            gameIds.push(upcoming[i].gameId)
        }
        let predictions = await mustafarService.getMustafarPredictions(gameIds);
        mustafarService.updateDbWithPredictions(upcoming, predictions)
        return res.status(200).send({message: "Successfully Updated Game."})
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
const path = require("path");
var mlbService = require(path.resolve(__dirname, "../services/MlbService"));
var mlbUpdateService = require(path.resolve(__dirname, "../services/MlbUpdateService"));
var hothService = require(path.resolve(__dirname, "../services/HothService"));

exports.updateDbWithGamesAndPredictions = async function (req, res, next) {
    try {
        let upcoming = await mlbService.getUpcomingGameInfo();
        let games = []
        for (var i = 0; i < upcoming.length; i++) {
            let game = await mlbService.getProbablePitchersForGame(upcoming[i].gamePk)
            games.push(game)
        }
        let predictions = await hothService.getHothPredictions(games);
        hothService.updateDbWithGamesAndPredictions(upcoming, predictions)
        return res.status(200).send({message: "Successfully Updated Games."})
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
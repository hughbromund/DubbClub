const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));
var mustafarService = require(path.resolve(__dirname, "../services/mustafarService"));


exports.updateDbWithPredictions = async function (req, res, next) {
    try {
        let upcoming = await nbaService.getUpcomingGameIds();
        //let result = await mustafarService.getMustafarPredictions(upcoming);
        return res.status(200).json(upcoming);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
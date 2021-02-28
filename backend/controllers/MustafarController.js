const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));
var mustafarService = require(path.resolve(__dirname, "../services/mustafarService"));


exports.updateDbWithPredictions = async function (req, res, next) {
    try {
        var time = new Date().getTime()
        let upcoming = await nbaService.getUpcomingGameIds();
        var elapsed = new Date().getTime() - time;
        console.log(elapsed)
        console.log(upcoming)
        //let result = await mustafarService.getMustafarPredictions(upcoming);
        return res.status(200).json([]);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
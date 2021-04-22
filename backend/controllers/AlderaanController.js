const path = require("path");

var alderaanService = require(path.resolve(__dirname, "../services/AlderaanService"));


exports.updateDbWithGamesAndPredictions = async function (req, res, next) {
    try {
        let upcoming = await alderaanService.getUpcomingGamesAPI();
        let predictions = await alderaanService.getAlderaanPredictions(upcoming);
        alderaanService.updateDbWithPredictions(upcoming, predictions)
        
        return res.status(200).send({message: "Successfully Updated Games."})
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
const path = require("path");
var mlbService = require(path.resolve(__dirname, "../services/MlbService"));
var mlbUpdateService = require(path.resolve(__dirname, "../services/MlbUpdateService"));

exports.getTeamFromDb = async function (req, res, next) {
    try {
        let result = await mlbService.getTeamFromDb(req.params.teamId);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getTeamsFromDb = async function (req, res, next) {
  try {
      let result = await mlbService.getTeamsFromDb();
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getGameFromDb = async function (req, res, next) {
  try {
      let result = await mlbService.getGameFromDb(req.params.gameId, req.userId);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(404).json({ status: 404, message: e.message });
  }
};

exports.getLiveGamePreds = async function (req, res, next) {
  try {
      let result = await mlbService.getLiveGamePreds(req.params.gameId);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getUpcomingGameIdsPlusCurr = async function (req, res, next) {
  try {
      let result = await mlbService.getUpcomingGameIdsPlusCurr();
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.refresh = async function (req, res, next) {
  try {
      let result = await mlbUpdateService.refresh();
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
  }
};
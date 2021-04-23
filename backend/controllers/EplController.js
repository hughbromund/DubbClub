const path = require("path");

var eplService = require(path.resolve(__dirname, "../services/EplService"));
var eplUpdateService = require(path.resolve(__dirname, "../services/EplUpdateService"));

exports.getUpcomingGameIds = async function (req, res, next) {
    try {
        let result = await eplService.getUpcomingGameIds();
        res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getGameIdsByDate = async function (req, res, next) {
    try {
        let result = await eplService.getGameIdsByDateStub(req.params.date);
        if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(req.params.date) == false) {
            throw Error("The date format is incorrect, should be YYYY-MM-DD");
        }
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
      }
};

exports.getGameIdsByTeam = async function (req, res, next) {
    try {
        let result = await eplService.getGameIdsByTeamStub(req.params.teamId);

        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
      }
};

exports.getGameDetailsByGameId = async function (req, res, next) {
    try {
        let result = await eplService.getGameDetails(req.params.gameId, req.userId);
        res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getTeamStats = async function (req, res, next) {
    try {
        let result = await eplService.getTeamStatsStub(req.params.teamId);
        res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.refresh = async function (req, res, next) {
  try {
    await eplUpdateService.refresh();
    return res.status(200).json({"message":"Successful Refresh."});
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
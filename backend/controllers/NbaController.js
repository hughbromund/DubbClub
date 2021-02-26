const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));

exports.getStub = async function (req, res, next) {
    res.sendStatus(200);
};

exports.getBasicGameInfo = async function (req, res, next) {
    try {
        let result = await nbaService.getBasicGameInfo();
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getGamesByDate = async function (req, res, next) {
    try {
        let result = await nbaService.getGamesByDate(req.params.date);
        if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(req.params.date) == false) {
            throw Error("The date format is incorrect, should be YYYY-MM-DD");
        }
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getRecentGamesByTeam = async function (req, res, next) {
    try {
        let result = await nbaService.getRecentGamesByTeam(req.params.team);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.getGameDetailsByGameId = async function (req, res, next) {
    try {
        let result = await nbaService.getGameDetailsByGameId(req.params.gameId);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
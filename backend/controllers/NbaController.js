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
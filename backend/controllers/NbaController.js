const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));

exports.getStub = async function (req, res, next) {
    res.sendStatus(200);
};

exports.tester = async function (req, res, next) {
    nbaService.getBasicGameInfo();
    res.sendStatus(200);
};
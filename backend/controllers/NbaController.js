const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));

exports.getStub = async function (req, res, next) {
    res.sendStatus(200);
};
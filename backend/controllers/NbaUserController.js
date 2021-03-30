const path = require("path");

var nbaUserService = require(path.resolve(__dirname, "../services/NbaUserService"));

exports.userVote = async function (req, res, next) {
    try {
        if (req.body.homeAway != "home" && req.body.homeAway != "away") {
            return res.status(400).json({ status: 400, message: "homeaway was not home or away"});
        }
        nbaUserService.userVote(req, res);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.notificationsTest = async function (req, res, next) {
    nbaUserService.notificationsTest(req, res);
}
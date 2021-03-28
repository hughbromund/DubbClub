const path = require("path");

var UserService = require(path.resolve(
    __dirname,
    "../services/userService.js"
))

exports.signup = async function (req, res, next) {
    UserService.signup(req, res);
}

exports.login = async function (req, res, next) {
    UserService.login(req, res);
}

exports.refresh = async function (req, res, next) {
    UserService.refresh(req, res);
}

exports.test = async function (req, res, next) {
    res.status(200).json({
        message: "user is logged in"
    })
}

exports.userInfo = async function (req, res, next) {
    UserService.userInfo(req, res);
}

exports.changePassword = async function (req, res, next) {
    UserService.changePassword(req, res);
}

exports.changeEmail = async function (req, res, next) {
    UserService.changeEmail(req, res);
}

exports.resetPassword = async function (req, res, next) {
    UserService.resetPassword(req, res);
}

exports.resetPasswordEmail = async function (req, res, next) {
    UserService.resetPasswordEmail(req, res);
}

exports.favoriteTeam = async function (req, res, next) {
    UserService.favoriteTeam(req, res);
}

exports.unfavoriteTeam = async function (req, res, next) {
    UserService.unfavoriteTeam(req, res);
}

exports.favoriteTeamList = async function (req, res, next) {
    UserService.favoriteTeamList(req, res);
}

exports.changePhoneNumber = async function (req, res, next) {
    UserService.changePhoneNumber(req, res);
}

exports.changeNotifications = async function (req, res, next) {
    UserService.changeNotifications(req, res);
}

exports.updateSpoilers = async function (req, res, next) {
    UserService.updateSpoilers(req, res);
}

exports.verifyEmail = async function (req, res, next) {
    UserService.verifyEmail(req, res);
}

exports.verifyEmailEmail = async function (req, res, next) {
    UserService.verifyEmailEmail(req, res);
}
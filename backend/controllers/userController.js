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

exports.test = async function (req, res, next) {
    res.status(200).json({
        message: "user is logged in"
    })
}

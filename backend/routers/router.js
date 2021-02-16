var express = require("express");
var request = require("request");
var router = express.Router();
const cors = require("cors");
const path = require("path");

const authJWT = require(path.resolve(
    __dirname,
    "../middlewares/authJWT"
))

const signupDuplicates = require(path.resolve(
    __dirname,
    "../middlewares/signupDuplicates"
))

signupDuplicates

const userController = require(path.resolve(
    __dirname,
    "../controllers/userController"
))

//User routes
//NOTE: for any request requiring user auth, must call authJWT.verifyToken first
router.post("/api/auth/login", userController.login)
router.post("/api/auth/signup", signupDuplicates.checkDuplicateUser, userController.signup)
router.get("/api/auth/testlogin", authJWT.verifyToken, userController.test)

ar nbaController = require(path.resolve(
    __dirname,
    "../controllers/NbaController"
));

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now());
    next();
});


//stub
router.get("/stub", nbaController.getStub);

//
router.get("/tester", nbaController.tester);

module.exports = router;
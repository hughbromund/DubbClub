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

const nbaController = require(path.resolve(
    __dirname,
    "../controllers/NbaController"
));

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now());
    next();
});

//User routes
//NOTE: for any request requiring user auth, must call authJWT.verifyToken first
router.post("/api/auth/login", userController.login)
router.post("/api/auth/signup", signupDuplicates.checkDuplicateUser, userController.signup)
router.post("/api/auth/refresh", authJWT.verifyToken, userController.refresh)
router.get("/api/auth/testlogin", authJWT.verifyToken, userController.test)

router.get("/api/user/info", authJWT.verifyToken, userController.userInfo)
router.post("/api/user/updatepassword", authJWT.verifyToken, userController.changePassword)
router.post("/api/user/updateemail", authJWT.verifyToken, userController.changeEmail)

router.post("/api/user/favoriteteam", authJWT.verifyToken, userController.favoriteTeam)
router.post("/api/user/unfavoriteteam", authJWT.verifyToken, userController.unfavoriteTeam)
router.get("/api/user/favoriteteamlist", authJWT.verifyToken, userController.favoriteTeamList)

//stub
router.get("/stub", nbaController.getStub);

//basic game info
router.get("/getBasicGameInfo", nbaController.getBasicGameInfo);



module.exports = router;
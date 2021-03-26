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

const mustafarController = require(path.resolve(
    __dirname,
    "../controllers/MustafarController"
));

//User routes
//NOTE: for any request requiring user auth, must call authJWT.verifyToken first
router.post("/api/auth/login", userController.login)
router.post("/api/auth/signup", signupDuplicates.checkDuplicateUser, userController.signup)
router.post("/api/auth/refresh", authJWT.verifyToken, userController.refresh)
router.get("/api/auth/testlogin", authJWT.verifyToken, userController.test)

router.get("/api/user/info", authJWT.verifyToken, userController.userInfo)
router.post("/api/user/updatepassword", authJWT.verifyToken, userController.changePassword)
router.post("/api/user/updateemail", authJWT.verifyToken, userController.changeEmail)
router.post("/api/user/resetPassword", userController.resetPassword)
router.post("/api/user/resetPasswordEmail", userController.resetPasswordEmail)
router.post("/api/user/updateNotifications", authJWT.verifyToken, userController.changeNotifications)
router.post("/api/user/updatePhoneNumber", authJWT.verifyToken, userController.changePhoneNumber)
router.post("/api/user/updateSpoilers", authJWT.verifyToken, userController.updateSpoilers)

router.post("/api/user/favoriteteam", authJWT.verifyToken, userController.favoriteTeam)
router.post("/api/user/unfavoriteteam", authJWT.verifyToken, userController.unfavoriteTeam)
router.get("/api/user/favoriteteamlist", authJWT.verifyToken, userController.favoriteTeamList)

//stub
router.get("/stub", nbaController.getStub);

//basic game info
router.get("/api/nba/getBasicGameInfo", nbaController.getBasicGameInfo);

//games by date
router.get("/api/nba/getGamesByDate/:date", nbaController.getGamesByDate);

//get most recent games by team
router.get("/api/nba/getRecentGamesByTeam/:team", nbaController.getRecentGamesByTeam);

//get game details by gameId
router.get("/api/nba/getGameDetailsByGameId/:gameId", nbaController.getGameDetailsByGameId);

//get game details by gameId
router.get("/api/nba/updateDbWithPredictions", mustafarController.updateDbWithPredictions);

//heartbeat for live game handling
router.get("/api/nba/refresh", nbaController.refresh);

//get game prediction by gameId
router.get("/api/nba/getGameFromDb/:gameId", authJWT.verifyTokenOptional, nbaController.getGameFromDb)

//does the same thing as getBasicGameInfo but from the DB, and a lot faster :) 
router.get("/api/nba/getUpcomingGamesFromDb", authJWT.verifyTokenOptional, nbaController.getUpcomingGamesFromDb)

//does the same thing as getBasicGameInfo but from the DB, and a lot faster and just ids :) 
router.get("/api/nba/getUpcomingGameIdsFromDb", authJWT.verifyTokenOptional, nbaController.getUpcomingGameIdsFromDb)

//user vote on predicted winner of npa game
router.post("/api/nba/vote", authJWT.verifyToken, nbaController.userVote)

//get high vote count game
router.get("/api/nba/getHighVoteGames", authJWT.verifyTokenOptional, nbaController.getHighVoteGames)

//get high prediction difference games
router.get("/api/nba/getHighPredictDiffGames", authJWT.verifyTokenOptional, nbaController.getHighPredictDiffGames)

//update team standings based on conference
router.get("/api/nba/updateTeamStandings", nbaController.updateTeamStandings)

//get a list of teams, their conferences and standings
router.get("/api/nba/getTeamStandings", nbaController.getTeamStandings)

//get a list of predictions for a live game
router.get("/api/nba/getLiveGamePreds/:league/:gameId", nbaController.getLiveGamePreds)

module.exports = router;
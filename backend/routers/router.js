var express = require("express");
var request = require("request");
var router = express.Router();
const cors = require("cors");
const path = require("path");

const authJWT = require(path.resolve(__dirname, "../middlewares/authJWT"));

const signupDuplicates = require(path.resolve(
  __dirname,
  "../middlewares/signupDuplicates"
));

signupDuplicates;

const userController = require(path.resolve(
  __dirname,
  "../controllers/userController"
));

const nbaController = require(path.resolve(
  __dirname,
  "../controllers/NbaController"
));

const nbaUserController = require(path.resolve(
  __dirname,
  "../controllers/NbaUserController"
));

const mustafarController = require(path.resolve(
  __dirname,
  "../controllers/MustafarController"
));

const searchController = require(path.resolve(
  __dirname,
  "../controllers/SearchController"
));

const eplController = require(path.resolve(
  __dirname,
  "../controllers/EplController"
));

const alderaanController = require(path.resolve(
  __dirname,
  "../controllers/AlderaanController"
));

const mlbController = require(path.resolve(
  __dirname,
  "../controllers/MlbController"
));

const hothController = require(path.resolve(
  __dirname,
  "../controllers/HothController"
));

const dashboardController = require(path.resolve(
  __dirname,
  "../controllers/DashboardController"
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
router.post("/api/user/verifyEmail", userController.verifyEmail)
router.post("/api/user/sendVerifyEmail", authJWT.verifyToken, userController.verifyEmailEmail)

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
router.post("/api/nba/vote", authJWT.verifyToken, nbaUserController.userVote)

//get high vote count game
router.get("/api/nba/getHighVoteGames", authJWT.verifyTokenOptional, nbaController.getHighVoteGames)

//get high prediction difference games
router.get("/api/nba/getHighPredictDiffGames", authJWT.verifyTokenOptional, nbaController.getHighPredictDiffGames)

//update team standings based on conference
router.get("/api/nba/updateTeamStandings", nbaController.updateTeamStandings)

//get a list of teams, their conferences and standings
router.get("/api/nba/getTeamsFromDb", nbaController.getTeamsFromDb)

//get a list of predictions for a live game
router.get("/api/nba/getLiveGamePreds/:gameId", nbaController.getLiveGamePreds)

//get list of all gameIds necessary for dashboard based on status and favorites
router.get("/api/nba/getDashboard", authJWT.verifyTokenOptional, nbaController.getDashboard)

//get list of all gameIds from db with provided date
router.get("/api/nba/getGamesByDateFromDb/:date", nbaController.getGamesByDateFromDb)

//get list of all gameIds from given team from db
router.get("/api/nba/getGamesByTeamFromDb/:teamId", nbaController.getGamesByTeamFromDb)

//get player object from db
router.get("/api/nba/getPlayer/:playerId", nbaController.getPlayer)

//get player object from db
router.get("/api/nba/updatePlayersByGame/:gameId", nbaController.updatePlayersByGame)

//get list of all gameIds from given team from db
router.get("/api/autoComplete/:search", searchController.autoComplete)

router.get("/api/autoCompleteEPL/:search", searchController.autoCompleteEPL)



//TESTING PURPOSES ONLY - post gameId to send all users notifications
//router.post("/api/nba/notificationsTest", nbaUserController.notificationsTest)

//MLB
router.get("/api/mlb/getTeamFromDb/:teamId", mlbController.getTeamFromDb)
router.get("/api/mlb/getTeamsFromDb", mlbController.getTeamsFromDb)
router.get("/api/mlb/getGameFromDb/:gameId", authJWT.verifyTokenOptional, mlbController.getGameFromDb)
router.get("/api/mlb/getUpcomingGameIdsPlusCurr", mlbController.getUpcomingGameIdsPlusCurr)
router.get("/api/mlb/getLiveGamePreds/:gameId", mlbController.getLiveGamePreds)
router.get("/api/mlb/updateDbWithGamesAndPredictions", hothController.updateDbWithGamesAndPredictions)
router.get("/api/mlb/refresh", mlbController.refresh)
router.get("/api/mlb/getDashboard", authJWT.verifyTokenOptional, mlbController.getDashboard)
router.post("/api/mlb/vote", authJWT.verifyToken, mlbController.userVote)
router.get("/api/mlb/getGamesByTeamFromDb/:teamId", mlbController.getGameIdsByTeam)


//EPL
router.get("/api/epl/getUpcomingGamesFromDb", eplController.getUpcomingGameIds)
router.get("/api/epl/getGamesByDate/:date", eplController.getGameIdsByDate)
router.get("/api/epl/getGamesByTeamFromDb/:teamId", eplController.getGameIdsByTeam)
router.get("/api/epl/getGameFromDb/:gameId", authJWT.verifyTokenOptional, eplController.getGameDetailsByGameId)
router.get("/api/epl/getTeamStats/:teamId", eplController.getTeamStats)
router.get("/api/epl/updateDbWithGamesAndPredictions", alderaanController.updateDbWithGamesAndPredictions)
router.get("/api/epl/refresh", eplController.refresh);
router.get("/api/epl/getDashboard", authJWT.verifyTokenOptional, eplController.getDashboard);
router.post("/api/epl/vote", authJWT.verifyToken, eplController.userVote);
router.get("/api/epl/getAllTeamStats", eplController.getAllTeamStats);

//Dashboard

router.get("/api/user/getDashboard", authJWT.verifyTokenOptional, dashboardController.getDashboard)

module.exports = router;
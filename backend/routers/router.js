const express = require("express");
const path = require("path");
const router = express.Router();

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
router.post("/api/auth/refresh", authJWT.verifyToken, userController.refresh)
router.get("/api/auth/testlogin", authJWT.verifyToken, userController.test)

router.get("/api/user/info", authJWT.verifyToken, userController.userInfo)
router.post("/api/user/updatepassword", authJWT.verifyToken, userController.changePassword)
router.post("/api/user/updateemail", authJWT.verifyToken, userController.changeEmail)


module.exports = router;
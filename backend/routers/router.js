const express = require("express");
const path = require("path");
const router = express.Router();

const authJWT = require(path.resolve(
    __dirname,
    "../middlewares/authJWT"
))

const userController = require(path.resolve(
    __dirname,
    "../controllers/userController"
))

router.post("/api/auth/login", userController.login)
router.post("/api/auth/signup", userController.signup)
router.get("/api/auth/testlogin", authJWT.verifyToken, userController.test)

module.exports = router;
var express = require("express");
var request = require("request");
var router = express.Router();
const cors = require("cors");
const path = require("path");

var nbaController = require(path.resolve(
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
const { request } = require("http");
const path = require("path");

var eplService = require(path.resolve(__dirname, "../services/EplService"));
var mlbService = require(path.resolve(__dirname, "../services/MlbService"));
var nbaService = require(path.resolve(__dirname, "../services/NbaService"));

exports.finalDashboard = async function(userId) {
    let requests = []
    requests.push(eplService.getDashboard(userId))
    requests.push(mlbService.getDashboard(userId))
    requests.push(nbaService.getDashboard(userId))

    let finishedRequests = await Promise.all(requests)

    let eplDash = finishedRequests[0]
    let mlbDash = finishedRequests[1]
    let nbaDash = finishedRequests[2]

    let favUpcoming = []
    let regUpcoming = []
    let favLive = []
    let regLive = []
    let favFinished = []
    let regFinished = []

    //EPL

    for (var i = 0; i < eplDash.regFinished.length; i++) {
        regFinished.push({gameId: eplDash.regFinished[i], league: "EPL"})
    }

    for (var i = 0; i < eplDash.regLive.length; i++) {
        regLive.push({gameId: eplDash.regLive[i], league: "EPL"})
    }

    for (var i = 0; i < eplDash.regUpcoming.length; i++) {
        regUpcoming.push({gameId: eplDash.regUpcoming[i], league: "EPL"})
    }

    for (var i = 0; i < eplDash.favFinished.length; i++) {
        favFinished.push({gameId: eplDash.favFinished[i], league: "EPL"})
    }

    for (var i = 0; i < eplDash.favLive.length; i++) {
        favLive.push({gameId: eplDash.favLive[i], league: "EPL"})
    }

    for (var i = 0; i < eplDash.favUpcoming.length; i++) {
        favUpcoming.push({gameId: eplDash.favUpcoming[i], league: "EPL"})
    }

    //NBA

    for (var i = 0; i < nbaDash.regFinished.length; i++) {
        regFinished.push({gameId: nbaDash.regFinished[i], league: "NBA"})
    }

    for (var i = 0; i < nbaDash.regLive.length; i++) {
        regLive.push({gameId: nbaDash.regLive[i], league: "NBA"})
    }

    for (var i = 0; i < nbaDash.regUpcoming.length; i++) {
        regUpcoming.push({gameId: nbaDash.regUpcoming[i], league: "NBA"})
    }

    for (var i = 0; i < nbaDash.favFinished.length; i++) {
        favFinished.push({gameId: nbaDash.favFinished[i], league: "NBA"})
    }

    for (var i = 0; i < nbaDash.favLive.length; i++) {
        favLive.push({gameId: nbaDash.favLive[i], league: "NBA"})
    }

    for (var i = 0; i < nbaDash.favUpcoming.length; i++) {
        favUpcoming.push({gameId: nbaDash.favUpcoming[i], league: "NBA"})
    }

    //MLB

    for (var i = 0; i < mlbDash.regFinished.length; i++) {
        regFinished.push({gameId: mlbDash.regFinished[i], league: "MLB"})
    }

    for (var i = 0; i < mlbDash.regLive.length; i++) {
        regLive.push({gameId: mlbDash.regLive[i], league: "MLB"})
    }

    for (var i = 0; i < mlbDash.regUpcoming.length; i++) {
        regUpcoming.push({gameId: mlbDash.regUpcoming[i], league: "MLB"})
    }

    for (var i = 0; i < mlbDash.favFinished.length; i++) {
        favFinished.push({gameId: mlbDash.favFinished[i], league: "MLB"})
    }

    for (var i = 0; i < mlbDash.favLive.length; i++) {
        favLive.push({gameId: mlbDash.favLive[i], league: "MLB"})
    }

    for (var i = 0; i < mlbDash.favUpcoming.length; i++) {
        favUpcoming.push({gameId: mlbDash.favUpcoming[i], league: "MLB"})
    }


    let finalDashboard = {"regFinished": regFinished, "regLive": regLive, "regUpcoming": regUpcoming,
   "favFinished": favFinished, "favLive": favLive, "favUpcoming": favUpcoming}
    
    return finalDashboard;
}
const path = require("path");

var nbaService = require(path.resolve(__dirname, "../services/NbaService"));
var nbaUpdateService = require(path.resolve(__dirname, "../services/NbaUpdateService"));
var nbaPlayerService = require(path.resolve(__dirname, "../services/NbaPlayerService"));

exports.getStub = async function (req, res, next) {
    res.sendStatus(200);
};

exports.getBasicGameInfo = async function (req, res, next) {
    try {
        let result = await nbaService.getBasicGameInfo();
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getGamesByDate = async function (req, res, next) {
    try {
        let result = await nbaService.getGamesByDate(req.params.date);
        if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(req.params.date) == false) {
            throw Error("The date format is incorrect, should be YYYY-MM-DD");
        }
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getRecentGamesByTeam = async function (req, res, next) {
    try {
        let result = await nbaService.getRecentGamesByTeam(req.params.team);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.getGameDetailsByGameId = async function (req, res, next) {
    try {
        let result = await nbaService.getGameDetailsByGameId(req.params.gameId);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.getGameFromDb = async function (req, res, next) {
    try {
        nbaService.getGameFromDb(req, res);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getUpcomingGamesFromDb = async function (req, res, next) {
    try {
        let result = await nbaService.getUpcomingGamesFromDb(req, res);
        res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getUpcomingGameIdsFromDb = async function (req, res, next) {
    try {
        let result = await nbaService.getUpcomingGameIdsFromDb(req, res);
        res.status(200).json(result);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.refresh = async function (req, res, next) {
    try {
        let result = await nbaUpdateService.refresh();
        return res.status(200).json({"message":"Successful Refresh.", "updated Ids": result});
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getHighVoteGames = async function (req, res, next) {
    try {
        nbaService.getHighVoteGames(req, res);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.getHighPredictDiffGames = async function (req, res, next) {
    try {
        nbaService.getHighPredictDiffGames(req, res);
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.updateTeamStandings = async function (req, res, next) {
    try {
        let result = await nbaService.updateTeamStandings(req, res);
        res.status(200).json({ status: 200, message: "Team standings updated successfully!" });
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getTeamsFromDb = async function (req, res, next) {
    try {
        let teams = await nbaService.getTeamsFromDb();
        res.status(200).json(teams);
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getLiveGamePreds = async function (req, res, next) {
    try {
        nbaService.getLiveGamePreds(req, res);
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getDashboard = async function (req, res, next) {
    try {
        let result = await nbaService.getDashboard(req.userId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getGamesByDateFromDb = async function (req, res, next) {
    try {
        let result = await nbaService.getGamesByDateFromDb(req.params.date);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getGamesByTeamFromDb = async function (req, res, next) {
    try {
        let result = await nbaService.getGamesByTeamFromDb(req.params.teamId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getPlayer = async function (req, res, next) {
    try {
        let result = await nbaPlayerService.getPlayer(req.params.playerId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.updatePlayer = async function (req, res, next) {
    try {
        let result = await nbaPlayerService.updatePlayerById(req.params.playerId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.updatePlayersByGame = async function (req, res, next) {
    try {
        let result = await nbaPlayerService.updatePlayersByGame(req.params.gameId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}
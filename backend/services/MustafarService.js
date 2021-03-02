const path = require("path");
const axios = require("axios");
const Team = require("../database/models/team");
const Game = require("../database/models/game");

const config = require(path.resolve(__dirname, "../config.json"));

//async not working with mustafar
exports.getMustafarPredictions = async function(gameIds) {
    let results = []
/*
    for (var i = 0; i < gameIds.length; i++) {
        let url = "https://mustafar.dubb.club/predictnbawin/" + gameIds[i]
        console.log(url)
        let res = await axios.get(url)
        console.log(res.data)
        results.push(res.data)
    }
*/

    return [
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
        "confidence": 0.5168772078615828,  
        "pred_winner": 17  
        },
        {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            },
            {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            },
            {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            },
            {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            },
            {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            },
            {  
            "confidence": 0.5168772078615828,  
            "pred_winner": 17  
            }
    ]
}

exports.updateDbWithPredictions = function(res, upcoming, predictions) {
    for (var i = 0; i < upcoming.length; i++) {
        const homeTeam = new Team({
            teamId: upcoming[i].home.teamId,
            teamName: upcoming[i].home.teamName,
            teamImage: upcoming[i].home.teamImage,
            wins: upcoming[i].home.wins,
            losses: upcoming[i].home.losses,
            conferenceName: upcoming[i].home.conferenceName,
            place: upcoming[i].home.place,
        });

        const awayTeam = new Team({
            teamId: upcoming[i].away.teamId,
            teamName: upcoming[i].away.teamName,
            teamImage: upcoming[i].away.teamImage,
            wins: upcoming[i].away.wins,
            losses: upcoming[i].away.losses,
            conferenceName: upcoming[i].away.conferenceName,
            place: upcoming[i].away.place,
        });

        let arena = (upcoming[i].arena === "") ? "TBD" : upcoming[i].arena

        const game = new Game({
            _id: upcoming[i].gameId,
            date: upcoming[i].date,
            arena: arena,
            home: homeTeam,
            away: awayTeam,
            predictedWinner: predictions[i].pred_winner,
            confidence: predictions[i].confidence
        });

        Game.updateOne({ "_id" : upcoming[i].gameId }, {$set : game}, {upsert : true}).exec()
    }
}
const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));

exports.autocompleteStub = async function() {
    players = [{"id": 70, "name": "Corey Brewer",
     "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/9/95/Kings_de_Sacramento_logo.svg/1200px-Kings_de_Sacramento_logo.svg.png"},
     {"id": 92, "name": "Clint Capela",
     "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png"},
    ]

    teams = [{"id": 1, "name": "Atlanta Hawks",
    "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png"},
    {"id": 2, "name": "Boston Celtics",
    "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png"}]
    return {"players": players, "teams": teams}
}
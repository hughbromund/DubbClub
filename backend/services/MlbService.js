const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const MLBteam = require(path.resolve(__dirname, "../database/models/MLBteam"));

const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();

/*
108 LAA Angels
109 ARI D-backs
110 BAL Orioles
111 BOS Red So
112 CHC Cubs
113 CIN Reds
114 CLE Indians
115 COL Rockies
116 DET Tigers
117 HOU Astros
118 KC Royals
119 LAD Dodgers
120 WSH Nationals
121 NYM Mets
133 OAK Athletics
134 PIT Pirates
135 SD Padres
136 SEA Mariners
137 SF Giants
138 STL Cardinals
139 TB Rays
140 TEX Rangers
141 TOR Blue Jays
142 MIN Twins
143 PHI Phillies
144 ATL Braves
145 CWS White Sox
146 MIA Marlins
147 NYY Yankees
158 MIL Brewers
*/


exports.getGameFromDb = async function getGameFromDb(gameId) {
    //let res = await axios.get("https://statsapi.mlb.com/api/v1/game/632222/winProbability")
    return {
        id: 632222,
        date: "2021-04-26T17:10:00Z",
        arena: "Comerica Park",
        home: {
            "_id": "6086668522b6482a6f3e672a",
            "teamId": 108,
            "__v": 0,
            "division": "American League West",
            "elo": 1500,
            "gamesBehind": 0.5,
            "lastGameID": 0,
            "league": "American League",
            "losses": 6,
            "streak": "W1",
            "teamImage": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Los_Angeles_Angels_of_Anaheim.svg",
            "teamName": "Los Angeles Angels",
            "wins": 9
        },
        away: {
            "_id": "6086668522b6482a6f3e67a1",
            "teamId": 110,
            "__v": 0,
            "division": "American League East",
            "elo": 1500,
            "gamesBehind": 3.5,
            "lastGameID": 0,
            "league": "American League",
            "losses": 9,
            "streak": "W1",
            "teamImage": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Baltimore_Orioles_Script.svg",
            "teamName": "Baltimore Orioles",
            "wins": 8
        },
        predictedWinner: 110,
        confidence: 0.704,
        homeVoters: ["60669a0f34b642000bb87244"],
        awayVoters: ["6064e5572c5e0e000bd5c275"],
        status: "Finished",
        lineScore: [
            {
                "inning": 1,
                "homeScore": 1,
                "awayScore": 0
            },
            {
                "inning": 2,
                "homeScore": 0,
                "awayScore": 1
            },
            {
                "inning": 3,
                "homeScore": 0,
                "awayScore": 0
            },
            {
                "inning": 4,
                "homeScore": 0,
                "awayScore": 0
            },
            {
                "inning": 5,
                "homeScore": 3,
                "awayScore": 0
            },
            {
                "inning": 6,
                "homeScore": 0,
                "awayScore": 0
            },
            {
                "inning": 7,
                "homeScore": 1,
                "awayScore": 0
            },
            {
                "inning": 8,
                "homeScore": 0,
                "awayScore": 0
            },
            {
                "inning": 9,
                "homeScore": 0,
                "awayScore": 4
            },
            {
                "inning": 10,
                "homeScore": 0,
                "awayScore": 2
            }
        ],
        playedGameStats: {type: Object, unique: false, required: false, default: {}},
        livePredictions: [
            {  
                "homeConfidence" : 0.5,
                "awayConfidence" : 0.5,
                "inning" : 1,
                "half" : "top"
            },
            {  
                "homeConfidence" : 0.62,
                "awayConfidence" : 0.38,
                "inning" : 2,
                "half" : "bottom"
            },
            {  
                "homeConfidence" : 0.73,
                "awayConfidence" : 0.27,
                "inning" : 4,
                "half" : "bottom"
            },
            {  
                "homeConfidence" : 0.67,
                "awayConfidence" : 0.33,
                "inning" : 6,
                "half" : "top"
            },
            {  
                "homeConfidence" : 0.56,
                "awayConfidence" : 0.44,
                "inning" : 8,
                "half" : "bottom"
            },
            {  
                "homeConfidence" : 0.16,
                "awayConfidence" : 0.84,
                "inning" : 10,
                "half" : "top"
            },
            {  
                "homeConfidence" : 0,
                "awayConfidence" : 1.0,
                "inning" : 10,
                "half" : "bottom"
            }
        ],
        homeScore: 5,
        awayScore: 7,
        inning: 10,
        half: "bottom"
    }
    
}

exports.getTeamFromDb = async function getTeamFromDb(teamId) {
    let res = await MLBteam.findOne({teamId : teamId}).exec()
    return res
}

exports.getTeamsFromDb = async function getTeamsFromDb() {
    let res = await MLBteam.find().exec()
    return res
}

exports.getUpcomingGameIdsPlusCurr = async function() {
    let upcomingGames = []
    let start = new Date()
    let month = start.getMonth()
    let day = start.getDay()
    let year = start.getFullYear()
    for (let i = 0; i < 4; i++) {
        let games = await axios.get("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date="
         + month + "/" + day + "/" + year)
        for (let j = 0; j < (games.data.dates[0]).games.length; j++) {
            upcomingGames.push((games.data.dates[0]).games[j].gamePk)
        }
    }
    return upcomingGames
}

exports.updateTeamsInDb = async function updateTeamsInDb() {
    //const result = await mlbStats.getGame({ params: { gamePk: 12345 }});
    //const result = await mlbStats.getGameWinProbability({ pathParams: { gamePk: 12345 }})
    //const result = await mlbStats.getAttendance({params: { teamId: 111, leagueId: 103, leagueListid: 103 }});
    //const result = await mlbStats.getSchedule({params: { start_date:'07/01/2018',end_date:'07/31/2018',team:143,opponent:121}});

    //let result = await mlbStats.getTeamsStats({params: {teamId: 145, leagueId: 1, seasonId: "2020"}})
    let allTeams = await axios.get("http://statsapi.mlb.com/api/v1/teams")
    let standings = await axios.get("http://statsapi.mlb.com/api/v1/standings?leagueId=103")
    standings = standings.data.records
    allTeams = allTeams.data.teams
    mlbTeams = []
    mlbStandings = []

    for (let i = 0; i < allTeams.length; i++) {
        if (allTeams[i].sport != undefined && allTeams[i].sport.name === "Major League Baseball") {
            mlbTeams.push(allTeams[i])
        }
    }

    for (let i = 0; i < standings.length; i++) {
        if (standings[i].league.id === 103) {
            for (let j = 0; j < standings[i].teamRecords.length; j++) {
                mlbStandings.push(standings[i].teamRecords[j])
            }
        }
    }

    standings = await axios.get("http://statsapi.mlb.com/api/v1/standings?leagueId=104")
    standings = standings.data.records

    for (let i = 0; i < standings.length; i++) {
        if (standings[i].league.id === 104) {
            for (let j = 0; j < standings[i].teamRecords.length; j++) {
                mlbStandings.push(standings[i].teamRecords[j])
            }
        }
    }

    for (let i = 0; i < mlbTeams.length; i++) {
        for (let j = 0; j < mlbStandings.length; j++) {
            if (mlbTeams[i].id === mlbStandings[j].team.id) {
                let gamesBack = (mlbStandings[j].divisionGamesBack === '-') ? 0 : mlbStandings[j].divisionGamesBack
                let res = await MLBteam.updateOne({"teamId" : mlbTeams[i].id}, {
                    teamId: mlbTeams[i].id,
                    teamName: mlbTeams[i].name,
                    teamImage: "",
                    wins: mlbStandings[j].wins,
                    losses: mlbStandings[j].losses,
                    place: mlbStandings[j].divisionRank,
                    elo: 1500,
                    lastGameID: 0,
                    league: mlbTeams[i].league.name,
                    division: mlbTeams[i].division.name,
                    streak: mlbStandings[j].streak.streakCode,
                    gamesBehind: gamesBack
                }, {upsert : true}).exec()
                break
            }
        }
    }
}
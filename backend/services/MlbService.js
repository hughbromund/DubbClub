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

exports.getTeamFromDb = async function getTeamFromDb(teamId) {
    let res = await MLBteam.findOne({teamId : teamId}).exec()
    return res
}

exports.getTeamsFromDb = async function getTeamsFromDb() {
    let res = await MLBteam.find().exec()
    return res
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

    //console.log(mlbStandings)

    for (let i = 0; i < mlbTeams.length; i++) {
        for (let j = 0; j < mlbStandings.length; j++) {
            if (mlbTeams[i].id === mlbStandings[j].team.id) {
                //let mlbTeam = createTeamObj(mlbTeams[i], mlbStandings[j])
                console.log(mlbStandings[j].divisionGamesBack)
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
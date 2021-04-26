# Endpoints for Dubb Club

## Endpoints for Game Data

### /api/nba/getBasicGameData DEPRECATED - PLEASE USE getUpcomingGamesFromDb

GET  
gets all games from the NBA in the next three days  
Requirements: none
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:

```json
[
  {
    "gameId": "8608",
    "date": "2021-03-02T03:30:00.000Z",
    "arena": "TD Garden",
    "home": {
      "teamId": "2",
      "teamName": "Boston Celtics",
      "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
      "wins": "13",
      "losses": "13",
      "conferenceName": "east",
      "place": "4"
    },
    "away": {
      "teamId": "9",
      "teamName": "Denver Nuggets",
      "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Nuggets_de_Denver_2018.png/180px-Nuggets_de_Denver_2018.png",
      "wins": "15",
      "losses": "11",
      "conferenceName": "west",
      "place": "7"
    }
  }
]
```

### /api/nba/getPlayer/:playerId

GET  
gets player object from db  
Requirements: playerId  
Returns: player object  
Status: Working  
Issues: if player can't be correlated, won't be found. If they haven't played in a while  
there won't be a most recent game

JSON Format:

```json
{
  "playerInfo": {
    "firstName": "Tyreke",
    "lastName": "Evans",
    "yearsPro": 0,
    "collegeName": "Memphis",
    "country": "USA",
    "playerId": 163,
    "externPlayerId": 150,
    "dateOfBirth": "1989-09-19T00:00:00.000Z",
    "affiliation": "Memphis/USA",
    "startNba": "2009",
    "heightInMeters": null,
    "weightInKilograms": null,
    "jersey": 12,
    "active": 0,
    "pos": ""
  },
  "career": {
    "season": "historical",
    "points": 15.734410774410776,
    "min": "303:9",
    "fgm": 5.907777777777778,
    "fga": 13.4329797979798,
    "fgp": 0.43766498316498315,
    "ftm": 3.076414141414142,
    "fta": 4.067037037037037,
    "ftp": 0.7540808080808081,
    "tpm": 0.8409595959595959,
    "tpa": 2.6064309764309765,
    "tpp": 0.30104882154882157,
    "offReb": 0.8443939393939395,
    "defReb": 3.7365656565656566,
    "reb": 4.5810942760942766,
    "assists": 4.800488215488215,
    "pFouls": 2.2044444444444444,
    "steals": 1.235808080808081,
    "turnovers": 2.506279461279461,
    "blocks": 0.3749494949494949
  },
  "mostRecentGame": {
    "points": 21,
    "min": "25:52",
    "fgm": 7,
    "fga": 18,
    "fgp": 38.9,
    "ftm": 4,
    "fta": 4,
    "ftp": 100,
    "tpm": 3,
    "tpa": 7,
    "tpp": 42.9,
    "offReb": 0,
    "defReb": 2,
    "assists": 1,
    "pFouls": 4,
    "steals": 1,
    "turnovers": 2,
    "blocks": 0
  },
  "_id": "6083a93a22b6482a6fb13a5b",
  "__v": 0,
  "seasons": [
    {
      "_id": "6083a93df9653b4ea0c02540",
      "teamId": 15,
      "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Pacers_de_l%27Indiana_logo.svg/1180px-Pacers_de_l%27Indiana_logo.svg.png",
      "season": "2018",
      "points": 10.23,
      "min": "20:19",
      "fgm": 3.72,
      "fga": 9.57,
      "fgp": 0.389,
      "ftm": 1.67,
      "fta": 2.32,
      "ftp": 0.719,
      "tpm": 1.12,
      "tpa": 3.13,
      "tpp": 0.356,
      "offReb": 0.48,
      "defReb": 2.43,
      "reb": 2.91,
      "assists": 2.41,
      "pFouls": 1.71,
      "steals": 0.84,
      "turnovers": 1.71,
      "blocks": 0.26
    }
  ]
}
```

### /api/nba/getUpcomingGameIdsFromDb

GET  
gets all game IDs from the NBA in the next three days  
Requirements: none  
Returns: JSON list of gameIds  
Status: Working  
Issues:

JSON Format:

```json
[
  8188,
  8187,
  8908,
  8909,
  8910,
  8911,
  8912,
  8913,
  8914,
  8915,
  8916,
  8917,
  8918,
  8919,
  8920,
  8921
]
```

### /api/nba/getDashboard

GET  
gets all game IDs for dashboard  
Requirements: OPTIONAL auth JWT token for favorite games  
Returns: JSON list of lists of gameIds  
Status: Working  
Issues:

JSON Format:

```json
{
  "regFinished": [8946, 8947, 8352, 8948],
  "regLive": [],
  "regUpcoming": [
    8949,
    8950,
    8951,
    8952,
    8953,
    8954,
    8955,
    8956,
    8957,
    8958,
    8360,
    8959,
    8960,
    8961,
    8962,
    8963,
    8964,
    8965,
    8966,
    8967,
    8968,
    8969,
    8970,
    8971,
    8972,
    8973,
    8974,
    8975
  ],
  "favFinished": [],
  "favLive": [],
  "favUpcoming": [8951, 8958, 8962, 8966, 8970, 8971]
}
```

### /api/nba/getGamesByDateFromDb/:date

GET  
gets all game IDs in DB from date  
Requirements: date object 31-03-2021  
Returns: JSON list of gameIds  
Status: Working  
Issues: N/A

JSON Format:

```json
[8946, 8947, 8352, 8948]
```

### /api/nba/getGamesByTeamFromDb/:date

GET  
gets all game IDs in DB from teamId  
Requirements: teamId  
Returns: JSON list of gameIds  
Status: Working  
Issues: N/A

JSON Format:

```json
[8946, 8947, 8352, 8948]
```

### /api/nba/getUpcomingGamesFromDb

GET  
gets all games from the NBA in the next three days  
Requirements: none  
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:

```json
[
 "arena": "TBD",
 "homeVoters": [],
 "awayVoters": [
"603adbd83534d306ece241ce"
],
 "\_id": "60578abc7a3c4a0429a4f348",
 "id": 8880,
 "\_\_v": 0,
 "away": [
{
"_id": "60578abc7a3c4a0429a4f347",
"teamId": 8,
"teamName": "Dallas Mavericks",
"teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/b/b8/Mavericks_de_Dallas_logo.svg/150px-Mavericks_de_Dallas_logo.svg.png",
"wins": 21,
"losses": 19,
"conferenceName": "west",
"place": 8
}
],
 "confidence": 0.5371316492657674,
 "date": "2021-03-22T02:00:00.000Z",
 "home": [
{
"_id": "60578abc7a3c4a0429a4f346",
"teamId": 29,
"teamName": "Portland Trail Blazers",
"teamImage": "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Portland_Trail_Blazers_logo.svg/1200px-Portland_Trail_Blazers_logo.svg.png",
"wins": 25,
"losses": 16,
"conferenceName": "west",
"place": 6
}
],
 "predictedWinner": 8,
 "status": "Scheduled"
 }
]
```

### /api/nba/updateDbWithPredictions

GET  
Gets upcoming games and predictions for those games then  
uploads them to Mongo  
Requirements: none  
Returns: status code and message  
Status: Working  
Issues: If the gameIds change on the API side we might have a problem

Schema Format: Please navigate to Mongo to see the Schema (Game) format

### /api/nba/getGamesByDate/:date

GET  
gets all games from the NBA from the specified date  
Requirements: some valid date string  
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:  
same as above

### /api/nba/getRecentGamesByTeam/:team

GET  
gets previous 10 games for a team  
Requirements: some valid teamId (ex: 1, 3 etc..)
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:

```json
[
 {
"gameId": "8608",
 "date": "2021-03-02T03:30:00.000Z",
"arena": "TD Garden",
 "home": {
 "teamId": "2",
 "teamName": "Boston Celtics",
 "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
 "wins": "13",
 "losses": "13",
 "conferenceName": "east",
 "place": "4"
 },
 "away": {
 "teamId": "9",
 "teamName": "Denver Nuggets",
 "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Nuggets_de_Denver_2018.png/180px-Nuggets_de_Denver_2018.png",
 "wins": "15",
 "losses": "11",
 "conferenceName": "west",
 "place": "7"
 }
 }
 "gameStats" : {
 "home": {
 "teamId": "15",
 "score": 100,
 "linescore": [
"23",
"40",
"23",
"24"
],
 "leaders": [
{
"points": "7",
"playerId": "727",
"name": "Jarrett Allen"
},
{
"rebounds": "14",
"playerId": "727",
"name": "Jarrett Allen"
},
{
"assists": "11",
"playerId": "142",
"name": "Spencer Dinwiddie"
},
{
"points": "22",
"playerId": "507",
"name": "Garrett Temple"
},
{
"assists": "4",
"playerId": "1013",
"name": "Theo Pinson"
}
]
 }
 }
]
```

### /api/nba/getGameDetailsByGameId/:gameId

GET  
gets game stats for specific gameId
Requirements: some valid gameId
Returns: JSON object with home and away game stats
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:

```json
{
 "gameStats" : {
 "home": {
 "teamId": "15",
 "logo": "some link"
"score": 100,
 "linescore": [
"23",
"40",
"23",
"24"
],
 "leaders": [
{
"points": "7",
"playerId": "727",
"name": "Jarrett Allen"
},
{
"rebounds": "14",
"playerId": "727",
"name": "Jarrett Allen"
},
{
"assists": "11",
"playerId": "142",
"name": "Spencer Dinwiddie"
},
{
"points": "22",
"playerId": "507",
"name": "Garrett Temple"
},
{
"assists": "4",
"playerId": "1013",
"name": "Theo Pinson"
}
]
 }
 }
]
```

### /api/nba/getGameFromDb/:gameId

GET  
gets game for specified gameId from DB
Requirements: gameId parameter, optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:

```json
{
 "votedTeam": "none", (will be "none", "away", or "home")
"game": Same as getBasicGameData json format
 "message": "Successful!"
}
```

### /api/nba/refresh

GET  
fixes gameId if necessary, handles transition between status, handles calling live game functions  
Requirements: nothing  
Returns: JSON list of changed ids plus error/success message  
Status: Working  
Issues: None

JSON return Format:

```json
{ "message": "Successful Refresh.", "updated Ids": ["Updated 8600 to 8844"] }
```

### /api/nba/vote

POST  
user vote functionality for who they believe will win the NBA game
Requirements: gameId, home or away team, JWT auth token
Returns: JSON body message of success or failure  
Status: Working  
Issues: None?

JSON Request Format:

```json
{
  "gameId": 8701,
  "homeAway": "home"
}
```

JSON return Format:

```json
{
  "message": "Successful!"
}
```

### /api/nba/getHighVoteGames

GET  
gets upcoming games sorted by highest vote count descending
Requirements: optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:

```json
{
 "games": array of game objects, each object similar to getBasicGameData json format. Also includes the following fields on each game:
{"voteCount", "votedTeam"}
"message": "Successful!"
}
```

### /api/nba/getHighPredictDiffGames

GET  
gets upcoming games sorted by highest vote count descending
Requirements: optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:

```json
{
 "games": array of game objects, each object similar to getBasicGameData json format. Also includes the following fields on each game:
{"votedTeam", "predictedWinnerVote", "confidenceVote", "confidenceDifference"}
"message": "Successful!"
}
```

### /api/nba/updateTeamStandings

GET  
updates each team's standing based on the information provided by the API
Requirements: nothing
Returns: status and message
Status: Working  
Issues: None

JSON return Format:

```json
{
  "status": 200,
  "message": "Team standings updated successfully!"
}
```

### /api/nba/getTeamsFromDb

GET
gets the team objects from the db  
Requirements: nothing
Returns: the team objects  
Status: Working  
Issues: None

JSON return Format:

```json
[
  {
    "_id": "605d4d880e4f1db334d2ab30",
    "teamId": 1,
    "teamName": "Atlanta Hawks",
    "elo": 1690.0729320970106,
    "lastGameID": 8888,
    "conference": "east",
    "standing": 6,
    "gamesBehind": 9,
    "lastTenLosses": 3,
    "lastTenWins": 7,
    "losses": 23,
    "winStreak": 0,
    "wins": 23,
    "teamImage": "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png"
  }
]
```

### /api/nba/getLiveGamePreds/:league/:gameId

GET
gets a list of predictions for a live game
Requirements: the game ID and the league
Returns: a list of predictions and a header for the length of each quarter
Status: Stubbed  
Issues: Need to implement dynamic live game predictions

JSON return Format:

```json
{
  "data": {
    "periodLengths": {
      "1": 720,
      "2": 720,
      "3": 720,
      "4": 720,
      "other": 300
    },
    "predictions": [
      {
        "homeConfidence": 0.5,
        "awayConfidence": 0.5,
        "period": 1,
        "timeElapsed": 10
      },
      {
        "homeConfidence": 0.6,
        "awayConfidence": 0.4,
        "period": 1,
        "timeElapsed": 300
      }
    ]
  }
}
```

## Endpoints for User Accounts

### /api/user/info

GET
gets all basic user info
Requirements: JWT
Returns: failure message or relevant user info
Status: Working

JSON Result Format:

```json
{
"username": "datboi",
"email": "firemonkey@gmail.com"
"phoneNumber": "1234567890"
"notifications": {
"SMS": true,
"email" true
}
"hideSpoilers": true
}
```

### /api/user/resetPasswordEmail

POST
Sends a reset password email with link
Requirements: username or email in username field
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "username": "peyton"
}
```

JSON Result Format:

```json
{
  "message": "If the user exists, the email was sent"
}
```

### /api/user/resetPassword

POST
resets user password
Requirements: hash from link, new password
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "hash": "dfsfsdf3234sdf",
  "password": "supersecret"
}
```

JSON Result Format:

```json
{
  "message": "Successfully Updated Password!"
}
```

### /api/user/updatePhoneNumber

POST
updates user's phone number
Requirements: phoneNumber field
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "phoneNumber": "1234567890"
}
```

JSON Result Format:

```json
{
  "message": "Successfully updated phone number!"
}
```

### /api/user/updateNotifications

POST
updates user's notification settings
Requirements: sms and email field, booleans
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "sms": true,
  "email": false
}
```

JSON Result Format:

```json
{
  "message": "Successfully updated notification settings"
}
```

### /api/user/updateSpoilers

POST
updates users spoiler toggle
Requirements: hideSpoilers field
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "hideSpoilers": true
}
```

JSON Result Format:

```json
{
  "message": "Successfully updated hiding spoilers!"
}
```

### /api/user/favoriteteam

POST
favorites team for user
Requirements: JWT auth token, league and teamId  
Returns: success/failure message  
Status: working for NBA, NFL, MLB

JSON Request Format:

```json
{
  "league": "NBA",
  "teamId": "123"
}
```

JSON Result Format:

```json
{
  "message": "Successfully favorited team!"
}
```

### /api/user/unfavoriteteam

POST
unfavorites team for user
Requirements: JWT auth token, league and teamId  
Returns: success/failure message  
Status: working for NBA, NFL, MLB

JSON Request Format:

```json
{
  "league": "NBA",
  "teamId": "123"
}
```

JSON Result Format:

```json
{
  "message": "Successfully unfavorited team!"
}
```

### /api/user/favoriteteamlist

GET
Gets list of favorite teams from each league for user
Requirements: JWT auth token
Returns: list of favorite NBA, NFL, NBA teams, success/failure message  
Status: working for NBA, NFL, MLB

JSON Result Format:

```json
{
"favoriteTeams": {
"NBA": ["1234", "234"]
"NFL": [],
"MLB": ["323", "414"]
},
"message": "Success!"
}
```

### /api/user/verifyEmail

POST
verify's user's email
Requirements: hash from link
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  "hash": "dfsfsdf3234sdf"
}
```

JSON Result Format:

```json
{
  "message": "Successfully Verified Email!"
}
```

### /api/user/sendVerifyEmail

POST
sends verification email
Requirements: JWT auth token
Returns: success/failure message  
Status: Working

JSON Request Format:

```json
{
  empty
}
```

JSON Result Format:

```json
{
  "message": "Email Sent!"
}
```

### /api/epl/getUpcomingGamesFromDb

GET

gets list of upcoming EPL gameIds

Requirements: nothing

Returns: list of upcoming gameIds, success/failure message

Status: Working

JSON Result Format:

```json
{
  "gameIds": [123, 456],
  "message": "Success!"
}
```

### /api/epl/getGamesByDate/:date

GET

gets list of upcoming EPL gameIds on specified date

Requirements: specified date

Returns: list of upcoming gameIds, success/failure message

Status: Working

JSON Result Format:

```json
{
  "gameIds": [123, 456],
  "message": "Success!"
}
```

### /api/epl/getGamesByTeamFromDb/:teamId

GET

gets list of upcoming EPL gameIds by teamId

Requirements: specified teamId

Returns: list of upcoming gameIds, success/failure message

Status: Working

JSON Result Format:

```json
{
  "gameIds": [123, 456],
  "message": "Success!"
}
```

### /api/epl/getGameFromDb/:gameId

GET

gets game info for a specified gameId

Requirements: specified gameId

Returns: all game info, votedteam, success/failure message

Status: Working

JSON Result Format:

```json
{
game: {
    id: 592804,
    date: "2021-04-12T17:00:00+00:00",
    arena: "The Hawthorns",
    home: {
        teamId: 2649,
        teamImage: "https://media.api-sports.io/football/teams/2649.png",
        teamName: "Borac Cacak",
    },
    away: {
        teamId: 2640,
        teamImage: "https://media.api-sports.io/football/teams/2640.png",
        teamName: "Radnicki Pirot",
    },
    status: "In Play",
    homeScore: 0,
    awayScore: 0,
    homeWinProb: 0.3134534
    awayWinProb: 0.3211455
    drawProb: 0.3523237
    homeVoters: [],
    awayVoters: [],
    livePredictions: [],
    playedGameStats: {
      home: {
        teamId: 2649,
        points: 3,
        lineScore: [2, 3]
        shotsOnGoal: 3,
        shotsOffGoal: 2,
        totalShots: 9,
        blockedShot: 4,
        shotsInsidebox: 4,
        shotsOutsidebox: 5,
        fouls: 22,
        cornerKicks: 3,
        offsides: 1,
        ballPossessionPercentage: 32,
        yellowCards: 5,
        redCards: 1,
        goalkeeperSaves: 0,
        totalPasses: 242,
        passesAccurate: 121,
        passesPercentage: 50,
      },
      away: {
        teamId: 2640,
        points: 0,
        lineScore: [0, 0]
        shotsOnGoal: 5,
        shotsOffGoal: 3,
        totalShots: 11,
        blockedShot: 3,
        shotsInsidebox: 2,
        shotsOutsidebox: 7,
        fouls: 13,
        cornerKicks: 2,
        offsides: 3,
        ballPossessionPercentage: 68,
        yellowCards: 3,
        redCards: 2,
        goalkeeperSaves: 1,
        totalPasses: 213,
        passesAccurate: 130,
        passesPercentage: 62,
      }
    },
    period: 1,
    clock: "55"
  },
  votedTeam: "none",
  message: "Success!",
}
```

### /api/epl/getTeamStats/:teamId

GET

gets team info for a specified team

Requirements: specified gameId

Returns: all team info, success/failure message

Status: Working

JSON Result Format:

```json
{
  "team": {
    "elo": 1500,
    "position": 0,
    "_id": "6080a71422b6482a6f236739",
    "teamId": 49,
    "__v": 0,
    "biggestWinAway": "1-4",
    "biggestWinHome": "4-0",
    "draws": 10,
    "goalsAgainst": 31,
    "goalsAverageAway": "1.4",
    "goalsAverageHome": "1.7",
    "goalsFor": 50,
    "lastGameID": 592798,
    "losses": 7,
    "teamImage": "https://media.api-sports.io/football/teams/49.png",
    "teamName": "Chelsea",
    "wins": 15
  },
  "message": "Success!"
}
```

### /api/epl/getDashboard

GET  
gets all game IDs for dashboard  
Requirements: OPTIONAL auth JWT token for favorite games  
Returns: JSON list of lists of gameIds  
Status: Working  
Issues:  

JSON Format:  
```json
{
  "regFinished":[8946,8947,8352,8948],
  "regLive":[],
  "regUpcoming":[8949,8950,8951,8952,8953,8954,8955,8956,8957,8958,8360,8959,8960,8961,8962,8963,8964,8965,8966,8967,8968,8969,8970,8971,8972,8973,8974,8975],
  "favFinished":[],
  "favLive":[],
  "favUpcoming":[8951,8958,8962,8966,8970,8971]
}
  ```

  ### /api/epl/vote

POST  
user vote functionality for who they believe will win the EPL game
Requirements: gameId, home or away team, JWT auth token
Returns: JSON body message of success or failure  
Status: Working  
Issues: None?

JSON Request Format:
```json
{
  "gameId": 8701,
  "homeAway": "home"
}
```

JSON return Format:  
```json
{
  "message": "Successful!"
}
```


  ### /api/epl/getAllTeamStats

GET

gets team info for all teams

Requirements: none

Returns: all teams info, success/failure message  

Status: Working




JSON return Format:  
```json
{
  "teams": [{"look at /getTeamStats"}],
  "message": "Successful!",
}
```

### /api/mlb/getTeamsFromDb

GET

gets team info for all teams
Requirements: none
Returns: all teams info, success/failure message  
Status: Working

JSON return Format:  
```json
[{"look at /getTeamFromDb"}],
```


### /api/mlb/getTeamFromDb/:teamId

GET

gets team info for all teams  
Requirements: none  
Returns: all teams info, success/failure message  
Status: Working  

JSON return Format:  
```json
{
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
}
```

### /api/mlb/getGameFromDb/:gameId

GET

gets game info for requested gameId  
Requirements: gameId  
Returns: all game info, success/failure message  
Status: Stub  

JSON return Format:  
```json
{
  id: 632222,
  date: "2021-04-26T17:10:00Z",
  arena: "Comerica Park",
  home: {"look at /getTeamFromDb"},
  away: {"look at /getTeamFromDb"},
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
    }
  ],
  playedGameStats: {},
  livePredictions: [
    {  
        "homeConfidence" : 0.5,
        "awayConfidence" : 0.5,
        "inning" : 1,
        "half" : "top"
    }
  ],
  homeScore: 5,
  awayScore: 7,
  inning: 10,
  half: "bottom"
}
```
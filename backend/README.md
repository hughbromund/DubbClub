##  Endpoints for Game Data

### /api/nba/getBasicGameData DEPRECATED - PLEASE USE getUpcomingGamesFromDb

GET  
gets all games from the NBA in the next three days  
Requirements: none 
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:  
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

### /api/nba/getUpcomingGameIdsFromDb

GET  
gets all game IDs from the NBA in the next three days  
Requirements: none  
Returns: JSON list of gameIds  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,  

JSON Format:  
[8188,8187,8908,8909,8910,8911,8912,8913,8914,8915,8916,8917,8918,8919,8920,8921] 

### /api/nba/getUpcomingGamesFromDb

GET  
gets all games from the NBA in the next three days  
Requirements: none  
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,  

JSON Format:  
[  
      "arena": "TBD",  
      "homeVoters": [],  
      "awayVoters": [  
        "603adbd83534d306ece241ce"  
      ],  
      "_id": "60578abc7a3c4a0429a4f348",  
      "id": 8880,  
      "__v": 0,  
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

### /api/nba/getGameDetailsByGameId/:gameId  

GET  
gets game stats for specific gameId
Requirements: some valid gameId
Returns: JSON object with home and away game stats
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:  
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

### /api/nba/getGameFromDb/:gameId

GET  
gets game for specified gameId from DB
Requirements: gameId parameter, optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:  
{  
  "votedTeam": "none", (will be "none", "away", or "home")
  "game": Same as getBasicGameData json format  
  "message": "Successful!"  
}

### /api/nba/refresh

GET  
fixes gameId if necessary, handles transition between status, handles calling live game functions  
Requirements: nothing  
Returns: JSON list of changed ids plus error/success message  
Status: Working  
Issues: None  

JSON return Format:  
{"message":"Successful Refresh.","updated Ids":["Updated 8600 to 8844"]}  

### /api/nba/vote

POST  
user vote functionality for who they believe will win the NBA game
Requirements: gameId, home or away team, JWT auth token
Returns: JSON body message of success or failure  
Status: Working  
Issues: None?

JSON Request Format:
{
  "gameId": 8701,
  "homeAway": "home"
}

JSON return Format:  
{
  "message": "Successful!"
}

### /api/nba/getHighVoteGames

GET  
gets upcoming games sorted by highest vote count descending
Requirements: optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:  
{  
  "games": array of game objects, each object similar to getBasicGameData json format. Also includes the following fields on each game:
   {"voteCount", "votedTeam"}
  "message": "Successful!"  
}

### /api/nba/getHighPredictDiffGames

GET  
gets upcoming games sorted by highest vote count descending
Requirements: optional JWT auth token
Returns: JSON body of relavent data, or message of failure  
Status: Working  
Issues: None?

JSON return Format:  
{  
  "games": array of game objects, each object similar to getBasicGameData json format. Also includes the following fields on each game:
   {"votedTeam", "predictedWinnerVote", "confidenceVote", "confidenceDifference"}
  "message": "Successful!"  
}

### /api/nba/updateTeamStandings

GET  
updates each team's standing based on the information provided by the API
Requirements: nothing
Returns: status and message
Status: Working  
Issues: None  

JSON return Format: 
{
    "status": 200,
    "message": "Team standings updated successfully!"
}

### /api/nba/getTeamsFromDb

GET
gets the team objects from the db  
Requirements: nothing
Returns: the team objects  
Status: Working  
Issues: None  

JSON return Format:
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

### /api/nba/getLiveGamePreds/:league/:gameId

GET
gets a list of predictions for a live game
Requirements: the game ID and the league
Returns: a list of predictions and a header for the length of each quarter
Status: Stubbed  
Issues: Need to implement dynamic live game predictions

JSON return Format:
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


##  Endpoints for User Accounts

### /api/user/info

GET
gets all basic user info
Requirements: JWT
Returns: failure message or relevant user info
Status: Working

JSON Result Format:
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

### /api/user/resetPasswordEmail

POST
Sends a reset password email with link
Requirements: username or email in username field
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "username": "peyton",
}

JSON Result Format:
{
  "message": "If the user exists, the email was sent"
}

### /api/user/resetPassword

POST
resets user password
Requirements: hash from link, new password
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "hash": "dfsfsdf3234sdf",
  "password": "supersecret",
}

JSON Result Format:
{
  "message": "Successfully Updated Password!"
}

### /api/user/updatePhoneNumber

POST
updates user's phone number
Requirements: phoneNumber field
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "phoneNumber": "1234567890",
}

JSON Result Format:
{
  "message": "Successfully updated phone number!"
}

### /api/user/updateNotifications

POST
updates user's notification settings
Requirements: sms and email field, booleans
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "sms": true,
  "email": false
}

JSON Result Format:
{
  "message": "Successfully updated notification settings"
}


### /api/user/updateSpoilers

POST
updates users spoiler toggle
Requirements: hideSpoilers field
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "hideSpoilers": true,
}

JSON Result Format:
{
  "message": "Successfully updated hiding spoilers!"
}

### /api/user/favoriteteam

POST
favorites team for user
Requirements: JWT auth token, league and teamId  
Returns: success/failure message  
Status: working for NBA, NFL, MLB

JSON Request Format:
{
  "league": "NBA",
  "teamId": "123"
}

JSON Result Format:
{
  "message": "Successfully favorited team!"
}

### /api/user/unfavoriteteam

POST
unfavorites team for user
Requirements: JWT auth token, league and teamId  
Returns: success/failure message  
Status: working for NBA, NFL, MLB


JSON Request Format:
{
  "league": "NBA",
  "teamId": "123"
}

JSON Result Format:
{
  "message": "Successfully unfavorited team!"
}

### /api/user/favoriteteamlist

GET
Gets list of favorite teams from each league for user
Requirements: JWT auth token 
Returns: list of favorite NBA, NFL, NBA teams, success/failure message  
Status: working for NBA, NFL, MLB

JSON Result Format:
{
  "favoriteTeams": {
    "NBA": ["1234", "234"]
    "NFL": [],
    "MLB": ["323", "414"]
  },
  "message": "Success!"
}

### /api/user/verifyEmail

POST
verify's user's email
Requirements: hash from link
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  "hash": "dfsfsdf3234sdf",

}

JSON Result Format:
{
  "message": "Successfully Verified Email!"
}

### /api/user/sendVerifyEmail

POST
sends verification email
Requirements: JWT auth token
Returns: success/failure message  
Status: Working

JSON Request Format:
{
  empty
}

JSON Result Format:
{
  "message": "Email Sent!"
}

##  Endpoints for Game Data

### /api/nba/getBasicGameData

GET  
gets all games from the NBA in the next week  
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

##  Endpoints for User Accounts


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

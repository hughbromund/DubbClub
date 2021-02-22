##  Endpoints for Game Data

### /getBasicGameData

GET  
gets all games from the NBA in the next week  
Requirements: some input from search box  
Returns: JSON list of game info and each team's info  
Status: Working  
Issues: Doesn't currently have start time, uses UTC to find games,

JSON Format:  
[  
  {
    "gameId": "8608",  
    "date": "2021-02-17",  
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

##  Endpoints for User Accounts

### api/user/favoriteteam

POST
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

### api/user/unfavoriteteam

POST
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

### api/user/favoriteteamlist

GET
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
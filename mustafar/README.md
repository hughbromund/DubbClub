## Endpoints for Mustafar

### /predictnbawin/:game_id

GET  
gets the prediction for the winner of a game and the associated confidence  
Requirements: the game id of the game to predict  
Returns: JSON containing the predicted winning team id and the confidence  
Status: Working   
Issues: None

JSON Result Format:
{  
    "confidence": 0.5168772078615828,  
    "pred_winner": 17  
}

### /predictnbalivewin
GET  
gets the prediction for the winner of a game and the associated confidence for the given live game status
Requirements: the period, clock string, and the score, ELO and ID of both the home and way teams
Returns: JSON containing the predicted winning team ID and the confidence
Status: Working
Issues: Unimplemented

JSON Request Format:
{
    "period": 4
    "clock": "1:00"
    "homeScore": 60
    "awayScore": 60
    "homeELO": 1486.412
    "awayELO": 1567.32
    "homeID": 22
    "awayID": 19
}

JSON Result Format:
{
    "confidence": 0.5142857142857142,  
    "pred_winner": 25
}

### /helloworld

GET  
test endpoint to ensure deployment is running correctly  
Requirements: None  
Returns: JSON containing a message  
Status: Working  
Issues: Current deployed version only returns a string  

JSON Result Format:
{  
    "message": "Hello, world!",  
}
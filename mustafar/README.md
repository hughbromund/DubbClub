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
Requirements: the two team names of the live game prediction requested
Returns: JSON containing the predicted winning team name and the confidence  
Status: Working   
Issues: Unimplemented

JSON Request Format:
{
    "team1": "Boston Celtics",
    "team2": "Los Angeles Lakers"
}

JSON Result Format:
{
    "confidence": 0.5168772078615828,  
    "pred_winner": "Boston Celtics"
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
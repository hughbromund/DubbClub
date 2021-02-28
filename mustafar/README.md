## Endpoints for Mustafar

### /predictnbawin/:game_id

GET  
gets the prediction for the winner of a game and the associated confidence  
Requirements: the game id of the game to predict  
Returns: JSON containing the predicted winning team id and the confidence  
Status: Working   
Issues: Does not currently update the database, team ELO's and last game ID are incorrect, current deployed version may only return a string  

{  
    "confidence": 0.5168772078615828,  
    "pred_winner": 17  
}

### /helloworld

GET  
test endpoint to ensure deployment is running correctly  
Requirements: None  
Returns: JSON containing a message  
Status: Working  
Issues: Current deployed version only returns a string  

{  
    "message": "Hello, world!",  
}
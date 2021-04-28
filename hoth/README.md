## Endpoints for Hoth

### /predictnbawin/:game_id

GET  
gets the prediction for the winner of an MLB game and the associated confidence  
Requirements: various team statistics for the home and away teams as well as a flag indicating
whether or not pitcher data can be used
Returns: JSON containing the predicted winning team id and the confidence  
Status: Working   
Issues: None

JSON Result Format:
`
{  
    "confidence": 0.5168772078615828,  
    "pred_winner": 17  
}
`
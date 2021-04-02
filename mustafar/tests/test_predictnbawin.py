import json

"""
This function tests that the endpoint for predicting the winner of an NBA game works, and that
the confidence returned is the higher of the two, and is valid.

Expected:
    The flask server has been started
    The server should return a prediction with a winning team and a prediction
    The model path in main.py should be changed to the appropriate value
"""


def test_pregame_predictions(app, client):
    res = client.get('/predictnbawin/6911')
    assert res.status_code == 200
    res_dict = json.loads(res.get_data(as_text=True))
    assert res_dict["confidence"] >= 0.50
    assert res_dict["confidence"] <= 1.0


"""
This function tests that the endpoint for predicting the winner of a live game works
with valid input.

Expected:
    The flask server has been started
    The server should return a prediction with a home and win probability which are valid
    The period and time elapsed in the period should be returned and be valid
"""


def test_live_predictions(app, client):
    res = client.get(
        '/predictnbalivewin?period=4&clock=1&homeScore=91&awayScore=92&homeELO=1500&awayELO=1500&homeID=22&awayID=25')
    assert res.status_code == 200
    res_dict = json.loads(res.get_data(as_text=True))
    assert res_dict["homeConfidence"] >= 0.0
    assert res_dict["homeConfidence"] <= 1.0
    assert res_dict["awayConfidence"] >= 0.0
    assert res_dict["awayConfidence"] <= 1.0
    assert res_dict["awayConfidence"] == 1.0 - res_dict["homeConfidence"]
    assert res_dict["period"] >= 1
    assert res_dict["timeElapsed"] <= 2880


"""
This function tests that the endpoint for predicting the winner of a live game works
when no time remains on a clock and a team is victorious.

Expected:
    The flask server has been started
    The away team confidence should be 100% and the home team 0%
"""


def test_live_predictions_win_loss(app, client):
    res = client.get(
        '/predictnbalivewin?period=4&clock=0&homeScore=91&awayScore=92&homeELO=1500&awayELO=1500&homeID=22&awayID=25')
    assert res.status_code == 200
    res_dict = json.loads(res.get_data(as_text=True))
    assert res_dict["homeConfidence"] == 0.0
    assert res_dict["awayConfidence"] == 1.0


"""
This function tests that the endpoint for predicting the winner of a live game works
when no time remains on a clock and the teams are tied (an overtime is triggered)

Expected:
    The flask server has been started
    The home and away team confidences should be 50% each
"""


def test_live_predictions_OT(app, client):
    res = client.get(
        '/predictnbalivewin?period=4&clock=0&homeScore=92&awayScore=92&homeELO=1500&awayELO=1500&homeID=22&awayID=25')
    assert res.status_code == 200
    res_dict = json.loads(res.get_data(as_text=True))
    assert res_dict["homeConfidence"] == 0.5
    assert res_dict["awayConfidence"] == 0.5

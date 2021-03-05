import json


"""
This function tests that the endpoint for predicting the winner of an NBA game works, and that
the confidence returned is the higher of the two, and is valid.

Expected:
    The flask server has been started
    The server should return a prediction with a winning team and a prediction
    The model path in main.py should be changed to the appropriate value
"""


def test_index(app, client):
    res = client.get('/predictnbawin/6911')
    assert res.status_code == 200
    res_dict = json.loads(res.get_data(as_text=True))
    assert res_dict["confidence"] >= 0.50
    assert res_dict["confidence"] <= 1.0

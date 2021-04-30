from flask import Flask, request
import requests
import pandas as pd
import pickle
import json
from pymongo import MongoClient
import math
import datetime
import numpy as np

app = Flask(__name__)


@app.route("/predicteplpregame")
def predict_epl_pregame():
    arguments = request.args.to_dict()

    # Get data from arguments
    h_elo_before = float(arguments["hEloBefore"])
    a_elo_before = float(arguments["aEloBefore"])
    h_match_played = int(arguments["hMatchPlayed"])
    a_match_played = int(arguments["aMatchPlayed"])
    h_goal_diff = int(arguments["hGoalDiff"])
    a_goal_diff = int(arguments["aGoalDiff"])
    h_win_percent = float(arguments["hWinPercent"])
    a_win_percent = float(arguments["aWinPercent"])
    h_win_percent_last_5 = float(arguments["hWinPercentLast5"])
    a_win_percent_last_5 = float(arguments["aWinPercentLast5"])
    goal_diff_diff = int(arguments["goalDiffDiff"])

    data_builder = {
        "h_elo_before": [h_elo_before],
        "a_elo_before": [a_elo_before],
        "h_match_played": [h_match_played],
        "h_goal_diff": [h_goal_diff],
        "h_win_percent": [h_win_percent],
        "h_win_percent_last_5": [h_win_percent_last_5],
        "a_match_played": [a_match_played],
        "a_goal_diff": [a_goal_diff],
        "a_win_percent": [a_win_percent],
        "a_win_percent_last_5": [a_win_percent_last_5],
        "goal_diff_diff": [goal_diff_diff]
    }

    data = pd.DataFrame(data_builder)

    print(data)

    # Make prediction
    loaded_model = pickle.load(open('./epl_pregame_prediction.pkl', 'rb'))
    y_pred = loaded_model.predict(data)
    probs = loaded_model.predict_proba(data)

    classes = loaded_model.classes_

    home_win_prob = float(probs[0][np.where(classes == 0)][0])
    draw_prob = float(probs[0][np.where(classes == 1)][0])
    away_win_prob = float(probs[0][np.where(classes == 2)][0])

    ret_obj = {
        "homeWinProb": home_win_prob,
        "drawProb": draw_prob,
        "awayWinProb": away_win_prob
    }

    return ret_obj


if __name__ == "__main__":
    app.run()

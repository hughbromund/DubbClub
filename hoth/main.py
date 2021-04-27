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


@app.route("/predictmlbpregame")
def predict_epl_pregame():
    arguments = request.args.to_dict()

    h_id = int(arguments["hId"])
    a_id = int(arguments["aId"])

    # Build from arguments
    data_builder = {
        "a_2_plays": [float(arguments["a2Plays"])],
        "a_3_plays": [float(arguments["a3Plays"])],
        "a_assists": [float(arguments["aAssists"])],
        "a_at_bats": [float(arguments["aAtBats"])],
        "a_balks": [float(arguments["aBalks"])],
        "a_bases_stolen": [float(arguments["aBasesStolen"])],
        "a_caught_stealing": [float(arguments["aCaughtStealing"])],
        "a_doubles": [float(arguments["a2"])],
        "a_errors": [float(arguments["aErrors"])],
        "a_grounded_to_double": [float(arguments["aGround2"])],
        "a_hit_by_pitch": [float(arguments["aHitByPitch"])],
        "a_hits": [float(arguments["aHits"])],
        "a_homeruns": [float(arguments["aHR"])],
        "a_ind_earned_runs": [float(arguments["aEarnedRuns"])],
        "a_int_walks": [float(arguments["aIntWalks"])],
        "a_left_on_base": [float(arguments["aLeftOnBase"])],
        "a_putouts": [float(arguments["aPutouts"])],
        "a_rbi": [float(arguments["aRBI"])],
        "a_runs": [float(arguments["aRuns"])],
        "a_sac_flies": [float(arguments["aSacFlies"])],
        "a_strikeouts": [float(arguments["aKO"])],
        "a_triples": [float(arguments["a3"])],
        "a_walks": [float(arguments["aWalks"])],
        "a_wild_pitches": [float(arguments["aWildPitches"])],

        "h_2_plays": [float(arguments["h2Plays"])],
        "h_3_plays": [float(arguments["h3Plays"])],
        "h_assists": [float(arguments["hAssists"])],
        "h_at_bats": [float(arguments["hAtBats"])],
        "h_balks": [float(arguments["hBalks"])],
        "h_bases_stolen": [float(arguments["hBasesStolen"])],
        "h_caught_stealing": [float(arguments["hCaughtStealing"])],
        "h_doubles": [float(arguments["h2"])],
        "h_errors": [float(arguments["hErrors"])],
        "h_grounded_to_double": [float(arguments["hGround2"])],
        "h_hit_by_pitch": [float(arguments["hHitByPitch"])],
        "h_hits": [float(arguments["hHits"])],
        "h_homeruns": [float(arguments["hHR"])],
        "h_ind_earned_runs": [float(arguments["hEarnedRuns"])],
        "h_int_walks": [float(arguments["hIntWalks"])],
        "h_left_on_base": [float(arguments["hLeftOnBase"])],
        "h_putouts": [float(arguments["hPutouts"])],
        "h_rbi": [float(arguments["hRBI"])],
        "h_runs": [float(arguments["hRuns"])],
        "h_sac_flies": [float(arguments["hSacFlies"])],
        "h_strikeouts": [float(arguments["hKO"])],
        "h_triples": [float(arguments["h3"])],
        "h_walks": [float(arguments["hWalks"])],
        "h_wild_pitches": [float(arguments["hWildPitches"])],

        "h_elo": [float(arguments["hEloBefore"])],
        "a_elo": [float(arguments["aEloBefore"])]
    }

    if arguments["hasPitcher"] == "true":
        data_builder["h_pitch_rgs"] = [float(arguments["hRGS"])]
        data_builder["a_pitch_rgs"] = [float(arguments["aRGS"])]

    data = pd.DataFrame(data_builder)

    loaded_model = None
    if arguments["hasPitcher"] == "true":
        loaded_model = pickle.load(
            open('./mlb_pregame_prediction_with_pitcher.pkl', 'rb'))
    else:
        loaded_model = pickle.load(
            open('./mlb_pregame_prediction_without_pitcher.pkl', 'rb'))

    y_pred = loaded_model.predict(data)
    probability_matrix = loaded_model.predict_proba(data)

    output_dict = {
        "pred_winner": 0,
        "confidence": 0.0
    }

    max_conf = max(probability_matrix[0])

    # print(max_conf)
    if y_pred[0] == 1:
        output_dict["pred_winner"] = int(h_id)
    else:
        output_dict["pred_winner"] = int(a_id)

    output_dict["confidence"] = float(max_conf)

    return output_dict


if __name__ == "__main__":
    app.run()

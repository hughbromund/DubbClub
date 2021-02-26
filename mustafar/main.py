from flask import Flask
import requests
import pandas as pd
import pickle
import json
from pymongo import MongoClient
import math

app = Flask(__name__)

config_dict = {}
with open('config.json') as f:
    config_dict = json.load(f)

headers = {
    'x-rapidapi-key': config_dict["nbaApiKey"],
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
}

# Prepare database
client = MongoClient(config_dict["databaseURI"])
db = client["DubbClub-Database"]
teams_col = db["Teams"]


def get_last_10_games(home_id, away_id):
    # Make API request for past 10 games by id for each team
    team_id_list = [home_id, away_id]
    team_game_lists = [[], []]
    for i in range(len(team_id_list)):
        team_url = "https://api-nba-v1.p.rapidapi.com/games/teamId/" + \
            team_id_list[i]
        response = requests.request("GET", team_url, headers=headers).json()
        full_games_list = response["api"]["games"]
        for game in reversed(full_games_list):
            if game["statusGame"] == "Finished":
                team_game_lists[i].append(game["gameId"])
            if len(team_game_lists[i]) == 10:
                break

    return team_game_lists


def get_past_10_avg_stats(game_list, team_id, prefix):
    game_stats_builder = {
        prefix + "points": [0],
        prefix + "field_goals_attempted": [0],
        prefix + "field_goals_made": [0],
        prefix + "field_goals_missed": [0],
        prefix + "free_throws_attempted": [0],
        prefix + "free_throws_made": [0],
        prefix + "free_throws_missed": [0],
        prefix + "3_pt_attempted": [0],
        prefix + "3_pt_made": [0],
        prefix + "3_pt_missed": [0],
        prefix + "2_pt_attempted": [0],
        prefix + "2_pt_made": [0],
        prefix + "2_pt_missed": [0],
        prefix + "total_reb": [0],
        prefix + "off_reb": [0],
        prefix + "def_reb": [0],
        prefix + "assists": [0],
        prefix + "steals": [0],
        prefix + "turnovers": [0],
        prefix + "blocks": [0],
        prefix + "fouls": [0]
    }

    for game in game_list:
        game_url = "https://api-nba-v1.p.rapidapi.com/statistics/games/gameId/" + game
        response = requests.request("GET", game_url, headers=headers).json()
        stats_data = response["api"]["statistics"]

        team_ind = 0
        if stats_data[1]["teamId"] == team_id:
            team_ind = 1

        game_stats_builder[prefix +
                           "points"][0] += int(stats_data[team_ind]["points"])
        game_stats_builder[prefix +
                           "field_goals_attempted"][0] += int(stats_data[team_ind]["fga"])
        game_stats_builder[prefix +
                           "field_goals_made"][0] += int(stats_data[team_ind]["fgm"])
        game_stats_builder[prefix + "field_goals_missed"][0] += \
            int(stats_data[team_ind]["fga"]) - int(stats_data[team_ind]["fgm"])
        game_stats_builder[prefix +
                           "free_throws_attempted"][0] += int(stats_data[team_ind]["fta"])
        game_stats_builder[prefix +
                           "free_throws_made"][0] += int(stats_data[team_ind]["ftm"])
        game_stats_builder[prefix + "free_throws_missed"][0] += \
            int(stats_data[team_ind]["fta"]) - int(stats_data[team_ind]["ftm"])
        game_stats_builder[prefix +
                           "3_pt_attempted"][0] += int(stats_data[team_ind]["tpa"])
        game_stats_builder[prefix +
                           "3_pt_made"][0] += int(stats_data[team_ind]["tpm"])
        game_stats_builder[prefix + "3_pt_missed"][0] += \
            int(stats_data[team_ind]["tpa"]) - int(stats_data[team_ind]["tpm"])

        h_2_pt_attempted = int(
            stats_data[team_ind]["fga"]) - int(stats_data[team_ind]["tpa"])
        h_2_pt_made = int(stats_data[team_ind]["fgm"]) - \
            int(stats_data[team_ind]["tpm"])
        h_2_pt_missed = h_2_pt_attempted - h_2_pt_made

        game_stats_builder[prefix + "2_pt_attempted"][0] += h_2_pt_attempted
        game_stats_builder[prefix + "2_pt_made"][0] += h_2_pt_made
        game_stats_builder[prefix + "2_pt_missed"][0] += h_2_pt_missed

        game_stats_builder[prefix +
                           "total_reb"][0] += int(stats_data[team_ind]["totReb"])
        game_stats_builder[prefix +
                           "off_reb"][0] += int(stats_data[team_ind]["offReb"])
        game_stats_builder[prefix +
                           "def_reb"][0] += int(stats_data[team_ind]["defReb"])
        game_stats_builder[prefix +
                           "assists"][0] += int(stats_data[team_ind]["assists"])
        game_stats_builder[prefix +
                           "steals"][0] += int(stats_data[team_ind]["steals"])
        game_stats_builder[prefix +
                           "turnovers"][0] += int(stats_data[team_ind]["turnovers"])
        game_stats_builder[prefix +
                           "blocks"][0] += int(stats_data[team_ind]["blocks"])
        game_stats_builder[prefix +
                           "fouls"][0] += int(stats_data[team_ind]["pFouls"])

    for stat in game_stats_builder:
        game_stats_builder[stat][0] = game_stats_builder[stat][0] / 10.0

    return pd.DataFrame(data=game_stats_builder)


def win_probs(home_elo, away_elo, home_court_advantage):
    """ Home and road team win probabilities implied by Elo ratings and home court adjustment
    """
    h = math.pow(10, home_elo/400)
    r = math.pow(10, away_elo/400)
    a = math.pow(10, home_court_advantage/400)

    denom = r + a*h
    home_prob = a*h / denom
    away_prob = r / denom

    return home_prob, away_prob


def home_odds_on(home_elo, away_elo, home_court_advantage):
    """ Odds the home team will win based on elo ratings and home court advantage
    """

    h = math.pow(10, home_elo/400)
    r = math.pow(10, away_elo/400)
    a = math.pow(10, home_court_advantage/400)
    return a*h/r


def update_elo(home_score, away_score, home_elo, away_elo, home_court_advantage):
    """ This function determines the constant used in the elo rating, based on margin of victory and difference in elo ratings
    """
    home_prob, away_prob = win_probs(home_elo, away_elo, home_court_advantage)

    home_score_int = int(home_score)
    away_score_int = int(away_score)

    if (home_score_int - away_score_int > 0):
        home_win = 1
        away_win = 0
    else:
        home_win = 0
        away_win = 1

    k = elo_k(home_score_int - away_score_int, home_elo - away_elo)

    updated_home_elo = home_elo + k * (home_win - home_prob)
    updated_away_elo = away_elo + k * (away_win - away_prob)

    return updated_home_elo, updated_away_elo


def elo_k(MOV, elo_diff):
    k = 20
    if MOV > 0:
        multiplier = (MOV+3)**(0.8)/(7.5+0.006*(elo_diff))
    else:
        multiplier = (-MOV+3)**(0.8)/(7.5+0.006*(-elo_diff))
    return k*multiplier


def update_team_elo(last_game_id, target_team_id):

    # Make API request to get the teams/team ID's
    game_url = "https://api-nba-v1.p.rapidapi.com/games/gameId/" + \
        str(last_game_id)
    response = requests.request("GET", game_url, headers=headers).json()

    # Get the previous elo of each team and the score of the requested game
    game_season = response["api"]["games"][0]["seasonYear"]
    h_id = response["api"]["games"][0]["hTeam"]["teamId"]
    a_id = response["api"]["games"][0]["vTeam"]["teamId"]
    h_points = int(response["api"]["games"][0]["hTeam"]["score"]["points"])
    a_points = int(response["api"]["games"][0]["vTeam"]["score"]["points"])

    h_team_data = list(teams_col.find({"tid": int(h_id)}))[0]
    h_elo_before = h_team_data["elo"]
    h_last_game_id = h_team_data["lastGameID"]

    a_team_data = list(teams_col.find({"tid": int(a_id)}))[0]
    a_elo_before = a_team_data["elo"]
    a_last_game_id = a_team_data["lastGameID"]

    # Get season of last game for home and away
    h_last_game_url = "https://api-nba-v1.p.rapidapi.com/games/gameId/" + \
        str(h_last_game_id)
    h_last_game_resp = requests.request(
        "GET", game_url, headers=headers).json()
    h_last_game_season = h_last_game_resp["api"]["games"][0]["seasonYear"]

    a_last_game_url = "https://api-nba-v1.p.rapidapi.com/games/gameId/" + \
        str(a_last_game_id)
    a_last_game_resp = requests.request(
        "GET", game_url, headers=headers).json()
    a_last_game_season = a_last_game_resp["api"]["games"][0]["seasonYear"]

    if h_last_game_season != game_season:
        h_elo_before = (0.75 * h_elo_before) + (0.25 * 1505)
    if a_last_game_season != game_season:
        a_elo_before = (0.75 * a_elo_before) + (0.25 * 1505)

    h_elo_after, a_elo_after = update_elo(
        h_points, a_points, h_elo_before, a_elo_before, 69)

    if int(h_last_game_id) < int(last_game_id):
        teams_col.update_one({
            'tid': int(h_id)
        }, {
            '$set': {
                'elo': h_elo_after,
                'lastGameID': int(last_game_id)
            }
        }, upsert=False)
    if int(a_last_game_id) < int(last_game_id):
        teams_col.update_one({
            'tid': int(a_id)
        }, {
            '$set': {
                'elo': a_elo_after,
                'lastGameID': int(last_game_id)
            }
        }, upsert=False)

    if h_id == target_team_id:
        return h_elo_after
    return a_elo_after


@app.route("/predictnbawin/<game_id>")
def predict_nba_winner(game_id="6911"):
    """ Outputs the predicted winner of an NBA game by id
    Returns a tuple in the form (<winnning team id>, confidence)
    """

    game_id = str(game_id)

    # Make API request to get the teams/team ID's
    game_url = "https://api-nba-v1.p.rapidapi.com/games/gameId/" + game_id
    response = requests.request("GET", game_url, headers=headers).json()

    season = response["api"]["games"][0]["seasonYear"]
    h_id = response["api"]["games"][0]["hTeam"]["teamId"]
    a_id = response["api"]["games"][0]["vTeam"]["teamId"]

    # Query DB for last game and ELO
    h_team_data = list(teams_col.find({"tid": int(h_id)}))[0]
    a_team_data = list(teams_col.find({"tid": int(a_id)}))[0]

    h_elo = h_team_data["elo"]
    a_elo = a_team_data["elo"]
    h_last_game = h_team_data["lastGameID"]
    a_last_game = a_team_data["lastGameID"]

    # Make API request for last 10 games per team
    team_game_lists = get_last_10_games(h_id, a_id)

    # Update team ELO and last game if necessary
    if (int(team_game_lists[0][0]) > h_last_game):
        h_elo = update_team_elo(int(team_game_lists[0][0]), int(h_id))
    if (int(team_game_lists[1][0]) > a_last_game):
        a_elo = update_team_elo(int(team_game_lists[1][0]), int(a_id))

    # Make API request for last 10 game stats and calculate averages
    h_df = get_past_10_avg_stats(
        game_list=team_game_lists[0], team_id=h_id, prefix="h_")
    a_df = get_past_10_avg_stats(
        game_list=team_game_lists[1], team_id=a_id, prefix="a_")

    # Form dataframe and predict
    h_df["h_elo_before"] = h_elo
    a_df["a_elo_before"] = a_elo

    final_df = pd.concat([h_df, a_df], axis=1)

    # TODO: change path to model in cloud
    loaded_model = pickle.load(open('./model.pkl', 'rb'))
    y_pred = loaded_model.predict(final_df)
    probability_matrix = loaded_model.predict_proba(final_df)

    output_dict = {
        "pred_winner": 0,
        "confidence": 0.0
    }

    max_conf = max(probability_matrix[0])
    if y_pred[0] == 1:
        output_dict["pred_winner"] = int(h_id)
    else:
        output_dict["pred_winner"] = int(a_id)

    output_dict["confidence"] = max_conf
    # output_json = json.dumps(output_dict, indent=4)

    return output_dict


@app.route("/helloworld")
def hello_world():
    output_dict = {
        "message": "Hello, world!",
    }
    # output_json = json.dumps(output_dict, indent=4)
    return output_dict


if __name__ == "__main__":
    app.run()

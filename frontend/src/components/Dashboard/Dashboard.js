import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import AuthContext from "../../contexts/AuthContext.js";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import {
  DATE_OPTIONS,
  GAME_INFO_ROUTE,
  NEXT_SEVEN_DAYS_BASIC_GAME_INFO,
  GET_GAME_BY_ID_FROM_DB,
} from "../../constants/Constants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";

import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";

const INITIAL_STATE = {
  games: {},
  currentDate: new Date().setHours(0, 0, 0, 0),
  predictions: {},
};

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
    this.fetchGameData = this.fetchGameData.bind(this);
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.getPredictionConfidence = this.getPredictionConfidence.bind(this);
    this.getPredictedWinner = this.getPredictedWinner.bind(this);
  }

  async fetchPrediction(gameID) {
    var res = await fetch(GET_GAME_BY_ID_FROM_DB + `/${gameID}`, {});
    var body = await res.json();
    var temp = this.state.predictions;
    if (body.game !== undefined) {
      temp[gameID] = {
        predictedWinner: getTeamByID(body.game.predictedWinner),
        confidence: body.game.confidence,
      };
      this.setState({ predictions: temp });
    }
  }
  async fetchGameData() {
    var res = await fetch(NEXT_SEVEN_DAYS_BASIC_GAME_INFO, {});
    var body = await res.json();
    this.setState({
      games: body,
      currentDate: new Date().setHours(0, 0, 0, 0),
    });
    for (var i = 0; i < body.length; i++) {
      if (body[i].gameId !== undefined) {
        await this.fetchPrediction(body[i].gameId);
      }
    }
  }
  getPredictionConfidence(gameId) {
    if (this.state.predictions[gameId] === undefined) {
      return 50;
    }
    return Math.floor(this.state.predictions[gameId].confidence * 100);
  }

  getPredictedWinner(gameId) {
    if (this.state.predictions[gameId] === undefined) {
      return "";
    }
    return this.state.predictions[gameId].predictedWinner;
  }

  async componentDidMount() {
    if (this.state.games.length === undefined) {
      this.fetchGameData();
    }
  }

  render() {
    if (this.state.games.length === undefined) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }
    var followedGames = [];
    var otherGames = [];

    for (var i = 0; i < this.state.games.length; i++) {
      if (
        this.context.isFollowedTeam("NBA", this.state.games[i].away.teamId) ||
        this.context.isFollowedTeam("NBA", this.state.games[i].home.teamId)
      ) {
        followedGames.push(this.state.games[i]);
      } else {
        otherGames.push(this.state.games[i]);
      }
    }

    // console.log({ followedGames });
    // console.log({ otherGames });

    var followedCards = [];

    for (let i = 0; i < followedGames.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            homeTeam={followedGames[i].home.teamName}
            awayTeam={followedGames[i].away.teamName}
            gameTime={new Date(this.state.games[i].date).toLocaleDateString(
              "en-US",
              DATE_OPTIONS
            )}
            predictedWinner={this.getPredictedWinner(followedGames[i].gameId)}
            predictionConfidence={this.getPredictionConfidence(
              followedGames[i].gameId
            )}
            awayLogo={followedGames[i].away.teamImage}
            homeLogo={followedGames[i].home.teamImage}
            venue={followedGames[i].arena}
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            homeHex={getColorByTeam(followedGames[i].home.teamName)}
            awayHex={getColorByTeam(followedGames[i].away.teamName)}
            homeId={followedGames[i].home.teamId}
            awayId={followedGames[i].away.teamId}
            gameID={followedGames[i].gameId}
            history={this.props.history}
            key={"favorite-" + i}
          />
        </Col>
      );
      followedCards.push(temp);
    }
    if (followedCards.length === 0) {
      followedCards.push(
        <Col>
          <Card>
            <b>No Favorited Teams</b>
            <hr />
            To Favorite Teams, simply hover over the logo of the team you want
            to favorite and click the Favorite button.
          </Card>
        </Col>
      );
    }

    var otherCards = [];

    for (let i = 0; i < otherGames.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            homeTeam={otherGames[i].home.teamName}
            awayTeam={otherGames[i].away.teamName}
            gameTime={new Date(this.state.games[i].date).toLocaleDateString(
              "en-US",
              DATE_OPTIONS
            )}
            predictedWinner={this.getPredictedWinner(otherGames[i].gameId)}
            predictionConfidence={this.getPredictionConfidence(
              otherGames[i].gameId
            )}
            awayLogo={otherGames[i].away.teamImage}
            homeLogo={otherGames[i].home.teamImage}
            venue={otherGames[i].arena}
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            homeHex={getColorByTeam(otherGames[i].home.teamName)}
            awayHex={getColorByTeam(otherGames[i].away.teamName)}
            homeId={otherGames[i].home.teamId}
            awayId={otherGames[i].away.teamId}
            gameID={otherGames[i].gameId}
            history={this.props.history}
            key={"other-" + i}
          />
        </Col>
      );
      otherCards.push(temp);
    }

    return (
      <div>
        <Container fluid>
          <h1>
            Welcome Back <b>{this.context.username}</b>
          </h1>
          <h3>Upcoming Games from Teams you Follow</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {followedCards}
          </Row>
          <h3>Upcoming Games</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {otherCards}
          </Row>
        </Container>
      </div>
    );
  }
}
Dashboard.contextType = AuthContext;

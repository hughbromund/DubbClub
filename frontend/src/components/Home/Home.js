import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  DATE_OPTIONS,
  GAME_INFO_ROUTE,
  GET_GAME_BY_ID_FROM_DB,
  NEXT_SEVEN_DAYS_BASIC_GAME_INFO,
} from "../../constants/Constants";
import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const INITIAL_STATE = {
  games: {},
  currentDate: new Date().setHours(0, 0, 0, 0),
  predictions: {},
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    if (
      localStorage.getItem("homepageState") === null ||
      JSON.parse(localStorage.getItem("homepageState")).currentDate !==
        new Date().setHours(0, 0, 0, 0)
    ) {
      this.state = INITIAL_STATE;
    } else {
      this.state = JSON.parse(localStorage.getItem("homepageState"));
    }

    this.fetchGameData = this.fetchGameData.bind(this);
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.getPredictedWinner = this.getPredictedWinner.bind(this);
    this.getPredictionConfidence = this.getPredictionConfidence.bind(this);
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

  componentWillUnmount() {
    localStorage.setItem("homepageState", JSON.stringify(this.state));
  }

  render() {
    if (this.state.games.length === undefined) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }
    let cards = [];
    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            homeTeam={this.state.games[i].home.teamName}
            awayTeam={this.state.games[i].away.teamName}
            gameTime={new Date(this.state.games[i].date).toLocaleDateString(
              "en-US",
              DATE_OPTIONS
            )}
            predictedWinner={this.getPredictedWinner(
              this.state.games[i].gameId
            )}
            predictionConfidence={this.getPredictionConfidence(
              this.state.games[i].gameId
            )}
            awayLogo={this.state.games[i].away.teamImage}
            homeLogo={this.state.games[i].home.teamImage}
            venue={this.state.games[i].arena}
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            homeHex={getColorByTeam(this.state.games[i].home.teamName)}
            awayHex={getColorByTeam(this.state.games[i].away.teamName)}
            homeId={this.state.games[i].home.teamId}
            awayId={this.state.games[i].away.teamId}
            key={i}
          />
        </Col>
      );
      cards.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>Homepage</h1>
          <br />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {cards}
          </Row>
        </Container>
      </div>
    );
  }
}

import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  DATE_OPTIONS,
  GAME_INFO_ROUTE,
  NEXT_SEVEN_DAYS_BASIC_GAME_INFO
} from "../../constants/Constants";
import { getColorByTeam } from "../../constants/NBAConstants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const INITIAL_STATE = {
  games: {},
  currentDate: new Date().setHours(0, 0, 0, 0),
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
  }

  async fetchGameData() {
    var res = await fetch(NEXT_SEVEN_DAYS_BASIC_GAME_INFO, {});
    var body = await res.json();
    this.setState({
      games: body,
      currentDate: new Date().setHours(0, 0, 0, 0),
    });
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
            predictedWinner={Math.random() < 0.5 ? "home" : "away"}
            predictionConfidence={Math.floor(Math.random() * 50) + 50}
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

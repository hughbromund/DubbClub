import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "../Card/Card";
import {
  GAME_INFO_ROUTE,
  GET_DASHBOARD,
  UPCOMING_GAMES_ID,
  EPL_GET_UPCOMING_GAMES,
  EPL,
  NBA,
  MLB,
} from "../../constants/Constants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import Masthead from "../Masthead/Masthead";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const INITIAL_STATE = {
  games: {},
  currentDate: new Date().setHours(0, 0, 0, 0),
  predictions: {},
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      EPLGames: [],
    };

    this.fetchGameData = this.fetchGameData.bind(this);
    this.fetchEPLGameData = this.fetchEPLGameData.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(GET_DASHBOARD, {});
    var body = await res.json();
    this.setState({
      games: body,
      currentDate: new Date().setHours(0, 0, 0, 0),
    });
  }
  async fetchEPLGameData() {
    var res = await fetch(EPL_GET_UPCOMING_GAMES, {});
    var body = await res.json();
    this.setState({
      EPLGames: body.gameIds,
    });
  }

  async componentDidMount() {
    this.fetchGameData();
    this.fetchEPLGameData();
  }

  render() {
    if (this.state.games.length === 0) {
      return (
        <div>
          <Container fluid>
            <Masthead />
            <LoadingSpinner />
          </Container>
        </div>
      );
    }
    let cards = [];
    // console.log(this.state.games.regUpcoming);
    for (let i = 0; i < this.state.games.regUpcoming.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games.regUpcoming[i]}`
              );
            }}
            gameID={this.state.games.regUpcoming[i]}
            history={this.props.history}
            key={i}
            league={NBA}
          />
        </Col>
      );
      cards.push(temp);
    }
    let liveCards = [];
    // console.log(this.state.games.regLive);
    for (let i = 0; i < this.state.games.regLive.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games.regLive[i]}`
              );
            }}
            gameID={this.state.games.regLive[i]}
            history={this.props.history}
            key={i}
            league={NBA}
          />
        </Col>
      );
      liveCards.push(temp);
    }
    let EPLCards = [];
    for (let i = 0; i < this.state.EPLGames.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE +
                  `/${this.props.league}/${this.state.games.regLive[i]}`
              );
            }}
            gameID={this.state.EPLGames[i]}
            history={this.props.history}
            key={i}
            league={EPL}
          />
        </Col>
      );
      EPLCards.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <Masthead history={this.props.history} />
          <div hidden={liveCards.length === 0}>
            <h3>Live Games</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {liveCards.length !== 0 ? (
                liveCards
              ) : (
                <Card>No currently running games.</Card>
              )}
            </Row>
          </div>
          <h3>Upcoming NBA Games with Dubb Club Predictions</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {cards.slice(0, 9)}
          </Row>
          <h3>Upcoming EPL Games with Dubb Club Predictions</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {EPLCards.slice(0, 9)}
          </Row>
          <h3>Upcoming MLB Games with Dubb Club Predictions</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            <Col>
              <GameInfoCard league={MLB} gameID={"000000"} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

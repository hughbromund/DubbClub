import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { GAME_INFO_ROUTE, UPCOMING_GAMES_ID } from "../../constants/Constants";
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
    };

    this.fetchGameData = this.fetchGameData.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(UPCOMING_GAMES_ID, {});
    var body = await res.json();
    this.setState({
      games: body,
      currentDate: new Date().setHours(0, 0, 0, 0),
    });
  }

  async componentDidMount() {
    this.fetchGameData();
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
    // console.log(this.state.games);
    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            gameID={this.state.games[i]}
            history={this.props.history}
            key={i}
          />
        </Col>
      );
      cards.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <Masthead history={this.props.history} />

          <h3>Upcoming Games with Dubb Club Predictions</h3>
          <hr />
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {cards}
          </Row>
        </Container>
      </div>
    );
  }
}

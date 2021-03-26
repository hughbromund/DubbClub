import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import AuthContext from "../../contexts/AuthContext.js";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import {
  GAME_INFO_ROUTE,
  UPCOMING_GAMES_INFO,
} from "../../constants/Constants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";

const INITIAL_STATE = {
  games: {},
};

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
    this.fetchGameData = this.fetchGameData.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(UPCOMING_GAMES_INFO, {});
    var body = await res.json();
    console.log(body);
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
        this.context.isFollowedTeam(
          "NBA",
          this.state.games[i].away[0].teamId
        ) ||
        this.context.isFollowedTeam("NBA", this.state.games[i].home[0].teamId)
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
        <Col key={"favorite-col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].id}`
              );
            }}
            gameID={followedGames[i].id}
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
        <Col key={"other-col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].id}`
              );
            }}
            gameID={otherGames[i].id}
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

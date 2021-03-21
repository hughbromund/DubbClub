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
  }

  async fetchGameData() {
    var res = await fetch(NEXT_SEVEN_DAYS_BASIC_GAME_INFO, {});
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
      if (
        followedGames[i].home.teamName === undefined ||
        followedGames[i].away.teamName === undefined
      ) {
        continue;
      }
      let temp = (
        <Col key={"favorite-col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
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
      if (
        otherGames[i].home.teamName === undefined ||
        otherGames[i].away.teamName === undefined
      ) {
        continue;
      }
      let temp = (
        <Col key={"other-col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
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

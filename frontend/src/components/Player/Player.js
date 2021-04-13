import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";
import GameInfoCard from "../GameInfoCard/GameInfoCard";

import { GET_PLAYER_INFO } from "../../constants/Constants";

import classes from "./Player.module.css";

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      career: {},
      mostRecentGame: {},
      playerInfo: {},
      seasons: [],
    };

    this.generateRecentGameStats = this.generateRecentGameStats.bind(this);
    this.generateCareerStats = this.generateCareerStats.bind(this);
  }

  async componentDidMount() {
    var res = await fetch(GET_PLAYER_INFO);

    var body = await res.json();

    console.log(body);

    this.setState({
      loading: false,
      career: body.career,
      mostRecentGame: body.mostRecentGame,
      playerInfo: body.playerInfo,
      seasons: body.seasons,
    });
  }

  generateRecentGameStats() {
    var output = [];

    for (var propt in this.state.mostRecentGame) {
      if (propt === "gameId" || propt === "teamId" || propt === "playerId") {
        continue;
      }
      output.push(
        <Col>
          <b>{propt.toUpperCase()}</b>: {this.state.mostRecentGame[propt]}
        </Col>
      );
    }

    return output;
  }

  generateCareerStats() {
    var output = [];

    for (var propt in this.state.career) {
      if (
        propt === "gameId" ||
        propt === "teamId" ||
        propt === "season" ||
        propt === "playerId"
      ) {
        continue;
      }
      output.push(
        <Col>
          <b>{propt.toUpperCase()}</b>: {this.state.career[propt]}
        </Col>
      );
    }

    return output;
  }

  render() {
    // console.log(this.state);

    if (this.state.loading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div>
        <Container>
          <Card className={classes.PlayerInfoCard}>
            <Row>
              <Col xs={2}>
                <img
                  style={{ width: "100%" }}
                  src={this.state.playerInfo.teamImage}
                />
              </Col>
              <Col>
                <h1>
                  <b>
                    {this.state.playerInfo.firstName}{" "}
                    {this.state.playerInfo.lastName}
                  </b>
                </h1>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col>
              <GameInfoCard gameID={this.state.mostRecentGame.gameId} />
            </Col>
            <Col>
              <Row>
                <Card className={classes.MostRecentGameStats}>
                  <h3>Most Recent Game Stats</h3>
                  <Row md={3}>{this.generateRecentGameStats()}</Row>
                </Card>
              </Row>
              <Row>
                <Card className={classes.MostRecentGameStats}>
                  <h3>Career Stats</h3>
                  <Row md={3}>{this.generateCareerStats()}</Row>
                </Card>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

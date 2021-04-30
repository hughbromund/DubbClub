import React, { Component } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import Card from "../Card/Card";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import {
  GET_NBA_STANDINGS,
  GAME_INFO_ROUTE,
  GET_GAMES_BY_TEAM_DB,
  NBA,
} from "../../constants/Constants";
import {
  getColorByTeam,
  getIdByTeam,
  NBA_TEAM_INFO,
  getTeamByID,
} from "../../constants/NBAConstants";

export default class Team extends Component {
  constructor(props) {
    super(props);

    // console.log(props);

    this.state = {
      league: props.match.params.league,
      id: Number(props.match.params.id),
      games: [],
      isButtonDisabled: false,
      teamHex: "#000000",
      teamImage: "",
      teamStanding: 0,
      teamName: "",
      gamesBehind: 0,
      lastTenLosses: 0,
      lastTenWins: 0,
      losses: 0,
      wins: 0,
      winStreak: 0,
      conference: "",
      elo: 0,
      loading: true,
    };

    this.fetchStandings = this.fetchStandings.bind(this);
    this.setTeamInfo = this.setTeamInfo.bind(this);
    this.fetchGameDataByTeam = this.fetchGameDataByTeam.bind(this);
  }

  async fetchStandings() {
    var res = await fetch(GET_NBA_STANDINGS, {});
    var body = await res.json();
    // console.log(body.game);

    if (res.status === 200) {
      var tempEast = [];
      var tempWest = [];

      for (let [key, value] of Object.entries(body)) {
        if (value["conference"] === "east") {
          tempEast.push(value);
        } else {
          tempWest.push(value);
        }
      }
      // console.log(tempEast);
      // console.log(tempWest);
      this.setState({
        east: tempEast,
        west: tempWest,
      });
    }
  }
  setTeamInfo(teamID) {
    // console.log("SET TEAM INFO");
    var conference = "";

    for (var i = 0; i < this.state.east.length; i++) {
      if (this.state.east[i].teamId === teamID) {
        this.setState({
          conference: "Eastern Conference",
          teamImage: this.state.east[i].teamImage,
          teamStanding: this.state.east[i].standing,
          gamesBehind: this.state.east[i].gamesBehind,
          lastTenLosses: this.state.east[i].lastTenLosses,
          lastTenWins: this.state.east[i].lastTenWins,
          losses: this.state.east[i].losses,
          wins: this.state.east[i].wins,
          winStreak: this.state.east[i].winStreak,
          teamName: this.state.east[i].teamName,
          teamHex: getColorByTeam(this.state.east[i].teamName),
          elo: this.state.east[i].elo.toFixed(2),
        });
        return;
      }
    }
    for (var i = 0; i < this.state.west.length; i++) {
      if (this.state.west[i].teamId === teamID) {
        this.setState({
          conference: "Western Conference",
          teamImage: this.state.west[i].teamImage,
          teamStanding: this.state.west[i].standing,
          gamesBehind: this.state.west[i].gamesBehind,
          lastTenLosses: this.state.west[i].lastTenLosses,
          lastTenWins: this.state.west[i].lastTenWins,
          losses: this.state.west[i].losses,
          wins: this.state.west[i].wins,
          winStreak: this.state.west[i].winStreak,
          teamName: this.state.west[i].teamName,
          teamHex: getColorByTeam(this.state.west[i].teamName),
          elo: this.state.west[i].elo.toFixed(2),
        });
        return;
      }
    }
  }

  async fetchGameDataByTeam() {
    this.setState({ games: {}, loading: true });

    this.setTeamInfo(this.state.id);

    var res = await fetch(GET_GAMES_BY_TEAM_DB + `/${this.state.id}`, {});
    if (res.status === 200) {
      var body = await res.json();
      this.setState({
        games: body,
        loading: false,
      });
    }
  }

  async componentDidMount() {
    await this.fetchStandings();
    await this.fetchGameDataByTeam();
    // console.log(this.state);
  }

  render() {
    let cards = [];

    if (this.state.games.length > 0) {
      cards.push(
        <Col>
          <Card style={{ boxShadow: "10px 0px " + this.state.teamHex }}>
            <Row xs={1} sm={2}>
              <Col sm={8}>
                <h4>
                  <b>{this.state.teamName}</b> #{this.state.teamStanding}
                </h4>
                <h5>
                  <b>{this.state.conference}</b>
                </h5>
                <h5>
                  <b>Elo:</b> {this.state.elo}
                </h5>
              </Col>
              <Col sm={4}>
                <div style={{ textAlign: "center" }}>
                  <img width="100px" src={this.state.teamImage} />
                </div>
              </Col>
            </Row>
            <hr style={{ background: this.state.teamHex }} />
            <Row>
              <Col>
                <b>Wins:</b> {this.state.wins}
              </Col>
              <Col>
                <b>Losses:</b> {this.state.losses}
              </Col>
              <Col>
                <b>Win Streak:</b> {this.state.winStreak}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Last 10 Wins: </b> {this.state.lastTenWins}
              </Col>
              <Col>
                <b>Last 10 Losses: </b> {this.state.lastTenLosses}
              </Col>
              <Col>
                <b>GB: </b>
                {this.state.gamesBehind}
              </Col>
            </Row>
          </Card>
        </Col>
      );
    }

    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            league={NBA}
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
          {!this.state.loading ? (
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {cards}
            </Row>
          ) : (
            <Col>
              <br />
              <LoadingSpinner />
            </Col>
          )}
        </Container>
      </div>
    );
  }
}

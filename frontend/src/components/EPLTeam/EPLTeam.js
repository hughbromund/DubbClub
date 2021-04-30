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
  EPL_GET_TEAM_STATS,
  EPL_GET_GAMES_BY_TEAM,
  EPL,
} from "../../constants/Constants";
import { getEPLColorByTeam } from "../../constants/EPLConstants";

export default class EPLTeam extends Component {
  constructor(props) {
    super(props);

    // console.log(props);

    this.state = {
      league: props.league,
      id: Number(props.id),
      games: [],
      isButtonDisabled: false,
      teamHex: "#000000",
      teamImage: "",
      teamName: "",
      losses: 0,
      wins: 0,
      draws: 0,
      elo: 0,
      goalsAgainst: 0,
      goalsFor: 0,
      loading: true,
    };

    this.setTeamInfo = this.setTeamInfo.bind(this);
    this.fetchGameDataByTeam = this.fetchGameDataByTeam.bind(this);
  }

  async setTeamInfo() {
    // console.log("SET TEAM INFO");
    var res = await fetch(EPL_GET_TEAM_STATS + `/${this.state.id}`, {});
    if (res.status === 200) {
      var body = await res.json();
      console.log(body.team);
      this.setState({
        teamImage: body.team.teamImage,
        teamStanding: body.team.position,
        gamesBehind: body.team.gamesBehind,
        losses: body.team.losses,
        wins: body.team.wins,
        draws: body.team.draws,
        goalsFor: body.team.goalsFor,
        goalsAgainst: body.team.goalsAgainst,
        winStreak: body.team.winStreak,
        teamName: body.team.teamName,
        teamHex: getEPLColorByTeam(body.team.teamName),
        elo: body.team.elo.toFixed(2),
      });
    }
  }

  async fetchGameDataByTeam() {
    this.setState({ games: {}, loading: false });

    this.setTeamInfo();

    var res = await fetch(EPL_GET_GAMES_BY_TEAM + `/${this.state.id}`, {});
    if (res.status === 200) {
      var body = await res.json();
      this.setState({
        games: body.gameIds,
        loading: false,
      });
    }
  }

  async componentDidMount() {
    await this.fetchGameDataByTeam();
  }

  render() {
    let cards = [];

    // if (this.state.games.length > 0) {
    cards.push(
      <Col>
        <Card style={{ boxShadow: "10px 0px " + this.state.teamHex }}>
          <Row xs={1} sm={2}>
            <Col sm={8}>
              <h4>
                <b>{this.state.teamName}</b>
              </h4>
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
              <b>Draws:</b> {this.state.draws}
            </Col>
            <Col>
              <b>Losses:</b> {this.state.losses}
            </Col>
          </Row>
          <Row>
            <Col>
              <b>GP: </b>{" "}
              {this.state.wins + this.state.draws + this.state.losses}
            </Col>
            <Col>
              <b>GF: </b> {this.state.goalsFor}
            </Col>
            <Col>
              <b>GA: </b> {this.state.goalsAgainst}
            </Col>
            <Col>
              <b>GD: </b> {this.state.goalsFor - this.state.goalsAgainst}
            </Col>
          </Row>
        </Card>
      </Col>
    );
    // }

    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            league={EPL}
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

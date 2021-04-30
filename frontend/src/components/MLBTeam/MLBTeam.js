import React, { Component } from "react";
import {
  MLB_GET_TEAM_STATS,
  MLB_GET_GAMES_BY_TEAM,
  MLB,
} from "../../constants/Constants";
import Card from "../Card/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import { getMLBColorByTeam } from "../../constants/MLBConstants";

export default class MLBTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: "",
      teamImage: "",
      teamId: props.id,
      streak: "",
      losses: 0,
      league: "",
      gamesBehind: 0,
      elo: 0,
      division: "",
      loading: true,
      teamHex: "#000000",
      games: [],
    };

    this.getTeamStats = this.getTeamStats.bind(this);
    this.getTeamGames = this.getTeamGames.bind(this);
  }

  async getTeamStats(teamId) {
    var res = await fetch(MLB_GET_TEAM_STATS + "/" + teamId);

    if (res.status !== 200) {
      return;
    }

    var body = await res.json();

    // console.log(body);
    this.setState(body);
    this.setState({ teamHex: getMLBColorByTeam(body.teamName) });
  }

  async getTeamGames(teamId) {
    var res = await fetch(MLB_GET_GAMES_BY_TEAM + "/" + teamId);

    if (res.status !== 200) {
      return;
    }

    var body = await res.json();

    console.log(body);
    // this.setState(body);
    this.setState({ games: body });
  }

  async componentDidMount() {
    // console.log(this.props);

    await Promise.all([
      this.getTeamStats(this.props.id),
      this.getTeamGames(this.props.id),
    ]);

    this.setState({ loading: false });
  }

  render() {
    // console.log(this.state);

    var cards = [];

    cards.push(
      <Col key={"teamCard"}>
        <Card style={{ boxShadow: "10px 0px " + this.state.teamHex }}>
          <Row xs={1} sm={2}>
            <Col sm={8}>
              <h4>
                <b>{this.state.teamName}</b>
              </h4>
              <h5>
                <b>{this.state.league}</b> | {this.state.division}
              </h5>
              <h5>
                <b>Elo:</b> {this.state.elo.toFixed(2)}
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
              <b>Streak:</b> {this.state.streak}
            </Col>
          </Row>
          <Row>
            <Col>
              <b>Games Behind: </b>
              {this.state.gamesBehind}
            </Col>
          </Row>
        </Card>
      </Col>
    );

    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col key={this.state.games[i]}>
          <GameInfoCard
            league={MLB}
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

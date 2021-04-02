import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import classes from "./Voting.module.css";
import {
  GET_HIGH_VOTE_GAMES,
  GET_VOTE_DIFF_GAMES,
  GAME_INFO_ROUTE,
} from "../../constants/Constants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const MOST_VOTED_GAMES = "Most Voted Games";
const VOTE_DIFF_GAMES = "Highest Prediction Difference";

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: "",
      mostVotedGames: {},
      voteDiffGames: {},
    };

    this.getMostVotedGames = this.getMostVotedGames.bind(this);
    this.getVoteDiffGames = this.getVoteDiffGames.bind(this);
    this.renderCards = this.renderCards.bind(this);
  }

  renderCards(voteDiffGamesCards, mostVotedGamesCards) {
    if (this.state.searchType === VOTE_DIFF_GAMES) {
      return voteDiffGamesCards;
    }
    return mostVotedGamesCards;
  }

  async getMostVotedGames() {
    var res = await fetch(GET_HIGH_VOTE_GAMES, {});
    var body = await res.json();
    this.setState({
      mostVotedGames: body,
    });
    console.log(this.state.mostVotedGames);
  }
  async getVoteDiffGames() {
    var res = await fetch(GET_VOTE_DIFF_GAMES, {});
    var body = await res.json();
    this.setState({
      voteDiffGames: body,
    });
    console.log(this.state.voteDiffGames);
  }

  async componentDidMount() {
    await this.getMostVotedGames();
    await this.getVoteDiffGames();
  }

  render() {
    if (this.state.voteDiffGames.games === undefined) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }
    let voteDiffGamesCards = [];
    console.log(this.state.voteDiffGames.games);
    for (let i = 0; i < this.state.voteDiffGames.games.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.voteDiffGames.games[i].id}`
              );
            }}
            gameID={this.state.voteDiffGames.games[i].id}
            history={this.props.history}
            key={i}
          />
        </Col>
      );
      voteDiffGamesCards.push(temp);
    }
    let mostVotedGamesCards = [];
    for (let i = 0; i < this.state.mostVotedGames.games.length; i++) {
      let temp = (
        <Col key={"col-" + i}>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.mostVotedGames.games[i].id}`
              );
            }}
            gameID={this.state.mostVotedGames.games[i].id}
            history={this.props.history}
            key={i}
          />
        </Col>
      );
      mostVotedGamesCards.push(temp);
    }
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div>
                <h1>Voting</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <select
                  value={this.state.searchType}
                  onChange={(e) => {
                    this.setState({ searchType: e.target.value });
                    console.log(this.state.searchType);
                  }}
                >
                  <option>{MOST_VOTED_GAMES}</option>
                  <option>{VOTE_DIFF_GAMES}</option>
                </select>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {this.renderCards(voteDiffGamesCards, mostVotedGamesCards)}
          </Row>
        </Container>
      </div>
    );
  }
}

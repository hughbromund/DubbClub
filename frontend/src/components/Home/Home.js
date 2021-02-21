import React, { Component } from "react";
import Card from "../Card/Card";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";
import Container from "react-bootstrap/Container";
import CardDeck from "react-bootstrap/CardDeck";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import { useHistory } from "react-router-dom";
import {
  NEXT_SEVEN_DAYS_BASIC_GAME_INFO,
  GAME_INFO_ROUTE,
} from "../../constants/Constants";
import classes from "./Home.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: {},
    };

    this.fetchGameData = this.fetchGameData.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(NEXT_SEVEN_DAYS_BASIC_GAME_INFO, {});
    var body = await res.json();
    this.setState({ games: body });
    console.log(this.state.games);
  }

  async componentDidMount() {
    this.fetchGameData();
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
    console.log(this.state.games);
    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <GameInfoCard
          homeTeam={this.state.games[i].home.teamName}
          awayTeam={this.state.games[i].away.teamName}
          gameTime={new Date(this.state.games[i].date).toLocaleDateString(
            "en-US",
            DATE_OPTIONS
          )}
          predictedWinner={"away"}
          predictionConfidence={100.0}
          awayLogo={this.state.games[i].away.teamImage}
          homeLogo={this.state.games[i].home.teamImage}
          onClickHandler={() => {
            this.props.history.push(
              GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
            );
          }}
          key={i}
        />
      );
      cards.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>Homepage</h1>
          <br />
          <CardDeck>{cards}</CardDeck>
        </Container>
      </div>
    );
  }
}

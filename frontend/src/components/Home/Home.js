import React, { Component } from "react";
import Card from "../Card/Card";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";
import { Container, CardDeck } from "react-bootstrap";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import BullsLogo from "../../assets/BullsLogoTest.png";
import KnicksLogo from "../../assets/KnicksLogoTest.png";

export default class Home extends Component {
  render() {
    let cards = [];
    for (let i = 0; i < 2; i++) {
      let temp = (
        <GameInfoCard
          homeTeam={"NY Knicks"}
          awayTeam={"Chicago Bulls"}
          gameTime={"Monday, January 1st @ 9:00 EST"}
          predictedWinner={"away"}
          predictionConfidence={100.0}
          awayLogo={BullsLogo}
          homeLogo={KnicksLogo}
          onClickHandler={() => alert("Clicked!")}
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

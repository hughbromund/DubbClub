import React, { Component } from "react";
import Card from "../Card/Card";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./ExpandedGameInfo.module.css";
import BullsLogo from "../../assets/BullsLogoTest.png";
import KnicksLogo from "../../assets/KnicksLogoTest.png";
import GameInfoCard from "../GameInfoCard/GameInfoCard";

export default class ExpandedGameInfo extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <div className={classes.center}>
                <GameInfoCard
                  homeTeam={"NY Knicks"}
                  awayTeam={"Chicago Bulls"}
                  gameTime={"Monday, January 1st @ 9:00 EST"}
                  predictedWinner={"away"}
                  predictionConfidence={100.0}
                  awayLogo={BullsLogo}
                  homeLogo={KnicksLogo}
                  onClickHandler={null}
                  className={classes.mainCard}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <Card>
                  <h1>Line Graph or Pie Graph Will Go Here</h1>
                </Card>
              </div>
            </Col>
            <Col>
              <div className={classes.center}>
                <Card>
                  <h1>Player Stats Will Go Here...</h1>
                </Card>
              </div>
            </Col>
            <Col>
              <div className={classes.center}>
                <Card>
                  <h1>Team Standings Will Go Here</h1>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

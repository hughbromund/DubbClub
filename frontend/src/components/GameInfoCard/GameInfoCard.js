import React, { Component } from "react";
import Card from "../Card/Card";
import { Container, Row, Col, Image } from "react-bootstrap";
import Button from "../Button/Button";
import classes from "./GameInfoCard.module.css";

export default class GameInfoCard extends Component {
  render() {
    return (
      <div>
        <Card>
          <Container>
            <Row>
              <Col>
                <div class={classes.centered}>
                  <img src={this.props.awayLogo} class={classes.logo} />
                  <h1>{this.props.awayTeam}</h1>
                </div>
              </Col>
              <Col xs={1}>
                <br />
                <br />
                <br />
                <h1>@</h1>
              </Col>
              <Col>
                <div class={classes.centered}>
                  <img src={this.props.homeLogo} class={classes.logo} />
                  <h1>{this.props.homeTeam}</h1>
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              <h6>Game Time: {this.props.gameTime}</h6>
              <h2>
                Predicted Winner:{" "}
                <b>
                  {this.props.predictedWinner === "away"
                    ? this.props.awayTeam
                    : this.props.homeTeam}
                </b>
              </h2>
              <h3>
                Prediction Confidence: <b>{this.props.predictionConfidence}%</b>
              </h3>
            </Row>
            <hr />
            <Button onClick={this.props.onClickHandler}>See More</Button>
          </Container>
        </Card>
      </div>
    );
  }
}

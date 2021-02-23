import React, { Component } from "react";
import Card from "../Card/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "../Button/Button";
import classes from "./GameInfoCard.module.css";

export default class GameInfoCard extends Component {
  renderButtonConditionally() {
    return this.props.onClickHandler === null ? null : (
      <Button onClick={this.props.onClickHandler}>See More</Button>
    );
  }
  render() {
    return (
      <div>
        <Card>
          <Container>
            <Row xs={1} sm={2} md={2} lg={2} xl={2}>
              <Col>
                <div
                  className={[
                    classes.centered,
                    classes.verticalCenterImage,
                  ].join(" ")}
                >
                  <img src={this.props.awayLogo} class={classes.logo} />
                </div>
                <div className={classes.centered}>
                  <h2>{this.props.awayTeam}</h2>
                </div>
              </Col>
              <Col>
                <div
                  className={[
                    classes.centered,
                    classes.verticalCenterImage,
                  ].join(" ")}
                >
                  <img src={this.props.homeLogo} class={classes.logo} />
                </div>
                <div className={classes.centered}>
                  <h2>{this.props.homeTeam}</h2>
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              <div className={classes.centered}>
                <h6>Game Time: {this.props.gameTime}</h6>
                <h3>
                  Predicted Winner:{" "}
                  <b>
                    {this.props.predictedWinner === "away"
                      ? this.props.awayTeam
                      : this.props.homeTeam}
                  </b>
                </h3>
                <h4>
                  Prediction Confidence:{" "}
                  <b>{this.props.predictionConfidence}%</b>
                </h4>
              </div>
            </Row>
            <hr />
            {this.renderButtonConditionally()}
          </Container>
        </Card>
      </div>
    );
  }
}

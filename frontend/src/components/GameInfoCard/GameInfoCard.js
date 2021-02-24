import React, { Component } from "react";
import Card from "../Card/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "../Button/Button";
import classes from "./GameInfoCard.module.css";
import Expand from "react-expand-animated";
import ReactSpeedometer from "react-d3-speedometer";

export default class GameInfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandInfo: false,
    };
  }
  renderButtonConditionally() {
    return this.props.onClickHandler === null ? null : (
      <Button onClick={this.props.onClickHandler}>See More</Button>
    );
  }
  render() {
    var confidenceString = "";
    if (
      this.props.predictionConfidence <= 100 &&
      this.props.predictionConfidence >= 75
    ) {
      confidenceString = "Extremely Likely";
    }
    if (
      this.props.predictionConfidence < 75 &&
      this.props.predictionConfidence >= 50
    ) {
      confidenceString = "Very Likely";
    }
    if (
      this.props.predictionConfidence < 50 &&
      this.props.predictionConfidence > 25
    ) {
      confidenceString = "Likely";
    }
    if (this.props.predictionConfidence <= 25) {
      confidenceString = "Leaning";
    }

    return (
      <div>
        <div className={classes.wrapper}>
          <Card className={classes.outer}>
            <Container>
              <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                <Col>
                  <div className={classes.background}>
                    <div
                      className={[
                        classes.centered,
                        classes.verticalCenterImage,
                      ].join(" ")}
                    >
                      <img src={this.props.awayLogo} class={classes.logo} />
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className={classes.background}>
                    <div
                      className={[
                        classes.centered,
                        classes.verticalCenterImage,
                      ].join(" ")}
                    >
                      <img src={this.props.homeLogo} class={classes.logo} />
                    </div>
                  </div>
                </Col>
              </Row>
              <br />
              <Row noGutters>
                <Col>
                  <div className={classes.teamNames}>
                    <b>{this.props.awayTeam}</b>
                  </div>
                </Col>
                <Col sm={1}>
                  <div className={classes.teamNames}>
                    <b>@</b>
                  </div>
                </Col>
                <Col>
                  <div className={classes.teamNames}>
                    <b>{this.props.homeTeam}</b>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <div className={classes.speedometer}>
                  <ReactSpeedometer
                    value={this.props.predictionConfidence}
                    minValue={0}
                    maxValue={100}
                    segments={100}
                    maxSegmentLabels={4}
                    needleColor={"white"}
                    ringWidth={10}
                    startColor={"#0050dd"}
                    endColor={"#1d6efc"}
                    currentValueText={"${value}% Confidence"}
                  />
                </div>
                <div>
                  <h5>
                    {confidenceString}{" "}
                    <b>
                      {this.props.predictedWinner === "away"
                        ? this.props.awayTeam
                        : this.props.homeTeam}
                    </b>
                  </h5>
                </div>
              </Row>

              {/* {this.renderButtonConditionally()} */}
            </Container>
          </Card>
          <div
            className={classes.gameTime}
            onMouseEnter={() => {
              this.setState({ expandInfo: true });
            }}
            onMouseLeave={() => {
              this.setState({ expandInfo: false });
            }}
          >
            <b>{this.props.gameTime}</b>
            <Expand open={this.state.expandInfo}>
              <div>Some more content can go here</div>
            </Expand>
          </div>
        </div>
      </div>
    );
  }
}

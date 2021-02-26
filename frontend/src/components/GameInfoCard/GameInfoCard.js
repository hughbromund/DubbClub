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
const rgbHex = require("rgb-hex");
const hexRgb = require("hex-rgb");

/**
 * This maps the value of a number from one range to a new one.
 *
 * Used to map confidence values from range 50-100 to range 0-100 for graphing
 * */
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
export default class GameInfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandInfo: false,
    };

    this.hexAlphaConverter = this.hexAlphaConverter.bind(this);
    this.hexMedianValue = this.hexMedianValue.bind(this);
  }
  renderButtonConditionally() {
    return this.props.onClickHandler === null ? null : (
      <Button onClick={this.props.onClickHandler}>See More</Button>
    );
  }

  hexAlphaConverter(hexValue, alphaValue) {
    var rgbValue = hexRgb(hexValue);
    rgbValue.alpha = alphaValue;

    return (
      "#" + rgbHex(rgbValue.red, rgbValue.green, rgbValue.blue, rgbValue.alpha)
    );
  }

  hexMedianValue(hex1, hex2) {
    var rgb1 = hexRgb(hex1);
    var rgb2 = hexRgb(hex2);

    return (
      "#" +
      rgbHex(
        (rgb1.red + rgb2.red) / 2,
        (rgb1.green + rgb2.green) / 2,
        (rgb1.blue + rgb2.blue) / 2
      )
    );
  }

  render() {
    var homeHex = "#E13A3E";
    var awayHex = "#008248";

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
                    value={
                      this.props.predictedWinner === "away"
                        ? this.props.predictionConfidence.map(50, 100, 0, 100) *
                          -1
                        : this.props.predictionConfidence.map(50, 100, 0, 100)
                    }
                    minValue={-100}
                    maxValue={100}
                    segments={7}
                    needleColor={"white"}
                    ringWidth={10}
                    currentValueText={
                      Math.abs(this.props.predictionConfidence) + "% Confidence"
                    }
                    segmentColors={[
                      this.hexAlphaConverter(awayHex, 1),
                      this.hexAlphaConverter(awayHex, 0.6),
                      this.hexAlphaConverter(awayHex, 0.4),
                      this.hexAlphaConverter(
                        this.hexMedianValue(homeHex, awayHex),
                        0.2
                      ),
                      this.hexAlphaConverter(homeHex, 0.4),
                      this.hexAlphaConverter(homeHex, 0.6),
                      this.hexAlphaConverter(homeHex, 1),
                    ]}
                    customSegmentLabels={[
                      {
                        text: "100%",
                        position: "OUTSIDE",
                      },
                      {
                        text: "",
                        position: "OUTSIDE",
                      },
                      {
                        text: "",
                        position: "OUTSIDE",
                      },
                      {
                        text: "50%",
                        position: "OUTSIDE",
                      },
                      {
                        text: "",
                        position: "OUTSIDE",
                      },
                      {
                        text: "",
                        position: "OUTSIDE",
                      },
                      {
                        text: "100%",
                        position: "OUTSIDE",
                      },
                    ]}
                  />
                </div>
                <div>
                  <h5>
                    {this.props.predictionConfidence > 60 ? (
                      <div>
                        <b>{this.props.predictionConfidence}%</b> confidence
                        that the{" "}
                        <b>
                          {this.props.predictedWinner === "away"
                            ? this.props.awayTeam
                            : this.props.homeTeam}
                        </b>{" "}
                        win
                      </div>
                    ) : (
                      <div>
                        <b>Toss Up</b> Game
                      </div>
                    )}
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
              <b>
                <div>Venue: {this.props.venue}</div>
              </b>
            </Expand>
          </div>
        </div>
      </div>
    );
  }
}

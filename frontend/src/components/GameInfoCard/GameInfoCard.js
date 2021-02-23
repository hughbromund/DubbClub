import React, { Component } from "react";
import Card from "../Card/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "../Button/Button";
import classes from "./GameInfoCard.module.css";
import Expand from "react-expand-animated";

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
                  <br />
                  <div className={classes.centered}>
                    <h3>
                      <b>{this.props.awayTeam}</b>
                    </h3>
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
                  <br />
                  <div className={classes.centered}>
                    <h3>
                      <b>{this.props.homeTeam}</b>
                    </h3>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <div>
                  <h5>
                    Predicted Winner:{" "}
                    <b>
                      {this.props.predictedWinner === "away"
                        ? this.props.awayTeam
                        : this.props.homeTeam}
                    </b>
                  </h5>
                  <h5>
                    Prediction Confidence:{" "}
                    <b>{this.props.predictionConfidence}%</b>
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

import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {
  GET_GAME_BY_ID,
  GET_GAME_BY_ID_FROM_DB,
} from "../../constants/Constants";
import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Speedometer from "../Speedometer/Speedometer";
import classes from "./ExpandedGameInfo.module.css";

export default class ExpandedGameInfo extends Component {
  constructor(props) {
    super(props);

    this.fetchGameData = this.fetchGameData.bind(this);
    this.state = {
      game: {},
      gameID: this.props.location.pathname.substring(
        this.props.location.pathname.lastIndexOf("/") + 1
      ),
      predictions: {},
    };
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.getPredictedWinner = this.getPredictedWinner.bind(this);
    this.getPredictionConfidence = this.getPredictionConfidence.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(GET_GAME_BY_ID + `/${this.state.gameID}`, {});
    var body = await res.json();
    this.setState({
      game: body,
    });
    await this.fetchPrediction(this.state.gameId);
  }

  async fetchPrediction(gameID) {
    var res = await fetch(GET_GAME_BY_ID_FROM_DB + `/${gameID}`, {});
    var body = await res.json();
    var temp = this.state.predictions;
    if (body.game !== undefined) {
      temp[gameID] = {
        predictedWinner: getTeamByID(body.game.predictedWinner),
        confidence: body.game.confidence,
      };
      this.setState({ predictions: temp });
    }
  }

  getPredictionConfidence(gameId) {
    if (this.state.predictions[gameId] === undefined) {
      return 50;
    }
    return Math.floor(this.state.predictions[gameId].confidence * 100);
  }

  getPredictedWinner(gameId) {
    if (this.state.predictions[gameId] === undefined) {
      return "";
    }
    return this.state.predictions[gameId].predictedWinner;
  }

  async componentDidMount() {
    this.fetchGameData();
  }

  render() {
    if (this.state.game.away === undefined) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <div style={{ textAlign: "right" }}>
                      {getTeamByID(Number(this.state.game["away"]["teamId"]))}
                      {" : "}
                      {this.state.game.away.points}
                    </div>
                  </Col>
                  <Col>
                    <Table
                      bordered
                      size="sm"
                      className={[classes.card].join(" ")}
                    >
                      <thead>
                        <tr>
                          <th></th>
                          <th>Q1</th>
                          <th>Q2</th>
                          <th>Q3</th>
                          <th>Q4</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {getTeamByID(
                              Number(this.state.game["away"]["teamId"])
                            )}
                          </td>
                          <td>{this.state.game.away.lineScore[0]}</td>
                          <td>{this.state.game.away.lineScore[1]}</td>
                          <td>{this.state.game.away.lineScore[2]}</td>
                          <td>{this.state.game.away.lineScore[3]}</td>
                          <td>{this.state.game.away.points}</td>
                        </tr>
                        <tr>
                          <td>
                            {getTeamByID(
                              Number(this.state.game["home"]["teamId"])
                            )}
                          </td>
                          <td>{this.state.game.home.lineScore[0]}</td>
                          <td>{this.state.game.home.lineScore[1]}</td>
                          <td>{this.state.game.home.lineScore[2]}</td>
                          <td>{this.state.game.home.lineScore[3]}</td>
                          <td>{this.state.game.home.points}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col>
                    {this.state.game.home.points}
                    {" : "}
                    {getTeamByID(Number(this.state.game["home"]["teamId"]))}
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <div
                className={[classes.speedometer, classes.bottomCard].join(" ")}
              >
                <Speedometer
                  predictedWinner={this.getPredictedWinner(
                    this.state.game.gameId
                  )}
                  predictionConfidence={this.getPredictionConfidence(
                    this.state.game.gameId
                  )}
                  awayHex={getColorByTeam(
                    getTeamByID(Number(this.state.game["away"]["teamId"]))
                  )}
                  homeHex={getColorByTeam(
                    getTeamByID(Number(this.state.game["home"]["teamId"]))
                  )}
                  fluidWidth={true}
                />
              </div>
              <div>
                <h5>
                  {this.getPredictionConfidence(this.state.gameId) > 51 ? (
                    <div>
                      <b>{this.getPredictionConfidence(this.state.gameId)}%</b>{" "}
                      confidence that the{" "}
                      <b>{this.getPredictedWinner(this.state.gameId)}</b> win
                    </div>
                  ) : this.getPredictedWinner(this.state.gameId) === "" ? (
                    <div>
                      <b>No Prediction Available</b>
                    </div>
                  ) : (
                    <div>
                      <b>Toss Up Game</b>
                    </div>
                  )}
                </h5>
              </div>
            </Col>
            <Col>
              <h2>{getTeamByID(Number(this.state.game["home"]["teamId"]))}</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Points</th>
                    <th>Assists</th>
                    <th>Rebounds</th>
                    <th>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </Table>
              <h2>{getTeamByID(Number(this.state.game["away"]["teamId"]))}</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Points</th>
                    <th>Assists</th>
                    <th>Rebounds</th>
                    <th>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

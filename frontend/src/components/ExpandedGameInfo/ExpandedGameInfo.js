import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {
  GET_GAME_BY_ID,
  GET_GAME_BY_ID_FROM_DB,
  NBA_VOTE,
} from "../../constants/Constants";
import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Speedometer from "../Speedometer/Speedometer";
import classes from "./ExpandedGameInfo.module.css";
import AuthContext from "../../contexts/AuthContext.js";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";

const USER_PREDICT = "user";
const ML_PREDICT = "ml";

export default class ExpandedGameInfo extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    this.fetchGameData = this.fetchGameData.bind(this);
    this.state = {
      game: {},
      gameID: this.props.location.pathname.substring(
        this.props.location.pathname.lastIndexOf("/") + 1
      ),
      predictions: {},
      votedTeam: "none",
      homeVotes: 0,
      awayVotes: 0,
      predictionType: ML_PREDICT,
    };
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.getPredictedWinner = this.getPredictedWinner.bind(this);
    this.getPredictionConfidence = this.getPredictionConfidence.bind(this);
    this.voteForTeam = this.voteForTeam.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(GET_GAME_BY_ID + `/${this.state.gameID}`, {});
    var body = await res.json();
    this.setState({
      game: body,
    });
    await this.fetchPrediction(this.state.gameID);
  }

  async fetchPrediction(gameID) {
    var res = await fetch(GET_GAME_BY_ID_FROM_DB + `/${gameID}`, {
      headers: {
        "x-access-token": this.context.token,
      },
    });
    var body = await res.json();
    // console.log(body);
    var temp = this.state.predictions;

    if (body.game !== undefined) {
      temp[gameID] = {
        predictedWinner: getTeamByID(body.game.predictedWinner),
        confidence: body.game.confidence,
      };
      this.setState({
        predictions: temp,

        votedTeam: body.votedTeam,
        homeVotes: body.game.homeVoters.length,
        awayVotes: body.game.awayVoters.length,
      });
    }
  }

  getPredictionConfidence(gameID) {
    if (this.state.predictions[gameID] === undefined) {
      return 50;
    }
    return Math.floor(this.state.predictions[gameID].confidence * 100);
  }

  getPredictedWinner(gameID) {
    if (this.state.predictions[gameID] === undefined) {
      return "";
    }
    return this.state.predictions[gameID].predictedWinner;
  }

  async voteForTeam(homeAway) {
    var res = await fetch(NBA_VOTE, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        gameId: this.state.gameID,
        homeAway: homeAway,
      }),
    });

    if (res.status !== 200) {
      return false;
    } else {
      await this.fetchPrediction(this.state.gameID);
      return true;
    }
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
    var awayStats = [];
    for (var i = 0; i < this.state.game.away.leaders.length; i++) {
      var temp = (
        <tr>
          <td>{this.state.game.away.leaders[i].name}</td>
          {this.state.game.away.leaders[i].points !== undefined ? (
            <td>{this.state.game.away.leaders[i].points} points</td>
          ) : (
            ""
          )}
          {this.state.game.away.leaders[i].assists !== undefined ? (
            <td>{this.state.game.away.leaders[i].assists} assists</td>
          ) : (
            ""
          )}
          {this.state.game.away.leaders[i].rebounds !== undefined ? (
            <td>{this.state.game.away.leaders[i].rebounds} rebounds</td>
          ) : (
            ""
          )}
        </tr>
      );
      awayStats.push(temp);
    }
    var homeStats = [];
    for (var i = 0; i < this.state.game.home.leaders.length; i++) {
      var temp = (
        <tr>
          <td>{this.state.game.home.leaders[i].name}</td>
          {this.state.game.home.leaders[i].points !== undefined ? (
            <td>{this.state.game.home.leaders[i].points} points</td>
          ) : (
            ""
          )}
          {this.state.game.home.leaders[i].assists !== undefined ? (
            <td>{this.state.game.home.leaders[i].assists} assists</td>
          ) : (
            ""
          )}
          {this.state.game.home.leaders[i].rebounds !== undefined ? (
            <td>{this.state.game.home.leaders[i].rebounds} rebounds</td>
          ) : (
            ""
          )}
        </tr>
      );
      homeStats.push(temp);
    }
    // console.log(this.state);
    var homeAwayWinner = "home";

    if (
      this.state.predictedWinner === getTeamByID(this.state.game.away.teamId)
    ) {
      homeAwayWinner = "away";
    }
    // console.log(homeAwayWinner);

    var userConfidence =
      (100 * this.state.homeVotes) /
      (this.state.awayVotes + this.state.homeVotes);

    var userWinner = "home";
    if (this.state.awayVotes > this.state.homeVotes) {
      userConfidence =
        (100 * this.state.awayVotes) /
        (this.state.awayVotes + this.state.homeVotes);
      userWinner = "away";
    }

    if (userConfidence === 0 || isNaN(userConfidence)) {
      userConfidence = 50;
    }

    // console.log({ userConfidence });

    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <Container fluid>
                <Row>
                  <Col
                    xs={{ span: 6, order: "first" }}
                    lg={{ span: 2, order: "first" }}
                  >
                    <div className={classes.background}>
                      <div
                        className={[
                          classes.centered,
                          classes.verticalCenterImage,
                        ].join(" ")}
                      >
                        <img
                          src={this.state.game.away.logo}
                          className={classes.logo}
                        />
                      </div>
                      {this.context.isLoggedIn ? (
                        <SmartButton
                          variant={
                            this.state.votedTeam === "away" ? "success" : ""
                          }
                          disabled={
                            this.state.votedTeam === "away" ? true : false
                          }
                          runOnClick={() => {
                            return this.voteForTeam("away");
                          }}
                        >
                          {this.state.votedTeam === "away" ? "Voted" : "Vote"}
                        </SmartButton>
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
                  <Col xs={6} lg={2}>
                    <br />
                    <div className={classes.center}>
                      <h4>
                        {getTeamByID(Number(this.state.game["away"]["teamId"]))}
                      </h4>
                    </div>
                    <div className={classes.center}>
                      <h1>
                        <b>{this.state.game.away.points}</b>
                      </h1>
                    </div>
                  </Col>
                  <Col xs={12} lg={4}>
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
                  <Col xs={6} lg={2}>
                    <br />
                    <div className={classes.centered}>
                      <h4>
                        {getTeamByID(Number(this.state.game["home"]["teamId"]))}
                      </h4>
                    </div>
                    <div className={classes.centered}>
                      <h1>
                        <b>{this.state.game.home.points}</b>
                      </h1>
                    </div>
                  </Col>
                  <Col xs={6} lg={2}>
                    <div className={classes.background}>
                      <div
                        className={[
                          classes.centered,
                          classes.verticalCenterImage,
                        ].join(" ")}
                      >
                        <img
                          src={this.state.game.home.logo}
                          className={classes.logo}
                        />
                      </div>
                      {this.context.isLoggedIn ? (
                        <SmartButton
                          variant={
                            this.state.votedTeam === "home" ? "success" : ""
                          }
                          disabled={
                            this.state.votedTeam === "home" ? true : false
                          }
                          runOnClick={() => {
                            return this.voteForTeam("home");
                          }}
                        >
                          {this.state.votedTeam === "home" ? "Voted" : "Vote"}
                        </SmartButton>
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <div
                className={[classes.centered, classes.speedometer].join(" ")}
              >
                <Row>
                  <Col>
                    <Button
                      variant={
                        this.state.predictionType === ML_PREDICT
                          ? ""
                          : "outline"
                      }
                      onClick={() => {
                        this.setState({ predictionType: ML_PREDICT });
                      }}
                    >
                      Dubb Club Prediction
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant={
                        this.state.predictionType === USER_PREDICT
                          ? ""
                          : "outline"
                      }
                      onClick={() => {
                        this.setState({ predictionType: USER_PREDICT });
                      }}
                    >
                      User Prediction
                    </Button>
                  </Col>
                </Row>

                <br />
                {this.state.predictionType === ML_PREDICT ? (
                  <Speedometer
                    predictedWinner={homeAwayWinner}
                    predictionConfidence={this.getPredictionConfidence(
                      this.state.gameID
                    )}
                    awayHex={getColorByTeam(
                      getTeamByID(Number(this.state.game["away"]["teamId"]))
                    )}
                    homeHex={getColorByTeam(
                      getTeamByID(Number(this.state.game["home"]["teamId"]))
                    )}
                  />
                ) : (
                  <Speedometer
                    predictedWinner={userWinner}
                    predictionConfidence={userConfidence}
                    awayHex={getColorByTeam(
                      getTeamByID(Number(this.state.game["away"]["teamId"]))
                    )}
                    homeHex={getColorByTeam(
                      getTeamByID(Number(this.state.game["home"]["teamId"]))
                    )}
                  />
                )}
              </div>
              <div>
                <h5>
                  {this.state.predictionType === ML_PREDICT ? (
                    this.getPredictionConfidence(this.state.gameID) > 51 ? (
                      <div>
                        Dubb Club is{" "}
                        <b>
                          {this.getPredictionConfidence(this.state.gameID)}%
                        </b>{" "}
                        confident that the{" "}
                        <b>{this.getPredictedWinner(this.state.gameID)}</b> win
                      </div>
                    ) : this.getPredictedWinner(this.state.gameID) === "" ? (
                      <div>
                        <b>No Prediction Available</b>
                      </div>
                    ) : (
                      <div>
                        <b>Toss Up Game</b>
                      </div>
                    )
                  ) : (
                    this.state.awayVotes +
                    " user(s) think that " +
                    getTeamByID(Number(this.state.game["away"]["teamId"])) +
                    " will win and " +
                    this.state.homeVotes +
                    " user(s) think that " +
                    getTeamByID(Number(this.state.game["home"]["teamId"])) +
                    " will win."
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
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>{homeStats}</tbody>
              </Table>
              <h2>{getTeamByID(Number(this.state.game["away"]["teamId"]))}</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>{awayStats}</tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
ExpandedGameInfo.contextType = AuthContext;

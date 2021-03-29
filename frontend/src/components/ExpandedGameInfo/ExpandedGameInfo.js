import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {
  GET_GAME_BY_ID,
  GET_GAME_BY_ID_FROM_DB,
  NBA_VOTE,
  DATE_OPTIONS,
} from "../../constants/Constants";
import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Speedometer from "../Speedometer/Speedometer";
import classes from "./ExpandedGameInfo.module.css";
import AuthContext from "../../contexts/AuthContext.js";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";
import PredictionGraph from "../PredictionGraph/PredictionGraph";

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
      homeHex: "#000000",
      awayHex: "#ffffff",
      predictionConfidence: 50,
      predictionType: ML_PREDICT,
      loading: true,
    };
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.voteForTeam = this.voteForTeam.bind(this);
    this.createPlayerStatRow = this.createPlayerStatRow.bind(this);
    this.getUserConfidence = this.getUserConfidence.bind(this);
    this.getUserWinner = this.getUserWinner.bind(this);
    this.getHomeAwayWinner = this.getHomeAwayWinner.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(GET_GAME_BY_ID + `/${this.state.gameID}`, {});
    var body = await res.json();
    console.log(body);
    this.setState({
      homeLineScore: body.home.lineScore,
      homeLeaders: body.home.leaders,
      homeScore: body.home.points,
      awayLineScore: body.away.lineScore,
      awayLeaders: body.away.leaders,
      awayScore: body.away.points,
    });
  }

  async fetchPrediction() {
    var res = await fetch(GET_GAME_BY_ID_FROM_DB + `/${this.state.gameID}`, {
      headers: {
        "x-access-token": this.context.token,
      },
    });
    var body = await res.json();
    console.log(body);
    var game = body.game;
    console.log({ game });

    if (body.game !== undefined) {
      var predictedWinner = game.home[0].teamName;
      if (game.away[0].teamId === game.predictedWinner) {
        predictedWinner = game.away[0].teamName;
      }

      var date = new Date(game.date).toLocaleDateString("en-US", DATE_OPTIONS);

      var time = new Date(game.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log(getColorByTeam(game.home[0].teamName));

      this.setState({
        predictedWinner: predictedWinner,
        predictionConfidence: Number((game.confidence * 100).toFixed(2)),
        homeTeam: game.home[0].teamName,
        awayTeam: game.away[0].teamName,
        homeHex: getColorByTeam(game.home[0].teamName),
        awayHex: getColorByTeam(game.away[0].teamName),
        awayLogo: game.away[0].teamImage,
        homeLogo: game.home[0].teamImage,
        date: date,
        time: time,

        homeId: game.home[0].teamId,
        awayId: game.away[0].teamId,
        votedTeam: body.votedTeam,
        homeVotes: body.game.homeVoters.length,
        awayVotes: body.game.awayVoters.length,
      });
    }
  }

  createPlayerStatRow(element, index) {
    var stat = "";
    if (element.points !== undefined) {
      stat = element.points + " points";
    }
    if (element.assists !== undefined) {
      stat = element.assists + " assists";
    }
    if (element.rebounds !== undefined) {
      stat = element.rebounds + " rebounds";
    }

    return (
      <tr>
        <td>{element.name}</td>
        <td>{stat}</td>
      </tr>
    );
  }

  getUserConfidence() {
    var userConfidence =
      (100 * this.state.homeVotes) /
      (this.state.awayVotes + this.state.homeVotes);
    if (userConfidence === 0 || isNaN(userConfidence)) {
      userConfidence = 50;
    }

    return userConfidence;
  }

  getUserWinner() {
    var userWinner = "home";
    if (this.state.awayVotes > this.state.homeVotes) {
      userWinner = "away";
    }
    return userWinner;
  }

  getHomeAwayWinner() {
    var homeAwayWinner = "home";

    if (this.state.predictedWinner === this.state.awayTeam) {
      homeAwayWinner = "away";
    }

    return homeAwayWinner;
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
    await Promise.all([this.fetchGameData(), this.fetchPrediction()]);

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading === true) {
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
                          src={this.state.awayLogo}
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
                      <h4>{this.state.awayTeam}</h4>
                    </div>
                    <div className={classes.center}>
                      <h1>
                        <b>{this.state.awayScore}</b>
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
                          {this.state.awayLineScore.map((element, index) => (
                            <th id={index}>Q{index + 1}</th>
                          ))}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{this.state.awayTeam}</td>
                          {this.state.awayLineScore.map((element, index) => (
                            <td id={index}>{element}</td>
                          ))}
                          <td>{this.state.awayScore}</td>
                        </tr>
                        <tr>
                          <td>{this.state.homeTeam}</td>
                          {this.state.homeLineScore.map((element, index) => (
                            <td id={index}>{element}</td>
                          ))}
                          <td>{this.state.homeScore}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col xs={6} lg={2}>
                    <br />
                    <div className={classes.centered}>
                      <h4>{this.state.homeTeam}</h4>
                    </div>
                    <div className={classes.centered}>
                      <h1>
                        <b>{this.state.homeScore}</b>
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
                          src={this.state.homeLogo}
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
              <Row>
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
                      predictedWinner={this.getHomeAwayWinner()}
                      predictionConfidence={this.state.predictionConfidence}
                      awayHex={this.state.awayHex}
                      homeHex={this.state.homeHex}
                    />
                  ) : (
                    <Speedometer
                      predictedWinner={this.getUserWinner()}
                      predictionConfidence={this.getUserConfidence()}
                      awayHex={this.state.awayHex}
                      homeHex={this.state.homeHex}
                    />
                  )}
                </div>
                <div>
                  <h5>
                    {this.state.predictionType === ML_PREDICT ? (
                      this.state.predictionConfidence > 51 ? (
                        <div>
                          Dubb Club is <b>{this.state.predictionConfidence}%</b>{" "}
                          confident that the <b>{this.state.predictedWinner}</b>{" "}
                          win
                        </div>
                      ) : this.state.predictedWinner === "" ? (
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
                      this.state.awayTeam +
                      " will win and " +
                      this.state.homeVotes +
                      " user(s) think that " +
                      this.state.homeTeam +
                      " will win."
                    )}
                  </h5>
                </div>
              </Row>
              <Row>
                <div
                  style={{
                    height: "600px",
                    width: "1000px",
                  }}
                >
                  <PredictionGraph
                    homeTeam={this.state.homeTeam}
                    awayTeam={this.state.awayTeam}
                    homeHex={this.state.homeHex}
                    awayHex={this.state.awayHex}
                    gameID={this.state.gameID}
                  />
                </div>
              </Row>
            </Col>

            <Col>
              <h2>{this.state.homeTeam}</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.homeLeaders.map(this.createPlayerStatRow)}
                </tbody>
              </Table>
              <h2>{this.state.awayTeam}</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.awayLeaders.map(this.createPlayerStatRow)}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
ExpandedGameInfo.contextType = AuthContext;

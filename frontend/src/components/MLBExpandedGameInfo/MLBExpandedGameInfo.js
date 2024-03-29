import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {
  MLB_VOTE,
  DATE_OPTIONS,
  REFRESH_RATE,
  LIVE,
  SCHEDULED,
  FINISHED,
  MLB_GET_GAME_BY_ID,
  MLB,
} from "../../constants/Constants";
import { getMLBColorByTeam } from "../../constants/MLBConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Speedometer from "../Speedometer/Speedometer";
import classes from "./MLBExpandedGameInfo.module.css";
import AuthContext from "../../contexts/AuthContext.js";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";
import PredictionGraph from "../PredictionGraph/PredictionGraph";
import Card from "../Card/Card";
import Expand from "react-expand-animated";

const USER_PREDICT = "user";
const ML_PREDICT = "ml";

export default class MLBExpandedGameInfo extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    this.state = {
      game: {},
      gameID: this.props.gameID,
      homeLineScore: [],
      awayLineScore: [],
      lineScore: [],
      homeLeaders: [],
      awayLeaders: [],
      predictions: {},
      votedTeam: "none",
      homeVotes: 0,
      awayVotes: 0,
      homeHex: "#000000",
      awayHex: "#ffffff",
      predictionConfidence: 50,
      predictionType: ML_PREDICT,
      loading: true,
      status: "Scheduled",
      timeoutID: null,
    };
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.voteForTeam = this.voteForTeam.bind(this);
    this.createPlayerStatRow = this.createPlayerStatRow.bind(this);
    this.getUserConfidence = this.getUserConfidence.bind(this);
    this.getUserWinner = this.getUserWinner.bind(this);
    this.getHomeAwayWinner = this.getHomeAwayWinner.bind(this);
    this.getStatusText = this.getStatusText.bind(this);
    this.getUserWinnerName = this.getUserWinnerName.bind(this);
  }

  componentWillUnmount() {
    // console.log(this.state.timeoutID);
    if (this.state.timeoutID !== null) {
      clearTimeout(this.state.timeoutID);
    }
  }

  async fetchPrediction() {
    // console.log(this.context.token);
    var res = await fetch(MLB_GET_GAME_BY_ID + `/${this.state.gameID}`, {
      headers: {
        "x-access-token": this.context.token,
      },
    });
    if (!(res.status === 200 || res.status === 204)) {
      return;
    }

    var body = await res.json();
    // console.log(body);
    var game = body.game;
    // console.log({ game });

    if (body.game !== undefined) {
      var predictedWinner = game.home.teamName;
      if (game.away.teamId === game.predictedWinner) {
        predictedWinner = game.away.teamName;
      }

      var date = new Date(game.date).toLocaleDateString("en-US", DATE_OPTIONS);

      var time = new Date(game.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // console.log(getColorByTeam(game.home[0].teamName));
      var timeoutID = null;
      if (game.status === LIVE) {
        timeoutID = setTimeout(async () => {
          await this.fetchPrediction();
        }, REFRESH_RATE);
      }

      var homeScore = body.game.homeScore;
      var awayScore = body.game.awayScore;
      var homeLineScore = [];
      var awayLineScore = [];
      var awayLeaders = [];
      var homeLeaders = [];
      if (game.status === LIVE) {
        var period =
          game.half.charAt(0).toUpperCase() +
          game.half.slice(1) +
          " of Inning " +
          game.inning;
      }

      this.setState({
        predictedWinner: predictedWinner,
        predictionConfidence: Number((game.confidence * 100).toFixed(2)),
        homeTeam: game.home.teamName,
        awayTeam: game.away.teamName,
        homeHex: getMLBColorByTeam(game.home.teamName),
        awayHex: getMLBColorByTeam(game.away.teamName),
        awayLogo: game.away.teamImage,
        homeLogo: game.home.teamImage,
        date: date,
        time: time,
        homeId: game.home.teamId,
        awayId: game.away.teamId,
        votedTeam: body.votedTeam,
        homeVotes: body.game.homeVoters.length,
        awayVotes: body.game.awayVoters.length,
        status: body.game.status,
        timeoutID: timeoutID,
        homeScore: homeScore,
        awayScore: awayScore,
        lineScore: body.game.lineScore,
        homeLineScore: homeLineScore,
        awayLineScore: awayLineScore,
        homeLeaders: homeLeaders,
        awayLeaders: awayLeaders,

        period: period,
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
      <tr id={index}>
        <td>{element.name}</td>
        <td>{stat}</td>
      </tr>
    );
  }

  getUserConfidence() {
    var userConfidence =
      (100 * this.state.homeVotes) /
      (this.state.awayVotes + this.state.homeVotes);

    if (this.state.awayVotes > this.state.homeVotes) {
      userConfidence =
        (100 * this.state.awayVotes) /
        (this.state.awayVotes + this.state.homeVotes);
    }
    if (userConfidence === 0 || isNaN(userConfidence)) {
      userConfidence = 50;
    }

    return Number(userConfidence.toFixed(2));
  }

  getUserWinnerName() {
    var userWinnerName = this.state.homeTeam;

    if (this.state.awayVotes > this.state.homeVotes) {
      userWinnerName = this.state.awayTeam;
    }
    return userWinnerName;
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

  getStatusText() {
    if (this.state.status === SCHEDULED) {
      return (
        <div>
          Starts on {this.state.date} at {this.state.time}
        </div>
      );
    }
    if (this.state.status === LIVE) {
      return (
        <div>
          <b>Live Game</b> - {this.state.period}
        </div>
      );
    } else {
      return (
        <div>
          Game Complete, Played on {this.state.date} at {this.state.time}
        </div>
      );
    }
  }

  async voteForTeam(homeAway) {
    var res = await fetch(MLB_VOTE, {
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
      await this.fetchPrediction();
      return true;
    }
  }

  async componentDidMount() {
    await Promise.all([this.fetchPrediction()]);

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
                          successMessage={
                            "Voted for " + this.state.awayTeam + "!"
                          }
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
                    <Card>{this.getStatusText()}</Card>
                    <Card>
                      <Table size="sm" className={[classes.card].join(" ")}>
                        <thead>
                          <tr>
                            <th>Inning</th>
                            {this.state.lineScore.map((element, index) => (
                              <th id={index}>{index + 1}</th>
                            ))}
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.state.awayTeam}</td>
                            {this.state.lineScore.map((element, index) => (
                              <td id={index}>{element.awayScore}</td>
                            ))}
                            <td>{this.state.awayScore}</td>
                          </tr>
                          <tr>
                            <td>{this.state.homeTeam}</td>
                            {this.state.lineScore.map((element, index) => (
                              <td id={index}>{element.homeScore}</td>
                            ))}
                            <td>{this.state.homeScore}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card>
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
                          successMessage={
                            "Voted for " + this.state.homeTeam + "!"
                          }
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
            <Col xs={12} md={6}>
              <Row>
                <div
                  className={[classes.centered, classes.speedometer].join(" ")}
                >
                  <Row xs={2} className={classes.buttonRow}>
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
                        Dubb Club Pregame Prediction
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
                  <Card className={classes.speedometerCard}>
                    <div className={classes.speedometer}>
                      {this.state.predictionType === ML_PREDICT ? (
                        <Speedometer
                          predictedWinner={this.getHomeAwayWinner()}
                          predictionConfidence={this.state.predictionConfidence}
                          awayHex={this.state.awayHex}
                          homeHex={this.state.homeHex}
                          fluidWidth={false}
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
                  </Card>
                </div>
                <Card className={classes.speedometerCard}>
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
                    ) : this.getUserConfidence() > 51 ? (
                      <div>
                        Users are <b>{this.getUserConfidence()}%</b> confident
                        that the <b>{this.getUserWinnerName()}</b> win
                      </div>
                    ) : (
                      <div>
                        <b>Users are Evenly Split</b>
                      </div>
                    )}
                  </h5>
                </Card>
              </Row>
            </Col>

            <Col xs={12} md={6}>
              <Expand open={this.state.status === LIVE}>
                <Card className={classes.playerCard}>
                  This game is <b>Live</b>! No need to refresh, Dubb Club will
                  load our latest predictions every {REFRESH_RATE / 1000}{" "}
                  seconds.
                </Card>
              </Expand>
              <Expand
                open={
                  this.state.status === FINISHED || this.state.status === LIVE
                }
              >
                <div>
                  <h2 className={classes.headerPadding}>Live Predictions</h2>
                  <Card className={classes.playerCard}>
                    <div className={classes.predictionGraph}>
                      <PredictionGraph
                        homeTeam={this.state.homeTeam}
                        awayTeam={this.state.awayTeam}
                        homeHex={this.state.homeHex}
                        awayHex={this.state.awayHex}
                        liveRefresh={this.state.status === LIVE}
                        refreshRate={REFRESH_RATE}
                        gameID={this.state.gameID}
                        league={MLB}
                      />
                    </div>
                  </Card>
                </div>
              </Expand>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
MLBExpandedGameInfo.contextType = AuthContext;

import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Expand from "react-expand-animated";
import {
  FAVORITE_TEAM,
  UNFAVORITE_TEAM,
  GAME_INFO_ROUTE,
  GET_GAME_BY_ID_FROM_DB,
  DATE_OPTIONS,
} from "../../constants/Constants";
import { getColorByTeam, getTeamByID } from "../../constants/NBAConstants";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";
import AuthContext from "../../contexts/AuthContext.js";
import Button from "../Button/Button";
import Card from "../Card/Card";
import SmartButton from "../SmartButton/SmartButton";
import Speedometer from "../Speedometer/Speedometer";
import classes from "./GameInfoCard.module.css";

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

    console.log(props);
    var tempHomeHex = "#000000";
    if (props.homeTeam !== undefined) {
      tempHomeHex = getColorByTeam(props.homeTeam);
    }
    var tempAwayHex = "#ffffff";
    if (props.awayHex !== undefined) {
      tempAwayHex = getColorByTeam(props.awayTeam);
    }

    this.state = {
      expandInfo: false,
      awayFavorite: false,
      homeFavorite: false,
      homeHex: tempHomeHex,
      awayHex: tempAwayHex,
      predictionConfidence: 50,
      predictedWinner: "home",
      homeTeam: "Loading",
      awayTeam: "Loading",
      arena: "Loading",
    };

    this.hexAlphaConverter = this.hexAlphaConverter.bind(this);
    this.hexMedianValue = this.hexMedianValue.bind(this);
    this.fetchGameData = this.fetchGameData.bind(this);
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
  async componentDidMount() {
    // console.log(this.props.predictedWinner);
    // console.log(this.props);
    // console.log(this.props);
    // console.log(this.props.awayTeam);
    // console.log(this.context.isFollowedTeam("NBA", this.props.awayId));
    // var tempHomeHex = getColorByTeam(this.props.homeTeam);
    // var tempAwayHex = getColorByTeam(this.props.awayTeam);
    // this.setState({
    //   homeHex: tempHomeHex,
    //   awayHex: tempAwayHex,
    // });
    await this.fetchGameData(this.props.gameID);
  }

  async fetchGameData(gameID) {
    var res = await fetch(GET_GAME_BY_ID_FROM_DB + `/${gameID}`, {});
    var body = await res.json();
    // console.log(body.game);

    if (res.status === 200) {
      var predictedWinner = body.game.home[0].teamName;
      if (body.game.away[0].teamId === body.game.predictedWinner) {
        predictedWinner = body.game.away[0].teamName;
      }

      var date = new Date(body.game.date).toLocaleDateString(
        "en-US",
        DATE_OPTIONS
      );

      this.setState({
        arena: body.game.arena,
        predictedWinner: predictedWinner,
        predictionConfidence: Number((body.game.confidence * 100).toFixed(2)),
        homeTeam: body.game.home[0].teamName,
        awayTeam: body.game.away[0].teamName,
        homeHex: getColorByTeam(body.game.home[0].teamName),
        awayHex: getColorByTeam(body.game.away[0].teamName),
        homeLogo: body.game.home[0].teamImage,
        awayLogo: body.game.away[0].teamImage,
        gameTime: date,
        homeId: body.game.home[0].teamId,
        awayId: body.game.away[0].teamId,
      });
    }
  }

  async favoriteTeam(teamId) {
    var res = await fetch(FAVORITE_TEAM, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        league: "NBA",
        teamId: teamId,
      }),
    });
    // console.log(res);
    if (res.status !== 200) {
      return false;
    }

    await this.context.refreshFavoriteTeams();
    return true;
  }

  async unFavoriteTeam(teamId) {
    var res = await fetch(UNFAVORITE_TEAM, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        league: "NBA",
        teamId: teamId,
      }),
    });
    // console.log(res);
    if (res.status !== 200) {
      return false;
    }

    await this.context.refreshFavoriteTeams();
    return true;
  }

  render() {
    const shareURL = "https://www.dubb.club";
    const shareText = `Dubb Club has predicted that ${this.state.predictedWinner} will win today with a confidence of ${this.state.predictionConfidence}`;
    var homeAwayWinner = "home";

    if (this.state.predictedWinner === this.state.awayTeam) {
      homeAwayWinner = "away";
    }

    // console.log(this.state);

    return (
      <div>
        <div className={classes.wrapper}>
          <Card className={classes.outer}>
            <Container>
              <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                <Col>
                  <div
                    className={classes.background}
                    onMouseEnter={() => {
                      this.setState({ awayFavorite: true });
                    }}
                    onMouseLeave={() => {
                      this.setState({ awayFavorite: false });
                    }}
                  >
                    <div
                      className={[
                        classes.centered,
                        classes.verticalCenterImage,
                      ].join(" ")}
                    >
                      <img src={this.state.awayLogo} className={classes.logo} />
                    </div>
                    <Expand
                      open={this.state.awayFavorite && this.context.isLoggedIn}
                    >
                      <div
                        hidden={this.context.isFollowedTeam(
                          "NBA",
                          this.state.awayId
                        )}
                      >
                        <SmartButton
                          runOnClick={() => {
                            return this.favoriteTeam(this.state.awayId);
                          }}
                        >
                          Favorite
                        </SmartButton>
                      </div>
                      <div
                        hidden={
                          !this.context.isFollowedTeam("NBA", this.state.awayId)
                        }
                      >
                        <SmartButton
                          runOnClick={() => {
                            return this.unFavoriteTeam(this.state.awayId);
                          }}
                        >
                          Remove Favorite
                        </SmartButton>
                      </div>
                    </Expand>
                  </div>
                </Col>
                <Col>
                  <div
                    className={classes.background}
                    onMouseEnter={() => {
                      this.setState({ homeFavorite: true });
                    }}
                    onMouseLeave={() => {
                      this.setState({ homeFavorite: false });
                    }}
                  >
                    <div
                      className={[
                        classes.centered,
                        classes.verticalCenterImage,
                      ].join(" ")}
                    >
                      <img src={this.state.homeLogo} className={classes.logo} />
                    </div>
                    <Expand
                      open={this.state.homeFavorite && this.context.isLoggedIn}
                    >
                      <div
                        hidden={this.context.isFollowedTeam(
                          "NBA",
                          this.state.homeId
                        )}
                      >
                        <SmartButton
                          runOnClick={() => {
                            return this.favoriteTeam(this.state.homeId);
                          }}
                        >
                          Favorite
                        </SmartButton>
                      </div>
                      <div
                        hidden={
                          !this.context.isFollowedTeam("NBA", this.state.homeId)
                        }
                      >
                        <SmartButton
                          runOnClick={() => {
                            return this.unFavoriteTeam(this.state.homeId);
                          }}
                        >
                          Remove Favorite
                        </SmartButton>
                      </div>
                    </Expand>
                  </div>
                </Col>
              </Row>
              <br />
              <Row noGutters>
                <Col>
                  <div className={classes.teamNames}>
                    <b>{this.state.awayTeam}</b>
                  </div>
                </Col>
                <Col sm={1}>
                  <div className={classes.teamNames}>
                    <b>@</b>
                  </div>
                </Col>
                <Col>
                  <div className={classes.teamNames}>
                    <b>{this.state.homeTeam}</b>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <div className={classes.speedometer}>
                  <Speedometer
                    predictedWinner={homeAwayWinner}
                    awayHex={this.state.awayHex}
                    homeHex={this.state.homeHex}
                    predictionConfidence={this.state.predictionConfidence}
                  />
                </div>
                <div>
                  <h5>
                    {this.state.predictionConfidence > 51 ? (
                      <div>
                        <b>{this.state.predictionConfidence}%</b> confidence
                        that the <b>{this.state.predictedWinner}</b> win
                      </div>
                    ) : this.state.predictedWinner === "" ? (
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
                {this.state.gameId}
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
            <b>{this.state.gameTime}</b>
            <Expand open={this.state.expandInfo}>
              <div>{this.state.arena}</div>
              <br />
              <Button
                variant="success"
                onClick={() => {
                  console.log(this.props.gameID);
                  if (this.props.gameID !== undefined) {
                    this.props.history.push(
                      GAME_INFO_ROUTE + "/" + this.props.gameID
                    );
                  }
                }}
              >
                More Info
              </Button>
              <br />
              <br />
              <FacebookShareButton
                url={shareURL}
                title={shareText}
                quote={shareText}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareURL} title={shareText}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <RedditShareButton url={shareURL} title={shareText}>
                <RedditIcon size={32} round />
              </RedditShareButton>
            </Expand>
          </div>
        </div>
      </div>
    );
  }
}
GameInfoCard.contextType = AuthContext;

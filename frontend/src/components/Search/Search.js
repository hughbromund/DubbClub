import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import {
  DATE_OPTIONS,
  GAME_INFO_ROUTE,
  GET_GAMES_BY_DATE,
  GET_GAMES_BY_TEAM,
  GET_GAME_BY_ID_FROM_DB,
} from "../../constants/Constants";
import {
  getColorByTeam,
  getIdByTeam,
  NBA_TEAM_INFO,
  getTeamByID,
} from "../../constants/NBAConstants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import SmartButton from "../SmartButton/SmartButton";
import classes from "./Search.module.css";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTeam: "",
      searchType: "Team",
      searchDate: new Date(),
      games: {},
      predictions: {},
    };

    this.fetchGameDataByDate = this.fetchGameDataByDate.bind(this);
    this.fetchGameDataByTeam = this.fetchGameDataByTeam.bind(this);
    this.fetchPrediction = this.fetchPrediction.bind(this);
    this.getPredictedWinner = this.getPredictedWinner.bind(this);
    this.getPredictionConfidence = this.getPredictionConfidence.bind(this);
  }

  async fetchGameDataByDate() {
    this.setState({ games: {} });
    var res = await fetch(GET_GAMES_BY_DATE + `/${this.state.searchDate}`, {});
    var body = await res.json();
    this.setState({
      games: body,
    });
    for (var i = 0; i < body.length; i++) {
      if (body[i].gameId !== undefined) {
        await this.fetchPrediction(body[i].gameId);
      }
    }
  }

  async fetchGameDataByTeam() {
    this.setState({ games: {} });
    const teamID = getIdByTeam(this.state.searchTeam);
    var res = await fetch(GET_GAMES_BY_TEAM + `/${teamID}`, {});
    var body = await res.json();
    this.setState({
      games: body,
    });
    for (var i = 0; i < body.length; i++) {
      if (body[i].gameId !== undefined) {
        await this.fetchPrediction(body[i].gameId);
      }
    }
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

  render() {
    let cards = [];
    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            homeTeam={this.state.games[i].home.teamName}
            awayTeam={this.state.games[i].away.teamName}
            gameTime={new Date(this.state.games[i].date).toLocaleDateString(
              "en-US",
              DATE_OPTIONS
            )}
            predictedWinner={this.getPredictedWinner(
              this.state.games[i].gameId
            )}
            predictionConfidence={this.getPredictionConfidence(
              this.state.games[i].gameId
            )}
            awayLogo={this.state.games[i].away.teamImage}
            homeLogo={this.state.games[i].home.teamImage}
            venue={this.state.games[i].arena}
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            homeHex={getColorByTeam(this.state.games[i].home.teamName)}
            awayHex={getColorByTeam(this.state.games[i].away.teamName)}
            homeId={this.state.games[i].home.teamId}
            awayId={this.state.games[i].away.teamId}
            gameID={this.state.games[i].gameId}
            history={this.props.history}
            key={i}
          />
        </Col>
      );
      cards.push(temp);
    }
    let teams = [];
    teams.push(
      <option value="" selected disabled hidden>
        Select a team...
      </option>
    );
    for (const team in NBA_TEAM_INFO) {
      let temp = <option>{team}</option>;
      teams.push(temp);
    }
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className={classes.center}>
                <h1>Search</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <InputGroup>
                  <FormControl
                    placeholder={this.state.searchType}
                    hidden={this.state.searchType !== "Team"}
                    value={this.state.searchTeam}
                    onChange={(e) => {
                      this.setState({ searchTeam: e.target.value });
                    }}
                    as="select"
                  >
                    {teams}
                  </FormControl>
                  <FormControl
                    type="date"
                    hidden={this.state.searchType !== "Date"}
                    style={{ display: "block" }}
                    value={this.state.searchDate}
                    onChange={(e) => {
                      this.setState({ searchDate: e.target.value });
                    }}
                  />
                  <DropdownButton
                    as={InputGroup.Append}
                    title={this.state.searchType}
                    id="input-group-dropdown-2"
                  >
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Team" })}
                    >
                      Team
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Date" })}
                    >
                      Date
                    </Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
                <br />
                <SmartButton
                  runOnClick={async () => {
                    this.state.searchType === "Date"
                      ? await this.fetchGameDataByDate()
                      : await this.fetchGameDataByTeam();
                    if (this.state.games.length === undefined) {
                      return false;
                    }
                    return true;
                  }}
                >
                  Go
                </SmartButton>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {cards}
          </Row>
        </Container>
      </div>
    );
  }
}

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
  GET_NBA_STANDINGS,
  GET_GAMES_BY_TEAM_DB,
  GET_GAMES_BY_DATE_DB,
} from "../../constants/Constants";
import {
  getColorByTeam,
  getIdByTeam,
  NBA_TEAM_INFO,
  getTeamByID,
} from "../../constants/NBAConstants";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import SmartButton from "../SmartButton/SmartButton";
import Card from "../Card/Card";
import classes from "./Search.module.css";

export default class Search extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.match.params.id);
    const id = this.props.match.params.id;
    let team = "Atlanta Hawks";
    // console.log(NBA_TEAM_INFO);
    // console.log(id);
    if (id !== undefined) {
      team = getTeamByID(Number(id));
    }

    this.state = {
      searchTeam: team,
      searchType: "Team",
      searchDate: new Date(),
      games: [],
      predictions: {},
      isButtonDisabled: false,
      teamHex: "#000000",
      teamImage: "",
      teamStanding: 0,
      teamName: "",
      gamesBehind: 0,
      lastTenLosses: 0,
      lastTenWins: 0,
      losses: 0,
      wins: 0,
      winStreak: 0,
      conference: "",
      elo: 0,
      loading: false,
    };

    this.fetchGameDataByDate = this.fetchGameDataByDate.bind(this);
    this.fetchGameDataByTeam = this.fetchGameDataByTeam.bind(this);
    this.fetchStandings = this.fetchStandings.bind(this);
    this.setTeamInfo = this.setTeamInfo.bind(this);
  }

  async componentDidMount() {
    await this.fetchStandings();
    if (this.props.match.params.id !== undefined) {
      // console.log("here");
      this.setState({ isButtonDisabled: true, loading: true });
      await this.fetchGameDataByTeam();
      this.setState({ isButtonDisabled: false, loading: false });
      // console.log(this.state.searchTeam);
    }
  }

  async fetchStandings() {
    var res = await fetch(GET_NBA_STANDINGS, {});
    var body = await res.json();
    // console.log(body.game);

    if (res.status === 200) {
      var tempEast = [];
      var tempWest = [];

      for (let [key, value] of Object.entries(body)) {
        if (value["conference"] === "east") {
          tempEast.push(value);
        } else {
          tempWest.push(value);
        }
      }

      tempEast.sort((first, second) => {
        return first.standing - second.standing;
      });
      tempWest.sort((first, second) => {
        return first.standing - second.standing;
      });
      // console.log(tempEast);
      // console.log(tempWest);
      this.setState({
        east: tempEast,
        west: tempWest,
      });
    }
  }

  async fetchGameDataByDate() {
    this.setState({ games: {}, loading: true });
    var res = await fetch(
      GET_GAMES_BY_DATE_DB + `/${this.state.searchDate}`,
      {}
    );
    var body = await res.json();
    this.setState({
      games: body,
      loading: false,
    });
  }

  setTeamInfo(teamID) {
    // console.log("SET TEAM INFO");
    var conference = "";
    for (var i = 0; i < this.state.east.length; i++) {
      if (this.state.east[i].teamId === teamID) {
        this.setState({
          conference: "Eastern Conference",
          teamImage: this.state.east[i].teamImage,
          teamStanding: this.state.east[i].standing,
          gamesBehind: this.state.east[i].gamesBehind,
          lastTenLosses: this.state.east[i].lastTenLosses,
          lastTenWins: this.state.east[i].lastTenWins,
          losses: this.state.east[i].losses,
          wins: this.state.east[i].wins,
          winStreak: this.state.east[i].winStreak,
          teamName: this.state.searchTeam,
          teamHex: getColorByTeam(this.state.searchTeam),
          elo: this.state.east[i].elo.toFixed(2),
        });
        return;
      }
    }
    for (var i = 0; i < this.state.west.length; i++) {
      if (this.state.west[i].teamId === teamID) {
        this.setState({
          conference: "Western Conference",
          teamImage: this.state.west[i].teamImage,
          teamStanding: this.state.west[i].standing,
          gamesBehind: this.state.west[i].gamesBehind,
          lastTenLosses: this.state.west[i].lastTenLosses,
          lastTenWins: this.state.west[i].lastTenWins,
          losses: this.state.west[i].losses,
          wins: this.state.west[i].wins,
          winStreak: this.state.west[i].winStreak,
          teamName: this.state.searchTeam,
          teamHex: getColorByTeam(this.state.searchTeam),
          elo: this.state.west[i].elo.toFixed(2),
        });
        return;
      }
    }
  }

  async fetchGameDataByTeam() {
    this.setState({ games: {}, loading: true });
    const teamID = getIdByTeam(this.state.searchTeam);
    this.setTeamInfo(teamID);

    var res = await fetch(GET_GAMES_BY_TEAM_DB + `/${teamID}`, {});
    var body = await res.json();
    this.setState({
      games: body,
      loading: false,
    });
  }

  render() {
    let cards = [];

    if (this.state.searchType === "Team" && this.state.games.length > 0) {
      cards.push(
        <Col>
          <Card style={{ boxShadow: "10px 0px " + this.state.teamHex }}>
            <Row xs={1} sm={2}>
              <Col sm={8}>
                <h4>
                  <b>{this.state.teamName}</b> #{this.state.teamStanding}
                </h4>
                <h5>
                  <b>{this.state.conference}</b>
                </h5>
                <h5>
                  <b>Elo:</b> {this.state.elo}
                </h5>
              </Col>
              <Col sm={4}>
                <div style={{ textAlign: "center" }}>
                  <img width="100px" src={this.state.teamImage} />
                </div>
              </Col>
            </Row>
            <hr style={{ background: this.state.teamHex }} />
            <Row>
              <Col>
                <b>Wins:</b> {this.state.wins}
              </Col>
              <Col>
                <b>Losses:</b> {this.state.losses}
              </Col>
              <Col>
                <b>Win Streak:</b> {this.state.winStreak}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Last 10 Wins: </b> {this.state.lastTenWins}
              </Col>
              <Col>
                <b>Last 10 Losses: </b> {this.state.lastTenLosses}
              </Col>
              <Col>
                <b>GB: </b>
                {this.state.gamesBehind}
              </Col>
            </Row>
          </Card>
        </Col>
      );
    }

    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            gameID={this.state.games[i]}
            history={this.props.history}
            key={i}
          />
        </Col>
      );
      cards.push(temp);
    }
    let teams = [];
    for (const team in NBA_TEAM_INFO) {
      let temp = <option>{team}</option>;
      teams.push(temp);
    }
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div>
                <h1>Search</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <Row xs={1} sm={1} md={2}>
                  <Col md={10}>
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
                          onClick={() =>
                            this.setState({ searchType: "Team", games: [] })
                          }
                        >
                          Team
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            this.setState({ searchType: "Date", games: [] })
                          }
                        >
                          Date
                        </Dropdown.Item>
                      </DropdownButton>
                    </InputGroup>
                    <br />
                  </Col>

                  <Col md={2}>
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
                      disabled={this.state.isButtonDisabled}
                    >
                      Go
                    </SmartButton>
                  </Col>
                </Row>
                <br />
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          {!this.state.loading ? (
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {cards}
            </Row>
          ) : (
            <Col>
              <br />
              <LoadingSpinner />
            </Col>
          )}
        </Container>
      </div>
    );
  }
}

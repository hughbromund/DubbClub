import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import Tooltip from "../Tooltip/Tooltip";

import { GET_PLAYER_INFO } from "../../constants/Constants";
import { getTeamByID } from "../../constants/NBAConstants";

import classes from "./Player.module.css";

const months = new Array();
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      career: {},
      mostRecentGame: {},
      playerInfo: {},
      seasons: [],
    };

    this.generateRecentGameStats = this.generateRecentGameStats.bind(this);
    this.generateCareerStats = this.generateCareerStats.bind(this);
    this.calculateAge = this.calculateAge.bind(this);
    this.createSeasonRow = this.createSeasonRow.bind(this);
  }

  async componentDidMount() {
    var res = await fetch(GET_PLAYER_INFO);

    var body = await res.json();

    console.log(body);

    body.playerInfo.dob = new Date(body.playerInfo.dateOfBirth);

    this.setState({
      loading: false,
      career: body.career,
      mostRecentGame: body.mostRecentGame,
      playerInfo: body.playerInfo,
      seasons: body.seasons,
    });
  }

  generateRecentGameStats() {
    var output = [];

    for (var propt in this.state.mostRecentGame) {
      if (propt === "gameId" || propt === "teamId" || propt === "playerId") {
        continue;
      }
      output.push(
        <Col>
          <b>{propt.toUpperCase()}</b>: {this.state.mostRecentGame[propt]}
        </Col>
      );
    }

    return output;
  }

  generateCareerStats() {
    var output = [];

    for (var propt in this.state.career) {
      if (
        propt === "gameId" ||
        propt === "teamId" ||
        propt === "season" ||
        propt === "playerId"
      ) {
        continue;
      }
      output.push(
        <Col>
          <b>{propt.toUpperCase()}</b>: {this.state.career[propt]}
        </Col>
      );
    }

    return output;
  }

  calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  createSeasonRow(element, index) {
    console.log(element);

    var season = element.season;
    if (season === "historical") {
      season = "Career";
    }
    var team = getTeamByID(element.teamId);
    if (team === 0) {
      team = "";
    }

    return (
      <tr>
        <td>{season}</td>
        <td>
          <img className={classes.RowImage} src={element.teamImage} /> {team}
        </td>
        <td>{element.assists}</td>
        <td>{element.blocks}</td>
        <td>{element.fgm}</td>
        <td>{element.fga}</td>
        <td>{element.fgp}%</td>
        <td>{element.ftm}</td>
        <td>{element.fta}</td>
        <td>{element.ftp}%</td>
        <td>{element.tpm}</td>
        <td>{element.tpa}</td>
        <td>{element.tpp}%</td>
        <td>{element.min}</td>
      </tr>
    );
  }

  render() {
    // console.log(this.state);

    if (this.state.loading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div>
        <Container>
          <Card className={classes.PlayerInfoCard}>
            <Row xs={1} sm={2} md={3}>
              <Col md="auto">
                <img
                  style={{ height: "8rem" }}
                  src={this.state.playerInfo.teamImage}
                />
              </Col>
              <Col>
                <Row>
                  <h1>
                    <b>
                      {this.state.playerInfo.firstName}{" "}
                      {this.state.playerInfo.lastName}
                    </b>
                  </h1>
                </Row>
                <Row>
                  <h3>
                    #{this.state.playerInfo.leagues.standard.jersey} -{" "}
                    {getTeamByID(this.state.playerInfo.teamId)}
                  </h3>
                </Row>
              </Col>
              <Col>
                <Row>
                  <h5>
                    <b>Height: </b>
                    {this.state.playerInfo.heightInMeters} m
                  </h5>
                </Row>
                <Row>
                  <h5>
                    <b>Weight: </b> {this.state.playerInfo.weightInKilograms} kg
                  </h5>
                </Row>
                <Row>
                  <h5>
                    <b>NBA Start: </b> {this.state.playerInfo.startNba}
                  </h5>
                </Row>
                <Row>
                  <h5>
                    <b>DOB: </b>
                    {months[this.state.playerInfo.dob.getMonth()]}{" "}
                    {this.state.playerInfo.dob.getDate()},{" "}
                    {this.state.playerInfo.dob.getFullYear()} (
                    {this.calculateAge(this.state.playerInfo.dob)})
                  </h5>
                </Row>
                <Row>
                  <h5>
                    <b>Home Country:</b> {this.state.playerInfo.country}
                  </h5>
                </Row>
                <Row>
                  <h5>
                    <b>College: </b>
                    {this.state.playerInfo.collegeName}
                  </h5>
                </Row>
              </Col>
            </Row>
          </Card>
          <h2 className={classes.headerPadding}>Seasonal Data</h2>
          <Row noGutters>
            <Card className={classes.SeasonCard}>
              <Table className={classes.SeasonTable} responsive>
                <thead>
                  <tr>
                    <th>Season</th>
                    <th>Team</th>
                    <th>
                      <Tooltip text="Assists" placement="top">
                        AST
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Blocks" placement="top">
                        BLK
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Field Goals Made" placement="top">
                        FGM
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Field Goals Attempted" placement="top">
                        FGA
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Field Goal Percentage" placement="top">
                        FGP
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Free Throws Made" placement="top">
                        FTM
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Free Throws Attempted" placement="top">
                        FTA
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Free Throw Percentage" placement="top">
                        FTP
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Three Pointers Made" placement="top">
                        TPM
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Three Pointers Attempted" placement="top">
                        TPA
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Three Pointer Percentage" placement="top">
                        TPP
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Minutes Played" placement="top">
                        MINS
                      </Tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody>{this.state.seasons.map(this.createSeasonRow)}</tbody>
                <tbody>{this.createSeasonRow(this.state.career)}</tbody>
              </Table>
            </Card>
          </Row>
          <Row noGutters>
            <Col>
              <h2 className={classes.headerPadding}>Most Recent Game</h2>
              <GameInfoCard gameID={this.state.mostRecentGame.gameId} />
            </Col>
            <Col>
              <Row noGutters>
                <Card className={classes.MostRecentGameStats}>
                  <h3>Most Recent Game Stats</h3>
                  <Row md={3}>{this.generateRecentGameStats()}</Row>
                </Card>
              </Row>
              <Row noGutters>
                <Card className={classes.MostRecentGameStats}>
                  <h3>Career Stats</h3>
                  <Row md={3}>{this.generateCareerStats()}</Row>
                </Card>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

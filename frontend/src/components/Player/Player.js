import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import Tooltip from "../Tooltip/Tooltip";
import { toast } from "react-toastify";

import { GET_PLAYER_INFO, NBA } from "../../constants/Constants";
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
    this.calculateAge = this.calculateAge.bind(this);
    this.createSeasonRow = this.createSeasonRow.bind(this);
  }

  async componentDidMount() {
    console.log(this.props);
    var res = await fetch(GET_PLAYER_INFO + "/" + this.props.match.params.id);

    if (res.status !== 200) {
      toast.error("There was an Error Loading this player. Please Try again!");
      return;
    }

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
        <Col key={propt}>
          <b>{propt.toUpperCase()}</b>: {this.state.mostRecentGame[propt]}
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
    // console.log(element);

    var season = element.season;
    if (season === "historical") {
      season = "Career";
    }
    if (season === undefined) {
      season = "Most Recent Game";
    }
    var team = getTeamByID(element.teamId);
    if (team === 0) {
      team = "";
    }

    return (
      <tr key={season}>
        <td>{season}</td>
        <td>
          <img
            hidden={element.teamImage === undefined}
            className={classes.RowImage}
            src={element.teamImage}
          />
        </td>
        <td>{team}</td>
        <td>{element.assists.toFixed(2)}</td>
        <td>{element.blocks.toFixed(2)}</td>
        <td>{element.defReb.toFixed(2)}</td>
        <td>{element.fgm.toFixed(2)}</td>
        <td>{element.fga.toFixed(2)}</td>
        <td>{(element.fgp * 100).toFixed(2)}%</td>
        <td>{element.ftm.toFixed(2)}</td>
        <td>{element.fta.toFixed(2)}</td>
        <td>{(element.ftp * 100).toFixed(2)}%</td>
        <td>{element.tpm.toFixed(2)}</td>
        <td>{element.tpa.toFixed(2)}</td>
        <td>{(element.tpp * 100).toFixed(2)}%</td>
        <td>{element.min}</td>
        <td>{element.offReb.toFixed(2)}</td>
        <td>{element.pFouls.toFixed(2)}</td>
        <td>{element.points.toFixed(2)}</td>
        <td>{(element.reb ?? element.defReb).toFixed(2)}</td>
        <td>{element.steals.toFixed(2)}</td>
        <td>{element.turnovers.toFixed(2)}</td>
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
                  alt="Players Current Team Logo"
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
                    #{this.state.playerInfo.jersey} -{" "}
                    {getTeamByID(this.state.playerInfo.teamId)}
                  </h3>
                </Row>
              </Col>
              <Col md="auto">
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
                    {this.state.playerInfo.dob.getFullYear()} (Age:{" "}
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
                    <th></th>
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
                      <Tooltip text="Defensive Rebounds" placement="top">
                        DRB
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
                    <th>
                      <Tooltip text="Offensive Rebounds" placement="top">
                        ORB
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Personal Fouls" placement="top">
                        PF
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Points Scored" placement="top">
                        PTS
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Rebounds" placement="top">
                        REB
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Steals" placement="top">
                        STL
                      </Tooltip>
                    </th>
                    <th>
                      <Tooltip text="Turnovers" placement="top">
                        TOV
                      </Tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody>{this.state.seasons.map(this.createSeasonRow)}</tbody>
                <tbody>{this.createSeasonRow(this.state.mostRecentGame)}</tbody>
                <tbody>{this.createSeasonRow(this.state.career)}</tbody>
              </Table>
            </Card>
          </Row>
          <Row noGutters>
            <Col>
              <h2 className={classes.headerPadding}>Most Recent Game</h2>
              <GameInfoCard
                league={NBA}
                gameID={this.state.mostRecentGame.gameId}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

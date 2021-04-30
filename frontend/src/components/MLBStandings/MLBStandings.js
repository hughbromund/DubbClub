import React, { Component } from "react";
import {
  MLB_GET_ALL_TEAM_STATS,
  TEAM_INFO_ROUTE,
  MLB,
} from "../../constants/Constants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import FavoriteStar from "../FavoriteStar/FavoriteStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../Card/Card";

import classes from "./MLBStandings.module.css";

export default class MLBStandings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
    };

    this.fetchStandings = this.fetchStandings.bind(this);
  }

  async componentDidMount() {
    this.fetchStandings();
  }
  async fetchStandings() {
    var res = await fetch(MLB_GET_ALL_TEAM_STATS, {});
    var body = await res.json();

    console.log(body);

    if (res.status === 200) {
      var temp = body;
      temp.sort((first, second) => {
        return second.wins - first.wins;
      });

      this.setState({
        teams: temp,
      });
    }
  }
  render() {
    if (this.state.teams.length === 0) {
      return (
        <div>
          <Container fluid>
            <LoadingSpinner />
          </Container>
        </div>
      );
    }
    let renderedTeams = [];

    var nationalWest = [];
    var nationalEast = [];
    var nationalCentral = [];
    var americaWest = [];
    var americaCentral = [];
    var americaEast = [];

    for (let i = 0; i < this.state.teams.length; i++) {
      var temp = (
        <tr key={this.state.teams[i].teamId}>
          <td>
            <FavoriteStar id={this.state.teams[i].teamId} league={MLB} />{" "}
            <img width="25" src={this.state.teams[i].teamImage} />{" "}
            <Link
              className={classes.table}
              to={TEAM_INFO_ROUTE + "/MLB" + `/${this.state.teams[i].teamId}`}
            >
              {this.state.teams[i].teamName}
            </Link>{" "}
          </td>

          <td>{this.state.teams[i].wins}</td>

          <td>{this.state.teams[i].losses}</td>
          <td>{this.state.teams[i].gamesBehind}</td>
          <td>{this.state.teams[i].streak}</td>
        </tr>
      );

      // console.log(this.state.teams[i].division);

      if (this.state.teams[i].division === "National League West") {
        nationalWest.push(temp);
      }
      if (this.state.teams[i].division === "National League East") {
        nationalEast.push(temp);
      }
      if (this.state.teams[i].division === "National League Central") {
        nationalCentral.push(temp);
      }
      if (this.state.teams[i].division === "American League West") {
        americaWest.push(temp);
      }
      if (this.state.teams[i].division === "American League East") {
        americaEast.push(temp);
      }
      if (this.state.teams[i].division === "American League Central") {
        americaCentral.push(temp);
      }

      renderedTeams.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>MLB Standings</h1>
          <Row>
            <Col>
              <Card>
                <h2>National League West</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{nationalWest}</tbody>
                </Table>
              </Card>
            </Col>
            <Col>
              <Card>
                <h2>National League Central</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{nationalCentral}</tbody>
                </Table>
              </Card>
            </Col>
            <Col>
              <Card>
                <h2>National League East</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{nationalEast}</tbody>
                </Table>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <h2>American League West</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{americaWest}</tbody>
                </Table>
              </Card>
            </Col>
            <Col>
              <Card>
                <h2>American League Central</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{americaCentral}</tbody>
                </Table>
              </Card>
            </Col>
            <Col>
              <Card>
                <h2>American League East</h2>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>

                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{americaEast}</tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

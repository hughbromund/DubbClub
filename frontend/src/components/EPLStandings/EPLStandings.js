import React, { Component } from "react";
import {
  EPL_GET_ALL_TEAM_STATS,
  TEAM_INFO_ROUTE,
  EPL,
} from "../../constants/Constants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import FavoriteStar from "../FavoriteStar/FavoriteStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./EPLStandings.module.css";

export default class EPLStandings extends Component {
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
    var res = await fetch(EPL_GET_ALL_TEAM_STATS, {});
    var body = await res.json();

    if (res.status === 200) {
      var temp = body.teams;
      temp.sort((first, second) => {
        var ptDiff =
          3 * second.wins + second.draws - (3 * first.wins + first.draws);
        if (ptDiff > 0) return 1;
        else if (ptDiff < 0) return -1;
        else
          return (
            second.goalsFor -
            second.goalsAgainst -
            (first.goalsFor - first.goalsAgainst)
          );
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
    for (let i = 0; i < this.state.teams.length; i++) {
      var temp = (
        <tr>
          <td>
            <FavoriteStar id={this.state.teams[i].teamId} league={EPL} />{" "}
            <img width="25" src={this.state.teams[i].teamImage} />{" "}
            <Link
              className={classes.table}
              to={TEAM_INFO_ROUTE + "/EPL" + `/${this.state.teams[i].teamId}`}
            >
              {this.state.teams[i].teamName}
            </Link>{" "}
            {i <= 3 ? (
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.ucl}
              />
            ) : null}
            {i === 4 ? (
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.uel}
              />
            ) : null}
            {i >= 17 ? (
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.rel}
              />
            ) : null}
          </td>
          <td>
            {this.state.teams[i].wins +
              this.state.teams[i].draws +
              this.state.teams[i].losses}
          </td>
          <td>{this.state.teams[i].wins}</td>
          <td>{this.state.teams[i].draws}</td>
          <td>{this.state.teams[i].losses}</td>
          <td>{this.state.teams[i].goalsFor}</td>
          <td>{this.state.teams[i].goalsAgainst}</td>
          <td>
            {this.state.teams[i].goalsFor - this.state.teams[i].goalsAgainst}
          </td>
          <td>{3 * this.state.teams[i].wins + this.state.teams[i].draws}</td>
        </tr>
      );
      renderedTeams.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>EPL Standings</h1>
          <Row>
            <Col>
              <Table className={classes.table}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>{renderedTeams}</tbody>
              </Table>
              Legend:
              <br />
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.ucl}
              />{" "}
              : Champions League <br />
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.uel}
              />{" "}
              : Europa League <br />
              <FontAwesomeIcon
                icon={["fa", "circle"]}
                className={classes.rel}
              />{" "}
              : Relegation
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

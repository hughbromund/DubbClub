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
    for (let i = 0; i < this.state.teams.length; i++) {
      var temp = (
        <tr>
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
          <td>{this.state.teams[i].division}</td>

          <td>{this.state.teams[i].wins}</td>

          <td>{this.state.teams[i].losses}</td>
          <td>{this.state.teams[i].gamesBehind}</td>
          <td>{this.state.teams[i].streak}</td>
        </tr>
      );
      renderedTeams.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>MLB Standings</h1>
          <Row>
            <Col>
              <Card>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Division</th>
                      <th>W</th>
                      <th>L</th>
                      <th>GB</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>{renderedTeams}</tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

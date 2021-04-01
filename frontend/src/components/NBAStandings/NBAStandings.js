import React, { Component } from "react";
import { GET_NBA_STANDINGS, SEARCH_ROUTE } from "../../constants/Constants";
import { getTeamByID } from "../../constants/NBAConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import FavoriteStar from "../FavoriteStar/FavoriteStar";

import classes from "./NBAStandings.module.css";

export default class NBAStandings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      east: [],
      west: [],
    };

    this.fetchStandings = this.fetchStandings.bind(this);
  }

  async componentDidMount() {
    this.fetchStandings();
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

      this.setState({
        east: tempEast,
        west: tempWest,
      });
    }
    console.log(this.state.east);
    console.log(this.state.west);
  }
  render() {
    if (this.state.east.length === 0) {
      return (
        <div>
          <Container fluid>
            <LoadingSpinner />
          </Container>
        </div>
      );
    }
    let renderedEast = [];
    for (let i = 0; i < this.state.east.length; i++) {
      var temp = (
        <tr>
          <td>
            <FavoriteStar id={this.state.east[i].teamId} />{" "}
            <img width="25" src={this.state.east[i].teamImage} />{" "}
            <Link
              className={classes.table}
              to={SEARCH_ROUTE + `/${this.state.east[i].teamId}`}
            >
              {this.state.east[i].teamName}
            </Link>
          </td>
          <td>{this.state.east[i].wins}</td>
          <td>{this.state.east[i].losses}</td>
          <td>{this.state.east[i].gamesBehind}</td>
          <td>{`${this.state.east[i].lastTenWins}-${this.state.east[i].lastTenLosses}`}</td>
        </tr>
      );
      renderedEast.push(temp);
    }
    let renderedWest = [];
    for (let i = 0; i < this.state.west.length; i++) {
      var temp = (
        <tr>
          <td>
            <FavoriteStar id={this.state.west[i].teamId} />{" "}
            <img width="25" src={this.state.west[i].teamImage} />{" "}
            <Link
              className={classes.table}
              to={SEARCH_ROUTE + `/${this.state.west[i].teamId}`}
            >
              {this.state.west[i].teamName}
            </Link>
          </td>
          <td>{this.state.west[i].wins}</td>
          <td>{this.state.west[i].losses}</td>
          <td>{this.state.west[i].gamesBehind}</td>
          <td>{`${this.state.west[i].lastTenWins}-${this.state.west[i].lastTenLosses}`}</td>
        </tr>
      );
      renderedWest.push(temp);
    }
    return (
      <div>
        <Container fluid>
          <h1>NBA Standings</h1>
          <Row>
            <Col>
              <h2>East</h2>
              <Table className={classes.table}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>GB</th>
                    <th>L10</th>
                  </tr>
                </thead>
                <tbody>{renderedEast}</tbody>
              </Table>
            </Col>
            <Col>
              <h2>West</h2>
              <Table className={classes.table}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>GB</th>
                    <th>L10</th>
                  </tr>
                </thead>
                <tbody>{renderedWest}</tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

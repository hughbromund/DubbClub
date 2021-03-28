import React, { Component } from "react";
import { GET_NBA_STANDINGS } from "../../constants/Constants";
import { getTeamByID } from "../../constants/NBAConstants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
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

      for (let [key, value] of Object.entries(body["teams"])) {
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
      var temp = <tr>{getTeamByID(this.state.east[i].teamId)}</tr>;
      renderedEast.push(temp);
    }
    let renderedWest = [];
    for (let i = 0; i < this.state.west.length; i++) {
      var temp = <tr>{getTeamByID(this.state.west[i].teamId)}</tr>;
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
                    <th></th>
                    <th>W</th>
                    <th>L</th>
                    <th>GB</th>
                    <th>Q4</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>{renderedEast}</tbody>
              </Table>
            </Col>
            <Col>
              <h2>West</h2>
              {renderedWest}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

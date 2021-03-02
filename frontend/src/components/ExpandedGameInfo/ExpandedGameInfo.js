import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Expand from "react-expand-animated";
import BullsLogo from "../../assets/BullsLogoTest.png";
import KnicksLogo from "../../assets/KnicksLogoTest.png";
import Card from "../Card/Card";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import classes from "./ExpandedGameInfo.module.css";
import { GET_GAME_BY_ID } from "../../constants/Constants";
import SmartButton from "../SmartButton/SmartButton";

export default class ExpandedGameInfo extends Component {
  constructor(props) {
    super(props);

    this.fetchGameData = this.fetchGameData.bind(this);
    this.state = {
      games: {},
      gameID: this.props.location.pathname.substring(
        this.props.location.pathname.lastIndexOf("/") + 1
      ),
    };
  }

  async fetchGameData() {
    var res = await fetch(GET_GAME_BY_ID + `/${this.state.gameID}`, {});
    var body = await res.json();
    this.setState({
      games: body,
    });
  }

  async componentDidMount() {
    if (this.state.games.length === undefined) {
      this.fetchGameData();
    }
  }

  render() {
    console.log(this.state.games);
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col>Away Score</Col>
                  <Col>
                    <Table
                      bordered
                      size="sm"
                      className={[classes.card].join(" ")}
                    >
                      <thead>
                        <tr>
                          <th></th>
                          <th>Q1</th>
                          <th>Q2</th>
                          <th>Q3</th>
                          <th>Q4</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Away Team</td>
                          <td>10</td>
                          <td>10</td>
                          <td>10</td>
                          <td>10</td>
                          <td>40</td>
                        </tr>
                        <tr>
                          <td>Home Team</td>
                          <td>10</td>
                          <td>10</td>
                          <td>10</td>
                          <td>10</td>
                          <td>40</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col>Home Score</Col>
                </Row>
              </Container>
            </Col>
          </Row>
          <hr />
          <Row noGutters>
            <Col>
              <div className={[classes.bottomCard, classes.card].join(" ")}>
                <Card>
                  <h1>Line Graph or Pie Graph Will Go Here</h1>
                </Card>
              </div>
            </Col>
            <Col>
              <h2>Home Team</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Points</th>
                    <th>Assists</th>
                    <th>Rebounds</th>
                    <th>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </Table>
              <h2>Away Team</h2>
              <Table bordered className={[classes.card].join(" ")}>
                <thead>
                  <tr>
                    <th>Players</th>
                    <th>Points</th>
                    <th>Assists</th>
                    <th>Rebounds</th>
                    <th>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>John Doe</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

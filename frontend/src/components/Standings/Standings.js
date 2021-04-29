import React, { Component } from "react";
import MLBStandings from "../MLBStandings/MLBStandings";
import NBAStandings from "../NBAStandings/NBAStandings";
import EPLStandings from "../EPLStandings/EPLStandings";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "../Button/Button";

import { NBA, MLB, EPL, STANDINGS_ROUTE } from "../../constants/Constants";

import classes from "./Standings.module.css";

export default class Standings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: props.match.params.league ?? NBA,
    };

    props.history.push(STANDINGS_ROUTE + "/" + this.state.league);
  }

  render() {
    return (
      <div>
        <h3>Select a League</h3>
        <div className={classes.Buttons}>
          <Row xs={1} md={3}>
            <Col className={classes.ButtonCol}>
              <Button
                variant={this.state.league === NBA ? "primary" : "outline"}
                onClick={() => {
                  this.setState({ league: NBA });
                  this.props.history.push(STANDINGS_ROUTE + "/" + NBA);
                }}
              >
                NBA
              </Button>
            </Col>

            <Col className={classes.ButtonCol}>
              <Button
                variant={this.state.league === MLB ? "primary" : "outline"}
                onClick={() => {
                  this.setState({ league: MLB });
                  this.props.history.push(STANDINGS_ROUTE + "/" + MLB);
                }}
              >
                MLB
              </Button>
            </Col>

            <Col className={classes.ButtonCol}>
              <Button
                variant={this.state.league === EPL ? "primary" : "outline"}
                onClick={() => {
                  this.setState({ league: EPL });
                  this.props.history.push(STANDINGS_ROUTE + "/" + EPL);
                }}
              >
                EPL
              </Button>
            </Col>
          </Row>
        </div>

        <div hidden={this.state.league !== NBA}>
          <NBAStandings />
        </div>
        <div hidden={this.state.league !== MLB}>
          Hello
          <MLBStandings />
        </div>
        <div hidden={this.state.league !== EPL}>
          <EPLStandings />
        </div>
      </div>
    );
  }
}

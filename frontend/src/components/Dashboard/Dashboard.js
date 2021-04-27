import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import AuthContext from "../../contexts/AuthContext.js";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import GameInfoCard from "../GameInfoCard/GameInfoCard";
import {
  GAME_INFO_ROUTE,
  UPCOMING_GAMES_INFO,
  GET_DASHBOARD,
  NBA,
} from "../../constants/Constants";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Card from "../Card/Card";
import Expand from "react-expand-animated";

const INITIAL_STATE = {
  favLive: [],
  favFinished: [],
  favUpcoming: [],
  regFinished: [],
  regLive: [],
  regUpcoming: [],
  loading: true,
  favoriteTeamsList: {},
};

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
    this.fetchGameData = this.fetchGameData.bind(this);
  }

  async fetchGameData() {
    var res = await fetch(GET_DASHBOARD, {
      headers: {
        "x-access-token": this.context.token,
      },
    });
    var body = await res.json();

    this.setState(body);
  }

  async componentDidMount() {
    await this.fetchGameData();
    this.setState({
      loading: false,
      favoriteTeamsList: this.context.getFavoriteTeamsList(),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.context.getFavoriteTeamsList()) !==
      JSON.stringify(this.state.favoriteTeamsList)
    ) {
      await this.fetchGameData();
      this.setState({ favoriteTeamsList: this.context.getFavoriteTeamsList() });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div>
        <Container fluid>
          <h1>
            Welcome Back <b>{this.context.username}</b>
          </h1>
          <Expand open={this.state.favLive.length > 0}>
            <h3>Live Games From Teams You Follow</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.favLive.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
          <Expand open={this.state.favUpcoming.length > 0}>
            <h3>Upcoming Games From Teams You Follow</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.favUpcoming.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
          <Expand open={this.state.favFinished.length > 0}>
            <h3>Recently Finished Games From Teams You Follow</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.favFinished.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
          <Expand open={this.state.regLive.length > 0}>
            <h3>All Live Games</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.regLive.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
          <Expand open={this.state.regUpcoming.length > 0}>
            <h3>All Upcoming Games</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.regUpcoming.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
          <Expand open={this.state.regFinished.length > 0}>
            <h3>All Recently Finished Games</h3>
            <hr />
            <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
              {this.state.regFinished.map((element, index) => {
                return (
                  <Col key={element}>
                    <GameInfoCard
                      league={NBA}
                      gameID={element}
                      history={this.props.history}
                      key={element}
                    />
                  </Col>
                );
              })}
            </Row>
          </Expand>
        </Container>
      </div>
    );
  }
}
Dashboard.contextType = AuthContext;

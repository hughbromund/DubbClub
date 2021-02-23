import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import FormControl from "react-bootstrap/FormControl";
import classes from "./Search.module.css";
import SmartButton from "../SmartButton/SmartButton";
import GameInfoCard from "../GameInfoCard/GameInfoCard";

import {
  GET_GAMES_BY_DATE,
  DATE_OPTIONS,
  GAME_INFO_ROUTE,
} from "../../constants/Constants";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTeam: "",
      searchType: "Team",
      searchDate: new Date(),
      games: {},
    };

    this.fetchGameDataByDate = this.fetchGameDataByDate.bind(this);
  }

  async fetchGameDataByDate() {
    this.setState({ games: {} });
    var res = await fetch(GET_GAMES_BY_DATE + `/${this.state.searchDate}`, {});
    var body = await res.json();
    this.setState({
      games: body,
    });
  }

  render() {
    let cards = [];
    for (let i = 0; i < this.state.games.length; i++) {
      let temp = (
        <Col>
          <GameInfoCard
            homeTeam={this.state.games[i].home.teamName}
            awayTeam={this.state.games[i].away.teamName}
            gameTime={new Date(this.state.games[i].date).toLocaleDateString(
              "en-US",
              DATE_OPTIONS
            )}
            predictedWinner={"away"}
            predictionConfidence={100.0}
            awayLogo={this.state.games[i].away.teamImage}
            homeLogo={this.state.games[i].home.teamImage}
            onClickHandler={() => {
              this.props.history.push(
                GAME_INFO_ROUTE + `/${this.state.games[i].gameId}`
              );
            }}
            key={i}
          />
        </Col>
      );
      cards.push(temp);
    }
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className={classes.center}>
                <h1>Search</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <InputGroup>
                  <FormControl
                    placeholder={this.state.searchType}
                    hidden={this.state.searchType !== "Team"}
                    value={this.state.searchTeam}
                    onChange={(e) => {
                      this.setState({ searchTeam: e.target.value });
                    }}
                  />
                  <FormControl
                    type="date"
                    hidden={this.state.searchType !== "Date"}
                    style={{ display: "block" }}
                    value={this.state.searchDate}
                    onChange={(e) => {
                      this.setState({ searchDate: e.target.value });
                    }}
                  />
                  <DropdownButton
                    as={InputGroup.Append}
                    title={this.state.searchType}
                    id="input-group-dropdown-2"
                  >
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Team" })}
                    >
                      Team
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Date" })}
                    >
                      Date
                    </Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
                <br />
                <SmartButton
                  runOnClick={() =>
                    this.state.searchType === "Date"
                      ? this.fetchGameDataByDate()
                      : alert(
                          this.state.searchType + " " + this.state.searchTeam
                        )
                  }
                >
                  Go
                </SmartButton>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row noGutters={true} xs={1} sm={1} md={2} lg={3}>
            {cards}
          </Row>
        </Container>
      </div>
    );
  }
}

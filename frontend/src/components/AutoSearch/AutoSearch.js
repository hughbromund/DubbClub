import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import AutoSearchCard from "../AutoSearchCard/AutoSearchCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import {
  AUTOCOMPLETE_SEARCH,
  SEARCH_ROUTE,
  TEAM_INFO_ROUTE,
  PLAYER_INFO_ROUTE,
} from "../../constants/Constants";

export default class AutoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      typing: false,
      typingTimeout: 0,
      teamResults: [],
      playerResults: [],
      loading: false,
    };

    this.getSearchResults = this.getSearchResults.bind(this);
  }

  componentDidMount() {
    // console.log(this.props.match.params);

    if (this.props.match.params.query !== undefined) {
      this.setState({
        search: decodeURI(this.props.match.params.query),
      });

      this.getSearchResults(decodeURI(this.props.match.params.query));
    }
  }

  async getSearchResults(query) {
    var res = await fetch(AUTOCOMPLETE_SEARCH + "/" + encodeURI(query));

    var body = await res.json();

    console.log(body);

    this.setState({
      teamResults: body.teams,
      playerResults: body.players,
    });
  }

  updateURL(query) {
    this.props.history.push(SEARCH_ROUTE + "/" + encodeURI(query));
  }

  render() {
    return (
      <div>
        <Container>
          <h1>Search</h1>
          <input
            placeholder="Search for Teams from any sport or NBA players..."
            value={this.state.search}
            onChange={(e) => {
              if (this.state.typingTimeout) {
                clearTimeout(this.state.typingTimeout);
              }

              this.setState({
                search: e.target.value,
                typing: false,
                typingTimeout: setTimeout(async () => {
                  // get search
                  this.setState({
                    loading: true,
                    // teamResults: [],
                    // playerResults: [],
                  });
                  if (e.target.value !== "") {
                    await this.getSearchResults(e.target.value);
                  }
                  this.updateURL(e.target.value);
                  this.setState({ loading: false });
                }, 1000),
              });
            }}
          ></input>
          {this.state.loading ? <LoadingSpinner /> : ""}
          {this.state.teamResults.length + this.state.playerResults.length}{" "}
          Results - Searching for <i>{this.state.search}</i>
          <h2 hidden={this.state.teamResults.length === 0}>Teams</h2>
          {this.state.teamResults.map((element, index) => {
            return (
              <AutoSearchCard
                destination={
                  TEAM_INFO_ROUTE + "/" + element.league + "/" + element.teamId
                }
                name={element.teamName}
                logo={element.teamImage}
                search={this.state.search}
              />
            );
          })}
          <h2 hidden={this.state.playerResults.length === 0}>Players</h2>
          {this.state.playerResults.map((element, index) => {
            return (
              <AutoSearchCard
                destination={PLAYER_INFO_ROUTE + "/" + element.id}
                name={element.name}
                logo={element.teamImage}
                search={this.state.search}
              />
            );
          })}
        </Container>
      </div>
    );
  }
}

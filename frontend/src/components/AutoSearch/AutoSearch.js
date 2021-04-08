import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import AutoSearchCard from "../AutoSearchCard/AutoSearchCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import { AUTOCOMPLETE_SEARCH } from "../../constants/Constants";

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

  async getSearchResults(query) {
    var res = await fetch(AUTOCOMPLETE_SEARCH);

    var body = await res.json();

    // console.log(body);

    this.setState({
      teamResults: body.teams,
      playerResults: body.players,
    });
  }

  render() {
    return (
      <div>
        <Container>
          <h1>Search</h1>
          <input
            placeholder="Search for Teams from any sport or NBA players..."
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
                    teamResults: [],
                    playerResults: [],
                  });
                  await this.getSearchResults(e.target.value);
                  this.setState({ loading: false });
                }, 1000),
              });
            }}
          ></input>
          {this.state.loading ? <LoadingSpinner /> : ""}

          {this.state.teamResults.map((element, index) => {
            return (
              <AutoSearchCard
                name={element.name}
                logo={element.teamImage}
                search={this.state.search}
              />
            );
          })}
          {this.state.playerResults.map((element, index) => {
            return (
              <AutoSearchCard
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

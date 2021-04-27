import React, { Component } from "react";

import { NBA, MLB, EPL } from "../../constants/Constants";
import NBAExpandedGameInfo from "../NBAExpandedGameInfo/NBAExpandedGameInfo";
import EPLExpandedGameInfo from "../EPLExpandedGameInfo/EPLExpandedGameInfo";
import MLBExpandedGameInfo from "../MLBExpandedGameInfo/MLBExpandedGameInfo";

export default class ExpandedGameInfo extends Component {
  render() {
    if (this.props.match.params.league.toUpperCase() === NBA) {
      return <NBAExpandedGameInfo gameID={this.props.match.params.id} />;
    } else if (this.props.match.params.league.toUpperCase() === EPL) {
      return <EPLExpandedGameInfo gameID={this.props.match.params.id} />;
    } else if (this.props.match.params.league.toUpperCase() === MLB) {
      return <MLBExpandedGameInfo gameID={this.props.match.params.id} />;
    }

    return <div>Expanded Game Info</div>;
  }
}

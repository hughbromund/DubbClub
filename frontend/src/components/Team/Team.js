import React, { Component } from "react";

import { NBA, MLB, EPL } from "../../constants/Constants";
import NBATeam from "../NBATeam/NBATeam";
import EPLTeam from "../EPLTeam/EPLTeam";
import MLBTeam from "../MLBTeam/MLBTeam";

export default class ExpandedGameInfo extends Component {
  render() {
    if (this.props.match.params.league.toUpperCase() === NBA) {
      return <NBATeam />;
    } else if (this.props.match.params.league.toUpperCase() === EPL) {
      return <EPLTeam />;
    } else if (this.props.match.params.league.toUpperCase() === MLB) {
      return <MLBTeam />;
    }

    return <div>Expanded Game Info</div>;
  }
}

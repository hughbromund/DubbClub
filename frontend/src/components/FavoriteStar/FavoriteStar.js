import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../contexts/AuthContext.js";

import { FAVORITE_TEAM, UNFAVORITE_TEAM } from "../../constants/Constants";

export default class FavoriteStar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "far",
    };
  }

  async favoriteTeam(teamId) {
    var res = await fetch(FAVORITE_TEAM, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        league: "NBA",
        teamId: teamId,
      }),
    });
    // console.log(res);
    if (res.status !== 200) {
      return false;
    }

    await this.context.refreshFavoriteTeams();
    return true;
  }

  async unFavoriteTeam(teamId) {
    var res = await fetch(UNFAVORITE_TEAM, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.context.token,
      },
      body: JSON.stringify({
        league: "NBA",
        teamId: teamId,
      }),
    });
    // console.log(res);
    if (res.status !== 200) {
      return false;
    }

    await this.context.refreshFavoriteTeams();
    return true;
  }

  componentDidMount() {
    if (this.context.isFollowedTeam("NBA", this.props.id)) {
      this.setState({ type: "fas" });
    }
  }

  render() {
    if (!this.context.isLoggedIn) {
      return <div />;
    } else if (this.context.isFollowedTeam("NBA", this.props.id)) {
      return (
        <FontAwesomeIcon
          icon={[this.state.type, "star"]}
          onMouseEnter={() => this.setState({ type: "far" })}
          onMouseLeave={() => this.setState({ type: "fas" })}
          onClick={() => this.unFavoriteTeam(this.props.id)}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={[this.state.type, "star"]}
          icon={[this.state.type, "star"]}
          onMouseEnter={() => this.setState({ type: "fas" })}
          onMouseLeave={() => this.setState({ type: "far" })}
          onClick={() => this.favoriteTeam(this.props.id)}
        />
      );
    }
  }
}
FavoriteStar.contextType = AuthContext;

import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../contexts/AuthContext.js";
import Spinner from "react-bootstrap/Spinner";

import { FAVORITE_TEAM, UNFAVORITE_TEAM } from "../../constants/Constants";

export default class FavoriteStar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "far",
      loading: false,
    };
  }

  async favoriteTeam(teamId) {
    this.setState({ loading: true });
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
      this.setState({ loading: false });

      return false;
    }

    await this.context.refreshFavoriteTeams();
    this.setState({ loading: false });
    return true;
  }

  async unFavoriteTeam(teamId) {
    this.setState({ loading: true });

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
      this.setState({ loading: false });
      return false;
    }

    await this.context.refreshFavoriteTeams();
    this.setState({ loading: false });
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
    } else if (this.state.loading) {
      return <Spinner animation="grow" size="sm" />;
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

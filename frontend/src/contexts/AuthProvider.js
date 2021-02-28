import AuthContext from "./AuthContext";
import React, { Component } from "react";

import {
  REFRESH_TOKEN,
  TOKEN_KEY,
  USERNAME_KEY,
  GET_FAVORITE_TEAMS_LIST,
} from "../constants/Constants";
// Attempt to refresh the token 10000ms (10s) before it expires
const TOKEN_REFRESH_MARGIN = 10000;

export default class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.tokenExpireTime = null;
    this.timeoutID = null;

    this.state = {
      isLoggedIn: false,
      username: "",
      token: null,
      favoriteTeams: null,
    };
    this.refreshToken = this.refreshToken.bind(this);
  }

  async getFavoriteTeams(token) {
    var res = await fetch(GET_FAVORITE_TEAMS_LIST, {
      method: "GET",
      mode: "cors",
      headers: {
        "x-access-token": token,
      },
    });

    var body = await res.json();
    // console.log(body.favoriteTeams);
    this.setState({
      favoriteTeams: body.favoriteTeams,
    });

    return;
  }

  async refreshToken() {
    console.log("Attempting to Refresh Token");
    var token = localStorage.getItem(TOKEN_KEY);
    var username = localStorage.getItem(USERNAME_KEY);
    if (token === null) {
      this.setState({
        isLoggedIn: false,
        username: "",
        token: null,
      });
      return;
    }
    var res = await fetch(REFRESH_TOKEN, {
      method: "POST",
      mode: "cors",
      headers: {
        "x-access-token": token,
      },
    });
    if (res.status !== 200) {
      this.setState({ isLoggedIn: false, username: "", token: null });
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
      return;
    }
    var body = await res.json();
    // localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, body.accessToken);
    this.setState({
      isLoggedIn: true,
      username: username,
      token: body.accessToken,
    });
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.refreshToken();
    }, body.expiresIn * 1000 - TOKEN_REFRESH_MARGIN);
    console.log("Token Successfully Refreshed");
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          username: this.state.username,
          token: this.state.token,
          refreshFavoriteTeams: async () => {
            await this.getFavoriteTeams(this.state.token);
            return;
          },
          isFollowedTeam: (league, teamId) => {
            if (this.state.favoriteTeams === null) {
              return false;
            }
            if (this.state.favoriteTeams[league] === undefined) {
              return false;
            }

            var teams = this.state.favoriteTeams[league];
            // console.log(teams);
            return teams.includes(teamId);
          },
          logout: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USERNAME_KEY);

            this.setState({ isLoggedIn: false, username: "", token: null });
          },
          login: async (expiresIn, username, accessToken) => {
            // console.log(expiresIn);
            this.tokenExpireTime = expiresIn;
            await this.getFavoriteTeams(accessToken);
            this.setState({
              isLoggedIn: true,
              username: username,
              token: accessToken,
            });

            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(USERNAME_KEY, username);

            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
              this.refreshToken();
            }, expiresIn * 1000 - TOKEN_REFRESH_MARGIN);
          },
          verifyLogin: async () => {
            console.log("Verifying Login");

            var token = localStorage.getItem(TOKEN_KEY);
            var username = localStorage.getItem(USERNAME_KEY);
            // if there is no token in local storage then the user can't be logged in
            if (token === null) {
              this.setState({
                isLoggedIn: false,
                username: "",
                token: null,
              });
              console.log("No Token Found... User Not Logged In");
              return;
            }
            // if there is a token, we need to verify that it still works
            var res = await fetch(REFRESH_TOKEN, {
              method: "POST",
              mode: "cors",
              headers: {
                "x-access-token": token,
              },
            });

            // We had a token, but it doesn't work
            if (res.status !== 200) {
              this.setState({ isLoggedIn: false, username: "" });
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USERNAME_KEY);
              console.log("Bad Token... User Not Logged In");
              return;
            }

            // We had a token, and it works, but now we refreshed it
            var body = await res.json();

            await this.getFavoriteTeams(body.accessToken);
            // localStorage.removeItem(TOKEN_KEY);
            localStorage.setItem(TOKEN_KEY, body.accessToken);
            this.setState({
              isLoggedIn: true,
              username: username,
              token: body.accessToken,
            });
            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
              this.refreshToken();
            }, body.expiresIn * 1000 - TOKEN_REFRESH_MARGIN);
            console.log("Token Refreshed and User Logged In");
          },
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

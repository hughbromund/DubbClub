import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React, { Component } from "react";

import AuthContext from "./contexts/AuthContext";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Voting from "./components/Voting/Voting";
import Register from "./components/Register/Register";
import ExpandedGameInfo from "./components/ExpandedGameInfo/ExpandedGameInfo";
import NBAStandings from "./components/NBAStandings/NBAStandings";
import GameInfoCard from "./components/GameInfoCard/GameInfoCard";
import Dashboard from "./components/Dashboard/Dashboard";
import Search from "./components/Search/Search";
import AutoSearch from "./components/AutoSearch/AutoSearch";
import Account from "./components/Account/Account";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import PredictionGraph from "./components/PredictionGraph/PredictionGraph";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import Team from "./components/Team/Team";
import Player from "./components/Player/Player";

import "./constants/Constants";

import classes from "./App.module.css";

// Initialization of Fontawesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  SEARCH_ROUTE,
  GAME_INFO_ROUTE,
  ACCOUNT_ROUTE,
  DASHBOARD_ROUTE,
  RESET_PASSWORD_ROUTE,
  VOTING_ROUTE,
  NBA_STANDINGS_ROUTE,
  GRAPH_TEST,
  VERIFY_EMAIL_ROUTE,
  TEAM_INFO_ROUTE,
  PLAYER_INFO_ROUTE,
} from "./constants/Constants";
library.add(fab);
library.add(fas);
library.add(far);
class App extends Component {
  componentDidMount() {
    console.log("App Mounted");

    // When the website starts, we need to see if the user is logged in already or not
    this.context.verifyLogin();
  }

  render() {
    // console.log(this.context.isLoggedIn);
    return (
      <div>
        <Router>
          <Navigation />

          <div className={classes.App}>
            <Switch>
              <Route exact path={HOME_ROUTE} component={Home} />
              <Route path={LOGIN_ROUTE} component={Login} />
              <Route path={REGISTER_ROUTE} component={Register} />
              <Route path={SEARCH_ROUTE + "/:query?"} component={AutoSearch} />
              <Route path={VOTING_ROUTE} component={Voting} />
              <Route path={NBA_STANDINGS_ROUTE} component={NBAStandings} />
              <Route
                path={RESET_PASSWORD_ROUTE + "/:resetHash?"}
                component={ResetPassword}
              />
              <Route
                exact
                path={GAME_INFO_ROUTE + "/:id"}
                component={ExpandedGameInfo}
              />
              <Route
                exact
                path={TEAM_INFO_ROUTE + "/:league?" + "/:id?"}
                component={Team}
              />
              <Route
                exact
                path={PLAYER_INFO_ROUTE + "/:id?"}
                component={Player}
              />
              <Route path={GRAPH_TEST} component={PredictionGraph} />
              <Route
                path={VERIFY_EMAIL_ROUTE + "/:hash"}
                component={VerifyEmail}
              />
              {this.context.isLoggedIn === true ? (
                <Switch>
                  <Route path={DASHBOARD_ROUTE} component={Dashboard} />
                  <Route path={ACCOUNT_ROUTE} component={Account} />
                </Switch>
              ) : (
                ""
              )}
              <Route path="*" component={Login} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
App.contextType = AuthContext;

export default App;

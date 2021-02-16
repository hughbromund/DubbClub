import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React, { Component } from "react";

import AuthContext from "./contexts/AuthContext";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import "./constants/Constants";

import classes from "./App.module.css";

// Initialization of Fontawesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "./constants/Constants";
library.add(fab);
library.add(fas);

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
              {this.context.isLoggedIn === true ? (
                <Route path="/dashboard" component={Dashboard} />
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

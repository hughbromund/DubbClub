import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../../assets/LogoWordmarkWhite.png";
import {
  ACCOUNT_ROUTE,
  DASHBOARD_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  NBA_STANDINGS_ROUTE,
  REGISTER_ROUTE,
  SEARCH_ROUTE,
  VOTING_ROUTE,
} from "../../constants/Constants";
import AuthContext from "../../contexts/AuthContext.js";
import classes from "./Navigation.module.css";

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.setExpanded = this.setExpanded.bind(this);
  }

  setExpanded(value) {
    this.setState({ expanded: value });
  }

  render() {
    return (
      <div className={classes.NavigationWrapper}>
        <Navbar
          expanded={this.state.expanded}
          className={classes.Navigation}
          variant="dark"
          expand="lg"
          sticky="top"
        >
          <Navbar.Brand
            onClick={() => this.setExpanded(false)}
            as={Link}
            to={HOME_ROUTE}
          >
            <img alt="Dubb Club Logo" src={logo} width="200" />
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() =>
              this.setExpanded(this.state.expanded ? false : "expanded")
            }
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to={HOME_ROUTE}
              >
                Home
              </Nav.Link>
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to={DASHBOARD_ROUTE}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to={SEARCH_ROUTE}
              >
                Search
              </Nav.Link>
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to={NBA_STANDINGS_ROUTE}
              >
                Standings
              </Nav.Link>
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to={VOTING_ROUTE}
              >
                Voting
              </Nav.Link>
              <Nav.Link>
                Version:{" "}
                {process.env.REACT_APP_VERSION
                  ? process.env.REACT_APP_VERSION
                  : "Local"}
              </Nav.Link>
            </Nav>
            <Nav>
              {this.context.isLoggedIn === true ? (
                <Nav.Link
                  onClick={() => this.setExpanded(false)}
                  as={Link}
                  to={ACCOUNT_ROUTE}
                >
                  <b>{this.context.username}</b>{" "}
                  <FontAwesomeIcon icon={["fas", "user"]} />
                </Nav.Link>
              ) : (
                <Nav>
                  <Nav.Link
                    onClick={() => this.setExpanded(false)}
                    as={Link}
                    to={LOGIN_ROUTE}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => this.setExpanded(false)}
                    as={Link}
                    to={REGISTER_ROUTE}
                  >
                    Sign Up
                  </Nav.Link>
                </Nav>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
Navigation.contextType = AuthContext;

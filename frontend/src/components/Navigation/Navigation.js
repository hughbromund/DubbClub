import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoWordmarkWhite.png";

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
            to="/"
          >
            <img alt="" src={logo} width="200" />
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() =>
              this.setExpanded(this.state.expanded ? false : "expanded")
            }
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link>Home</Nav.Link>
              <Nav.Link>Dashboard</Nav.Link>
              <Nav.Link>Search</Nav.Link>
              <Nav.Link
                onClick={() => this.setExpanded(false)}
                as={Link}
                to="/login"
              >
                Login
              </Nav.Link>
              <Nav.Link>
                Version:{" "}
                {process.env.REACT_APP_VERSION
                  ? process.env.REACT_APP_VERSION
                  : "Local"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

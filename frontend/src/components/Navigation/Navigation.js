import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoWordmarkWhite.png";

import classes from "./Navigation.module.css";

export default class Navigation extends Component {
  render() {
    return (
      <div className={classes.NavigationWrapper}>
        <Navbar
          className={classes.Navigation}
          variant="dark"
          expand="lg"
          sticky="top"
        >
          <Navbar.Brand as={Link} to="/">
            <img alt="" src={logo} width="200" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link>Home</Nav.Link>
              <Nav.Link>Dashboard</Nav.Link>
              <Nav.Link>Search</Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

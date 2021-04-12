import React, { Component } from "react";
import logo from "../../assets/LogoWordmarkWhite.png";
import AuthContext from "../../contexts/AuthContext.js";
import Button from "../Button/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import LinkButton from "../LinkButton/LinkButton";

import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "../../constants/Constants";

import classes from "./Masthead.module.css";

export default class Masthead extends Component {
  render() {
    return (
      <div className={classes.Masthead}>
        <div className={classes.CenterAlign}>
          <img alt="Dubb Club Logo" src={logo} width={"40%"} />
          <br />
          <h3>
            <b>
              Dubb Club brings all the sports you love together in one place!
            </b>
          </h3>
          <h4>
            Live Games | Live Predictions | Live Stats - It's all on Dubb Club
          </h4>
          <br />
          {this.context.isLoggedIn === false ? (
            <div>
              <div className={classes.ButtonWidth}>
                <Row>
                  <Col>
                    <LinkButton to={LOGIN_ROUTE}>Login</LinkButton>
                  </Col>
                  <Col>
                    <LinkButton to={REGISTER_ROUTE}> Sign Up</LinkButton>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div className={classes.ButtonWidth}>
              <LinkButton to={DASHBOARD_ROUTE}> Dashboard</LinkButton>
            </div>
          )}
        </div>
      </div>
    );
  }
}
Masthead.contextType = AuthContext;

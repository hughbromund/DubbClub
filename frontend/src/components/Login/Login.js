import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Expand from "react-expand-animated";
import logo from "../../assets/Logo.png";
import {
  ACCOUNT_ROUTE,
  LOGIN,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "../../constants/Constants";
import AuthContext from "../../contexts/AuthContext.js";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import SmartButton from "../SmartButton/SmartButton";
import classes from "./Login.module.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    // this.timeoutID = null;

    this.state = {
      username: "",
      password: "",
      error: "",
    };
  }

  render() {
    return (
      <div>
        <Container className={classes.Login}>
          <div>
            <div className={classes.logoAlign}>
              <img alt="Dubb Club Logo" src={logo} width="75" />
              <br />
              <h4 className={classes.Header}>
                <b>Sign In to Dubb Club</b>
              </h4>
            </div>
            <Expand open={this.state.error !== ""}>
              <div className={classes.alertDiv}>
                <Alert>{this.state.error}</Alert>
              </div>
            </Expand>
            <Card>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  required
                  placeholder="Email or Username"
                  type="text"
                  autoCapitalize="none"
                  onChange={(e) => {
                    this.setState({
                      username: e.target.value,
                    });
                  }}
                ></input>
                <input
                  required
                  placeholder="Password"
                  type="password"
                  onChange={(e) => {
                    this.setState({
                      password: e.target.value,
                    });
                  }}
                ></input>
                <br />
                <br />
                <div className={classes.ButtonAlign}>
                  <SmartButton
                    disabled={
                      this.state.username === "" || this.state.password === ""
                    }
                    runOnClick={async () => {
                      var res = await fetch(LOGIN, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          username: this.state.username,
                          password: this.state.password,
                        }),
                      });

                      var body = await res.json();
                      // console.log(res);
                      // console.log(body);

                      if (res.status !== 200) {
                        this.setState({
                          error: body.message,
                        });
                        return false;
                      }

                      this.context.login(
                        body.expiresIn,
                        body.username,
                        body.accessToken
                      );
                      // Push the Login Route after the user has successfully made an account
                      // Only push this route if the user is on the Login Route, otherwise let the router
                      // put the user back on whatever page they were already on
                      if (this.props.location.pathname === LOGIN_ROUTE) {
                        setTimeout(() => {
                          this.props.history.push(ACCOUNT_ROUTE);
                        }, 2000);
                      }

                      this.setState({
                        error: "",
                      });
                      return true;
                    }}
                  >
                    Login
                  </SmartButton>
                </div>
              </form>
            </Card>
            <div className={classes.buttonGroup}>
              <Row>
                <Col>
                  <Button
                    variant="outline"
                    onClick={() => {
                      this.props.history.push(RESET_PASSWORD_ROUTE);
                    }}
                  >
                    Forgot Password
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline"
                    onClick={() => {
                      this.props.history.push(REGISTER_ROUTE);
                    }}
                  >
                    Create an Account
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
Login.contextType = AuthContext;

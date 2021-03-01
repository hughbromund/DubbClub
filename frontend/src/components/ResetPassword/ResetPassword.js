import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Card from "../Card/Card";
import Alert from "../Alert/Alert";
import SmartButton from "../SmartButton/SmartButton";
import Button from "../Button/Button";
import logo from "../../assets/Logo.png";
import Expand from "react-expand-animated";

import classes from "./ResetPassword.module.css";

import {
  LOGIN_ROUTE,
  RESET_PASSWORD,
  RESET_PASSWORD_EMAIL,
} from "../../constants/Constants";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      error: "",
      message: "",
      password: "",
      confirmPassword: "",
    };
  }

  render() {
    if (this.props.match.params.resetHash === undefined) {
      return (
        <div>
          <Container className={classes.ResetPassword}>
            <div>
              <div className={classes.logoAlign}>
                <img alt="Dubb Club Logo" src={logo} width="75" />
                <br />
                <h4 className={classes.Header}>
                  <b>Reset Your Password</b>
                </h4>
              </div>
              <Expand open={this.state.error !== ""}>
                <div className={classes.alertDiv}>
                  <Alert>{this.state.error}</Alert>
                </div>
              </Expand>
              <Expand open={this.state.message !== ""}>
                <div className={classes.alertDiv}>
                  <Alert variant={"success"}>{this.state.message}</Alert>
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

                  <br />
                  <br />
                  {this.state.username}
                  <div className={classes.ButtonAlign}>
                    <SmartButton
                      disabled={this.state.username === ""}
                      runOnClick={async () => {
                        var res = await fetch(RESET_PASSWORD_EMAIL, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            username: this.state.username,
                          }),
                        });

                        var body = await res.json();
                        // console.log(res);
                        // console.log(body);
                        if (res.status !== 200) {
                          this.setState({
                            message: "",
                            error: body.message,
                          });
                          return false;
                        }
                        this.setState({
                          error: "",
                          message: body.message,
                        });

                        return true;
                      }}
                    >
                      Submit
                    </SmartButton>
                  </div>
                </form>
              </Card>
            </div>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <Container className={classes.ResetPassword}>
            <div>
              <div className={classes.logoAlign}>
                <img alt="Dubb Club Logo" src={logo} width="75" />
                <br />
                <h4 className={classes.Header}>
                  <b>Enter Your New Password</b>
                </h4>
              </div>
              <Expand open={this.state.error !== ""}>
                <div className={classes.alertDiv}>
                  <Alert>{this.state.error}</Alert>
                </div>
              </Expand>
              <Expand open={this.state.message !== ""}>
                <div className={classes.alertDiv}>
                  <Alert variant={"success"}>
                    <div>{this.state.message}</div>
                  </Alert>
                  <br />
                  <Button
                    onClick={() => {
                      this.props.history.push(LOGIN_ROUTE);
                    }}
                  >
                    Navigate to Login
                  </Button>
                </div>
              </Expand>
              <Expand open={this.state.message === ""}>
                <Card>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <input
                      required
                      placeholder="New Password"
                      type="password"
                      onChange={(e) => {
                        this.setState({
                          password: e.target.value,
                        });
                      }}
                    ></input>
                    <input
                      required
                      placeholder="Confirm New Password"
                      type="password"
                      onChange={(e) => {
                        this.setState({
                          confirmPassword: e.target.value,
                        });
                      }}
                    ></input>

                    <br />
                    <br />
                    {this.state.username}
                    <div className={classes.ButtonAlign}>
                      <SmartButton
                        disabled={
                          this.state.password === "" ||
                          this.state.confirmPassword === "" ||
                          this.state.password !== this.state.confirmPassword
                        }
                        runOnClick={async () => {
                          var res = await fetch(RESET_PASSWORD, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              hash: this.props.match.params.resetHash,
                              password: this.state.password,
                            }),
                          });

                          var body = await res.json();
                          // console.log(res);
                          // console.log(body);
                          if (res.status !== 200) {
                            this.setState({
                              message: "",
                              error: body.message,
                            });
                            return false;
                          }
                          this.setState({
                            error: "",
                            message: body.message,
                          });

                          return true;
                        }}
                      >
                        Submit
                      </SmartButton>
                    </div>
                  </form>
                </Card>
              </Expand>
            </div>
          </Container>
        </div>
      );
    }
  }
}

import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Expand from "react-expand-animated";
import logo from "../../assets/Logo.png";
import { LOGIN_ROUTE, SIGNUP } from "../../constants/Constants";
import Alert from "../Alert/Alert";
import Card from "../Card/Card";
import SmartButton from "../SmartButton/SmartButton";
import classes from "./Register.module.css";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
    };
    this.validateInput = this.validateInput.bind(this);
    // console.log(SIGNUP);
  }

  validateInput() {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.confirmPassword === "" ||
      this.state.email === ""
    ) {
      return false;
    }
    if (this.state.password !== this.state.confirmPassword) {
      return false;
    }

    return true;
  }

  render() {
    return (
      <div>
        <Container className={classes.Register}>
          <div>
            <div className={classes.logoAlign}>
              <img alt="" src={logo} width="75" />
              <br />
              <h4 className={classes.Header}>
                <b>Sign Up for Dubb Club</b>
              </h4>
            </div>
            <Expand open={this.state.error === "" ? false : true}>
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
                  placeholder="Username"
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
                  placeholder="Email"
                  type="text"
                  onChange={(e) => {
                    this.setState({
                      email: e.target.value,
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
                <input
                  required
                  placeholder="Confirm Password"
                  type="password"
                  onChange={(e) => {
                    if (e.target.value !== this.state.password) {
                      this.setState({
                        confirmPassword: e.target.value,
                        error: "Passwords must Match",
                      });
                    } else {
                      this.setState({
                        confirmPassword: e.target.value,
                        error: "",
                      });
                    }
                  }}
                ></input>
                <br />
                <br />
                <div className={classes.ButtonAlign}>
                  <SmartButton
                    disabled={!this.validateInput()}
                    runOnClick={async () => {
                      var res = await fetch(SIGNUP, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          username: this.state.username,
                          email: this.state.email,
                          password: this.state.password,
                        }),
                      });

                      var body = await res.json();
                      //   console.log(res);
                      //   console.log(body);

                      if (res.status !== 200) {
                        this.setState({
                          error: body.message,
                        });
                        return false;
                      }
                      this.setState({
                        error: "",
                      });
                      // Push the Login Route after the user has successfully made an account
                      setTimeout(() => {
                        this.props.history.push(LOGIN_ROUTE);
                      }, 2000);
                      return true;
                    }}
                  >
                    Join
                  </SmartButton>
                </div>
              </form>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

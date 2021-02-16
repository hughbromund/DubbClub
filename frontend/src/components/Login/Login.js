import React, { Component } from "react";

import AuthContext from "../../contexts/AuthContext.js";

import Container from "react-bootstrap/Container";
import Card from "../Card/Card";
import Alert from "../Alert/Alert";
import SmartButton from "../SmartButton/SmartButton";
import logo from "../../assets/Logo.png";
import Expand from "react-expand-animated";

import classes from "./Login.module.css";

import { LOGIN, TOKEN_KEY } from "../../constants/Constants";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
    };
  }

  render() {
    // console.log(this.context);
    return (
      <div>
        <Container className={classes.Login}>
          <div>
            <div className={classes.logoAlign}>
              <img alt="" src={logo} width="75" />
              <br />
              <h4 className={classes.Header}>
                <b>Sign In to Dubb Club</b>
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
                  placeholder="Email or Username"
                  type="text"
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
                      this.setState({
                        error: "",
                      });
                      localStorage.setItem(TOKEN_KEY, body.accessToken);
                      this.context.login(body.expiresIn);
                      return true;
                    }}
                  >
                    Login
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
Login.contextType = AuthContext;

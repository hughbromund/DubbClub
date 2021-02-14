import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Card from "../Card/Card";
import Alert from "../Alert/Alert";
import SmartButton from "../SmartButton/SmartButton";
import logo from "../../assets/Logo.png";
import Expand from "react-expand-animated";

import classes from "./Login.module.css";

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
                      var res = await fetch(
                        "https://dubbclub.free.beeceptor.com "
                      );
                      // console.log(res);
                      this.setState({
                        error: "Invalid Username or Password",
                      });

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

import React, { Component } from "react";

import AuthContext from "../../contexts/AuthContext.js";

import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";
import Card from "../Card/Card";
import Container from "react-bootstrap/Container";
import Expand from "react-expand-animated";

import classes from "./Account.module.css";

import {
  USER_INFO,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
} from "../../constants/Constants";

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      newEmail: "",
      newPassword: "",
      newPasswordConfirm: "",
    };

    this.fetchUserInfo = this.fetchUserInfo.bind(this);
  }

  async fetchUserInfo() {
    var res = await fetch(USER_INFO, {
      headers: {
        "x-access-token": this.context.token,
      },
    });
    // console.log(res);

    var body = await res.json();
    console.log(body);

    this.setState({
      username: body.username,
      email: body.email,
      newEmail: body.email,
      newPassword: "",
      newPasswordConfirm: "",
    });
  }

  async componentDidMount() {
    this.fetchUserInfo();
  }

  render() {
    return (
      <div>
        <Container className={classes.Account}>
          <div className={classes.headerAlign}>
            <h4>Your Account</h4>
            <h3>
              <b>{this.state.username}</b>
            </h3>
          </div>
          <Card>
            <div>
              <b>Username</b>
            </div>
            <input
              className={classes.usernameInput}
              readOnly
              defaultValue={this.state.username}
            ></input>
            <div>
              <b>Email</b>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                value={this.state.newEmail}
                onChange={(e) => {
                  this.setState({
                    newEmail: e.target.value,
                  });
                }}
              ></input>
              <Expand open={this.state.email !== this.state.newEmail}>
                <SmartButton
                  runOnClick={async () => {
                    var res = await fetch(UPDATE_EMAIL, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                      body: JSON.stringify({
                        email: this.state.newEmail,
                      }),
                    });

                    if (res.status !== 200) {
                      return false;
                    }
                    // var body = await res.json();
                    // console.log(res);
                    // console.log(body);
                    this.fetchUserInfo();
                    return true;
                  }}
                >
                  Save Changes
                </SmartButton>
              </Expand>
            </form>
            <div>
              <b>Password</b>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                value={this.state.newPassword}
                type="password"
                placeholder="New Password"
                onChange={(e) => {
                  this.setState({
                    newPassword: e.target.value,
                  });
                }}
              ></input>
              <input
                value={this.state.newPasswordConfirm}
                type="password"
                placeholder="Confirm New Password"
                onChange={(e) => {
                  this.setState({
                    newPasswordConfirm: e.target.value,
                  });
                }}
              ></input>
              <Expand
                open={
                  this.state.newPassword !== "" &&
                  this.state.newPasswordConfirm !== "" &&
                  this.state.newPassword === this.state.newPasswordConfirm
                }
              >
                <SmartButton
                  runOnClick={async () => {
                    var res = await fetch(UPDATE_PASSWORD, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                      body: JSON.stringify({
                        password: this.state.newPassword,
                      }),
                    });

                    if (res.status !== 200) {
                      return false;
                    }
                    // var body = await res.json();
                    // console.log(res);
                    // console.log(body);
                    this.fetchUserInfo();
                    return true;
                  }}
                >
                  Save Changes
                </SmartButton>
              </Expand>
            </form>
            <br />

            <Button
              variant="error"
              onClick={() => {
                this.context.logout();
              }}
            >
              Logout
            </Button>
          </Card>
        </Container>
      </div>
    );
  }
}
Account.contextType = AuthContext;

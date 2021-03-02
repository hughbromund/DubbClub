import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Expand from "react-expand-animated";
import {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  USER_INFO,
} from "../../constants/Constants";
import AuthContext from "../../contexts/AuthContext.js";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import SmartButton from "../SmartButton/SmartButton";
import classes from "./Account.module.css";

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      newEmail: "",
      newPassword: "",
      newPasswordConfirm: "",
      error: "",
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
    // console.log(body);

    this.setState({
      username: body.username,
      email: body.email,
      newEmail: body.email,
      newPassword: "",
      newPasswordConfirm: "",
      error: "",
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
          <Expand open={this.state.error !== ""}>
            <div className={classes.alertDiv}>
              <Alert>{this.state.error}</Alert>
            </div>
          </Expand>
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
                  disabled={this.state.email === this.state.newEmail}
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

                    var body = await res.json();

                    if (res.status !== 200) {
                      this.setState({ error: body.message });
                      return false;
                    }

                    // console.log(res);
                    // console.log(body);
                    this.fetchUserInfo();
                    this.setState({ error: "" });
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
                  disabled={
                    !(
                      this.state.newPassword !== "" &&
                      this.state.newPasswordConfirm !== "" &&
                      this.state.newPassword === this.state.newPasswordConfirm
                    )
                  }
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
                    var body = await res.json();

                    if (res.status !== 200) {
                      this.setState({ error: body.message });
                      return false;
                    }

                    // console.log(res);
                    // console.log(body);
                    this.fetchUserInfo();
                    this.setState({ error: "" });
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

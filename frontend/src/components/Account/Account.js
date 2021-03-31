import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Expand from "react-expand-animated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  USER_INFO,
  UPDATE_PHONE_NUMBER,
  UPDATE_NOTIFICATIONS,
  UPDATE_SPOILERS,
  SEND_VERIFY_EMAIL,
} from "../../constants/Constants";
import AuthContext from "../../contexts/AuthContext.js";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import SmartButton from "../SmartButton/SmartButton";
import classes from "./Account.module.css";

var classNames = require("classnames");

export default class Account extends Component {
  constructor(props) {
    super(props);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(tz);

    this.state = {
      username: "",
      email: "",
      newEmail: "",
      newPassword: "",
      newPasswordConfirm: "",
      phoneNumber: "",
      newPhoneNumber: "",
      error: "",
      warnings: [],
      verify: { email: true },
      verifyEmailLabel: "Verify Email",
      emailNotifications: false,
      smsNotifications: false,
      hideSpoilers: false,
      userTimeZone: tz,
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

    var warnings = [];
    var tempPhoneNumber = "";

    if (body.phoneNumber === "none") {
      warnings.push(
        "No Phone Number Set. Please add a Phone Number to your account. "
      );
    } else {
      tempPhoneNumber = body.phoneNumber.substring(
        body.phoneNumber.length - 10
      );
    }

    if (body.verify.email === false) {
      warnings.push("Email Not Verified. Please Verify Your Email below.");
    }

    this.setState({
      username: body.username,
      email: body.email,
      newEmail: body.email,
      hideSpoilers: body.hideSpoilers,
      phoneNumber: tempPhoneNumber,
      newPhoneNumber: tempPhoneNumber,
      newPassword: "",
      newPasswordConfirm: "",
      emailNotifications: body.notifications.email,
      smsNotifications: body.notifications["SMS"],
      verify: body.verify,
      error: "",
      warnings: warnings,
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
          <Expand open={this.state.warnings.length !== 0}>
            {this.state.warnings.map((warning, index) => (
              <div className={classes.alertDiv}>
                <Alert variant="warning" key={"warning-" + index}>
                  {warning}
                </Alert>
              </div>
            ))}
          </Expand>
          <Card static={true}>
            <div>
              <b>Username</b>
            </div>
            <div className={classes.InputAddOn}>
              <span className={classes.InputAddOnitem}>
                <FontAwesomeIcon icon={["fas", "user"]} />
              </span>
              <input
                className={classNames(
                  classes.usernameInput,
                  classes.InputAddOnfield
                )}
                readOnly
                defaultValue={this.state.username}
              ></input>
            </div>
            <div className={classes.descriptionText}>
              Your username is unique to you and can't be changed.
            </div>
            <div>
              <b>Email</b>{" "}
              <FontAwesomeIcon
                icon={["fas", "check"]}
                hidden={!this.state.verify.email}
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={classes.InputAddOn}>
                <span className={classes.InputAddOnitem}>
                  <FontAwesomeIcon icon={["fas", "envelope"]} />
                </span>
                <input
                  value={this.state.newEmail}
                  className={classes.InputAddOnfield}
                  onChange={(e) => {
                    this.setState({
                      newEmail: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <div className={classes.descriptionText}>
                Your email is used to reset your password and send you
                notifications. You can disable notifications at any time.
              </div>
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
              <Expand open={!this.state.verify.email}>
                <SmartButton
                  disabled={this.state.verify.email}
                  runOnClick={async () => {
                    var res = await fetch(SEND_VERIFY_EMAIL, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                    });

                    var body = await res.json();

                    if (res.status !== 200) {
                      this.setState({ error: body.message });
                      return false;
                    }

                    // console.log(res);
                    // console.log(body);
                    this.fetchUserInfo();
                    this.setState({
                      error: "",
                      verifyEmailLabel: "Email Sent",
                    });
                    return true;
                  }}
                >
                  {this.state.verifyEmailLabel}
                </SmartButton>
              </Expand>
            </form>
            <div>
              <b>Phone Number</b>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={classes.InputAddOn}>
                <span className={classes.InputAddOnitem}>
                  <b>+1</b>
                </span>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={this.state.newPhoneNumber}
                  onChange={(e) => {
                    this.setState({ newPhoneNumber: e.target.value });
                  }}
                  className={classes.InputAddOnfield}
                ></input>
              </div>
              <div className={classes.descriptionText}>
                Your phone number is used to send notifications about upcoming
                games. You can disable notifications at any time. Only +1
                Country Codes are currently supported.
              </div>
              <Expand
                open={this.state.phoneNumber !== this.state.newPhoneNumber}
              >
                <SmartButton
                  disabled={
                    this.state.phoneNumber === this.state.newPhoneNumber
                  }
                  runOnClick={async () => {
                    var res = await fetch(UPDATE_PHONE_NUMBER, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                      body: JSON.stringify({
                        phoneNumber: this.state.newPhoneNumber,
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
            <hr />
            <div>
              <b>Notification Settings</b>
            </div>
            <Row>
              <Col>
                <SmartButton
                  variant={this.state.emailNotifications ? "" : "outline"}
                  runOnClick={async () => {
                    var res = await fetch(UPDATE_NOTIFICATIONS, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                      body: JSON.stringify({
                        sms: this.state.smsNotifications,
                        email: !this.state.emailNotifications,
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
                  Email {this.state.emailNotifications ? "On" : "Off"}
                </SmartButton>
              </Col>
              <Col>
                <SmartButton
                  variant={this.state.smsNotifications ? "" : "outline"}
                  runOnClick={async () => {
                    var res = await fetch(UPDATE_NOTIFICATIONS, {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.context.token,
                      },
                      body: JSON.stringify({
                        sms: !this.state.smsNotifications,
                        email: this.state.emailNotifications,
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
                  Text Message {this.state.smsNotifications ? "On" : "Off"}
                </SmartButton>
              </Col>
            </Row>
            <br />
            <div>
              <b>Spoiler Settings</b>
            </div>
            <div className={classes.descriptionText}>
              If this option is enabled, Dubb Club will automatically blur live
              games updates as they happen.
            </div>
            <SmartButton
              variant={this.state.hideSpoilers ? "" : "outline"}
              runOnClick={async () => {
                var res = await fetch(UPDATE_SPOILERS, {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": this.context.token,
                  },
                  body: JSON.stringify({
                    hideSpoilers: !this.state.hideSpoilers,
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
              {this.state.hideSpoilers ? "On" : "Off"}
            </SmartButton>
            <br />
            <br />
            <div>
              <b>Time Zone Information</b>
            </div>
            <div>
              Your Time Zone is <b>{this.state.userTimeZone}</b>
            </div>
            <div className={classes.descriptionText}>
              Your Time Zone is determined by your computers local time zone
              information.
            </div>

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

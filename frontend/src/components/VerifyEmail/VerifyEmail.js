import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Expand from "react-expand-animated";
import logo from "../../assets/Logo.png";
import { VERIFY_EMAIL } from "../../constants/Constants";
import Alert from "../Alert/Alert";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import classes from "./VerifyEmail.module.css";

const VERIFYING = 0;
const VERIFIED = 1;
const NOT_VERIFIED = 2;

export default class VerifyEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: VERIFYING,
      error: "",
    };
  }

  async componentDidMount() {
    console.log(this.props.match.params.hash);
    var res = await fetch(VERIFY_EMAIL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash: this.props.match.params.hash,
        test: "Hello",
      }),
    });

    if (res.status === 200) {
      this.setState({ status: VERIFIED });
      return;
    }

    var body = await res.json();

    this.setState({ status: NOT_VERIFIED, error: body.message });
  }

  render() {
    if (this.state.status === VERIFYING) {
      return (
        <div>
          <Container className={classes.VerifyEmail}>
            <div>
              <div className={classes.logoAlign}>
                <img alt="Dubb Club Logo" src={logo} width="75" />
                <br />
                <h4 className={classes.Header}>
                  <b>Verifying Your Email</b>
                </h4>
                <LoadingSpinner />
              </div>
            </div>
          </Container>
        </div>
      );
    }
    if (this.state.status === VERIFIED) {
      return (
        <div>
          <Container className={classes.VerifyEmail}>
            <div>
              <div className={classes.logoAlign}>
                <img alt="Dubb Club Logo" src={logo} width="75" />
                <br />
                <h4 className={classes.Header}>
                  <b>Email Verified</b>
                </h4>
                <Alert variant="success">Email Verified</Alert>
              </div>
            </div>
          </Container>
        </div>
      );
    }
    if (this.state.status === NOT_VERIFIED) {
      return (
        <div>
          <Container className={classes.VerifyEmail}>
            <div>
              <div className={classes.logoAlign}>
                <img alt="Dubb Club Logo" src={logo} width="75" />
                <br />
                <h4 className={classes.Header}>
                  <b>Email Not Verified</b>
                </h4>
                <Alert>{this.state.error}</Alert>
              </div>
            </div>
          </Container>
        </div>
      );
    }
  }
}

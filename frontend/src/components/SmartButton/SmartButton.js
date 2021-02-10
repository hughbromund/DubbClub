import React, { Component } from "react";
import Button from "../Button/Button";
import Spinner from "react-bootstrap/Spinner";

import classes from "./SmartButton.module.css";

const SUCCESS = 0;
const ERROR = 1;
const DEFAULT = 2;
const LOADING = 3;

export default class SmartButton extends Component {
  constructor(props) {
    super(props);

    this.SUCCESS = 0;

    this.state = {
      status: DEFAULT,
      clickCount: 0,
    };
  }
  render() {
    var variant = "primary";
    if (this.state.status === SUCCESS) {
      variant = "success";
    }
    if (this.state.status === ERROR) {
      variant = "error";
    }
    return (
      <Button
        variant={variant}
        disabled={this.state.status === LOADING}
        onClick={async () => {
          this.setState({ status: LOADING });
          var res = await this.props.runOnClick();
          if (res === true) {
            this.setState({ status: SUCCESS });
          } else {
            this.setState({ status: ERROR });
          }
          setTimeout(() => {
            this.setState({
              status: DEFAULT,
            });
          }, 2000);
        }}
      >
        {this.state.status === LOADING ? (
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          this.props.children
        )}{" "}
        + {this.state.status}
      </Button>
    );
  }
}

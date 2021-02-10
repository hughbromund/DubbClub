import React, { Component } from "react";
import Button from "../Button/Button";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./SmartButton.module.css";

const SUCCESS = 0;
const ERROR = 1;
const DEFAULT = 2;
const LOADING = 3;
/**
 * SmartButton's make performing async fetches easier. They take in an async `runOnClick` function.
 * The SmartButton will wait until `runOnClick` returns before allowing the user to click it again.
 *
 * `runOnClick` must return either `true` or `false`. `true` represents a "success" and `false` represents an "error"
 *
 * The SmartButton will change its styling depending on the return value of `runOnClick` and then revert back to the
 * original styling after 2000ms
 */
export default class SmartButton extends Component {
  /**
   *
   * @param {{variant: string, disabled: boolean, runOnClick: function}} props
   */
  constructor(props) {
    super(props);

    this.SUCCESS = 0;

    this.state = {
      status: DEFAULT,
      clickCount: 0,
    };
  }
  render() {
    var variant = this.props.variant;
    if (this.state.status === SUCCESS) {
      variant = "success";
    }
    if (this.state.status === ERROR) {
      variant = "error";
    }
    return (
      <Button
        variant={variant}
        disabled={this.state.status === LOADING || this.props.disabled}
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
        {this.state.status === SUCCESS ? (
          <FontAwesomeIcon icon={["fas", "check"]} color="white" />
        ) : (
          ""
        )}
        {this.state.status === ERROR ? (
          <FontAwesomeIcon icon={["fas", "times"]} color="white" />
        ) : (
          ""
        )}
      </Button>
    );
  }
}

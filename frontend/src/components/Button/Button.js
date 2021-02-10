import React, { Component } from "react";
import classes from "./Button.module.css";

const SUCCESS = "success";
const PRIMARY = "primary";
const ERROR = "error";
export default class Button extends Component {
  render() {
    if (this.props.variant === SUCCESS) {
      return (
        <button
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classes.ButtonSuccess}
        >
          {this.props.children}
        </button>
      );
    }
    if (this.props.variant === ERROR) {
      return (
        <button
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classes.ButtonError}
        >
          {this.props.children}
        </button>
      );
    }
    return (
      <button
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        className={classes.Button}
      >
        {this.props.children}
      </button>
    );
  }
}

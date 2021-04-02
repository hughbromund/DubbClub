import React, { Component } from "react";
import classes from "./Button.module.css";
var classNames = require("classnames");

const SUCCESS = "success";
const PRIMARY = "primary";
const OUTLINE = "outline";
const ERROR = "error";
export default class Button extends Component {
  render() {
    if (this.props.variant === SUCCESS) {
      return (
        <button
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classNames(classes.ButtonSuccess, this.props.className)}
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
          className={classNames(classes.ButtonError, this.props.className)}
        >
          {this.props.children}
        </button>
      );
    }
    if (this.props.variant === OUTLINE) {
      return (
        <button
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classNames(classes.ButtonOutline, this.props.className)}
        >
          {this.props.children}
        </button>
      );
    }
    return (
      <button
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        className={classNames(classes.Button, this.props.className)}
      >
        {this.props.children}
      </button>
    );
  }
}

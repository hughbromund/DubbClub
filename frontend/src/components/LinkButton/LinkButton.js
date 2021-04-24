import React, { Component } from "react";

import { Link } from "react-router-dom";
import classes from "../Button/Button.module.css";
import localClasses from "./LinkButton.module.css";

var classNames = require("classnames");

const SUCCESS = "success";
const PRIMARY = "primary";
const OUTLINE = "outline";
const ERROR = "error";
export default class LinkButton extends Component {
  render() {
    if (this.props.variant === SUCCESS) {
      return (
        <Link
          to={this.props.to}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classNames(
            classes.ButtonSuccess,
            this.props.className,
            localClasses.LinkButton
          )}
        >
          {this.props.children}
        </Link>
      );
    }
    if (this.props.variant === ERROR) {
      return (
        <Link
          to={this.props.to}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classNames(
            classes.ButtonError,
            this.props.className,
            localClasses.LinkButton
          )}
        >
          {this.props.children}
        </Link>
      );
    }
    if (this.props.variant === OUTLINE) {
      return (
        <Link
          to={this.props.to}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={classNames(
            classes.ButtonOutline,
            this.props.className,
            localClasses.LinkButton
          )}
        >
          {this.props.children}
        </Link>
      );
    }
    return (
      <Link
        to={this.props.to}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        className={classNames(
          classes.Button,
          this.props.className,
          localClasses.LinkButton
        )}
      >
        {this.props.children}
      </Link>
    );
  }
}

/**
 * import classes from "./Button.module.css";
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
 */

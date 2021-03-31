import React, { Component } from "react";
import classes from "./Card.module.css";
var classNames = require("classnames");

export default class Card extends Component {
  render() {
    var isStatic = false;
    if (this.props.static === true) {
      isStatic = true;
    }

    if (isStatic) {
      return (
        <div
          className={classNames(
            classes.StaticCard,
            this.props.className === undefined ? "" : this.props.className
          )}
        >
          {this.props.children}
        </div>
      );
    } else {
      return (
        <div
          className={classNames(
            classes.Card,
            this.props.className === undefined ? "" : this.props.className
          )}
        >
          {this.props.children}
        </div>
      );
    }
  }
}

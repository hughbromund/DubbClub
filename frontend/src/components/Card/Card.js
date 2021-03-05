import React, { Component } from "react";
import classes from "./Card.module.css";

export default class Card extends Component {
  render() {
    return (
      <div
        className={[
          classes.Card,
          this.props.className === undefined ? "" : this.props.className,
        ].join(" ")}
      >
        {this.props.children}
      </div>
    );
  }
}

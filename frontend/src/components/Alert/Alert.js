import React, { Component } from "react";
import classes from "./Alert.module.css";

export default class Alert extends Component {
  render() {
    if (this.props.variant === "success") {
      return <div className={classes.AlertSuccess}>{this.props.children}</div>;
    } else if (this.props.variant === "warning") {
      return <div className={classes.AlertWarning}>{this.props.children}</div>;
    } else {
      return <div className={classes.Alert}>{this.props.children}</div>;
    }
  }
}

import React, { Component } from "react";

import classes from "./Alert.module.css";

export default class Alert extends Component {
  render() {
    return <div className={classes.Alert}>{this.props.children}</div>;
  }
}

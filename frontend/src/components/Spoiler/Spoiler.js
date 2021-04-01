import React, { Component } from "react";
import classes from "./Spoiler.module.css";
import AuthContext from "../../contexts/AuthContext.js";

export default class Spoiler extends Component {
  constructor(props) {
    super(props);

    this.getSpoilers = this.getSpoilers.bind(this);
  }

  getSpoilers() {
    if (this.context.hideSpoilers) {
      return classes.blur;
    }
    return "";
  }

  render() {
    return <div className={this.getSpoilers()}>{this.props.children}</div>;
  }
}

Spoiler.contextType = AuthContext;

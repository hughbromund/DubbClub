import React, { Component } from "react";
import classes from "./Spoiler.module.css";
import AuthContext from "../../contexts/AuthContext.js";

export default class Spoiler extends Component {
  constructor(props) {
    super(props);

    this.getSpoilers = this.getSpoilers.bind(this);
    this.state = {
      manualOverride: false,
    };
  }

  getSpoilers() {
    if (this.state.manualOverride) {
      return "";
    }
    if (this.context.hideSpoilers) {
      return classes.blur;
    }
  }

  render() {
    return (
      <div
        onClick={() => this.setState({ manualOverride: true })}
        className={this.getSpoilers()}
      >
        {this.props.children}
      </div>
    );
  }
}

Spoiler.contextType = AuthContext;

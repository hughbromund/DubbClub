import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import classes from "./Tooltip.module.css";

export default class Tooltip extends Component {
  render() {
    return (
      <OverlayTrigger
        placement={this.props.placement ? this.props.placement : "auto"}
        overlay={
          <div className={classes.Tooltip}>
            <b>{this.props.text}</b>
          </div>
        }
      >
        <div>{this.props.children}</div>
      </OverlayTrigger>
    );
  }
}

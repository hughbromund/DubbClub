import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import classes from "./LoadingSpinner.module.css";
import LoadingLogo from "../../assets/LoadingLogo.svg";

export default class LoadingSpinner extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <div className={classes.spinnerContainer}>
            <span>
              <object
                type="image/svg+xml"
                data={LoadingLogo}
                style={{ width: this.props.width || "100px" }}
              />
            </span>
            <h4>
              <b>Loading...</b>
            </h4>
          </div>
        </Container>
      </div>
    );
  }
}

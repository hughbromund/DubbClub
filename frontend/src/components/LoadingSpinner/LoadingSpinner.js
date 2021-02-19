import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import classes from "./LoadingSpinner.module.css";

export default class LoadingSpinner extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <div className={classes.spinnerContainer}>
            <span>
              <Spinner animation="grow" />
            </span>
          </div>
        </Container>
      </div>
    );
  }
}

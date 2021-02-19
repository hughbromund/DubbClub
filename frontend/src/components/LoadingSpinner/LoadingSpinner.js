import React, { Component } from "react";
import { Container, Spinner } from "react-bootstrap";
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

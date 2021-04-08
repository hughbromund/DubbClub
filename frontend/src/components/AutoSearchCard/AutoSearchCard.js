import React, { Component } from "react";
import Card from "../Card/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import classes from "./AutoSearchCard.module.css";

export default class extends Component {
  constructor(props) {
    super(props);

    this.getHighlightedText = this.getHighlightedText.bind(this);
  }

  getHighlightedText(text, highlight) {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }

  render() {
    return (
      <div>
        <Card className={classes.AutoSearchCard}>
          <Row>
            <Col xs={1}>
              <img style={{ width: "100%" }} src={this.props.logo} />
            </Col>
            <Col>
              <h3>
                {this.getHighlightedText(this.props.name, this.props.search)}
              </h3>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

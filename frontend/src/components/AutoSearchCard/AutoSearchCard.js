import React, { Component } from "react";
import Card from "../Card/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LinkButton from "../LinkButton/LinkButton";

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
                ? { fontWeight: "bold", backgroundColor: "#0050dd" }
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
          <Row xs={1} sm={2} md={3}>
            <Col md="auto">
              <img style={{ height: "3rem" }} src={this.props.logo} />
            </Col>
            <Col>
              <h3>
                {this.getHighlightedText(this.props.name, this.props.search)}
              </h3>
            </Col>
            <Col>
              <span style={{ float: "right" }}>
                <LinkButton to={this.props.destination}>More Info</LinkButton>
              </span>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

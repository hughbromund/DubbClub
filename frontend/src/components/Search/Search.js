import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import FormControl from "react-bootstrap/FormControl";
import classes from "./Search.module.css";
import SmartButton from "../SmartButton/SmartButton";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTeam: "",
      searchType: "Team",
      searchDate: new Date(),
    };
  }
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className={classes.center}>
                <h1>Search</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={classes.center}>
                <InputGroup>
                  <FormControl
                    placeholder={this.state.searchType}
                    hidden={this.state.searchType !== "Team"}
                    value={this.state.searchTeam}
                    onChange={(e) => {
                      this.setState({ searchTeam: e.target.value });
                    }}
                  />
                  <FormControl
                    type="date"
                    hidden={this.state.searchType !== "Date"}
                    style={{ display: "block" }}
                    value={this.state.searchDate}
                    onChange={(e) => {
                      this.setState({ searchDate: e.target.value });
                    }}
                  />
                  <DropdownButton
                    as={InputGroup.Append}
                    title={this.state.searchType}
                    id="input-group-dropdown-2"
                  >
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Team" })}
                    >
                      Team
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.setState({ searchType: "Date" })}
                    >
                      Date
                    </Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
                <br />
                <SmartButton
                  runOnClick={() =>
                    this.state.searchType === "Date"
                      ? alert(
                          this.state.searchType + " " + this.state.searchDate
                        )
                      : alert(
                          this.state.searchType + " " + this.state.searchTeam
                        )
                  }
                >
                  Go
                </SmartButton>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Dropdown,
  DropdownButton,
  FormControl,
} from "react-bootstrap";
import classes from "./Search.module.css";
import SmartButton from "../SmartButton/SmartButton";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      searchType: "Team",
      startDate: new Date(),
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
                  />
                  <FormControl
                    type="date"
                    hidden={this.state.searchType !== "Date"}
                    style={{ display: "block" }}
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
                <SmartButton runOnClick={() => alert("Search")}>Go</SmartButton>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

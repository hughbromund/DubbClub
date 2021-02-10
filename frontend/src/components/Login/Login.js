import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "../Card/Card";
import Button from "../Button/Button";
import Form from "react-bootstrap/Form";
import logo from "../../assets/Logo.png";

import classes from "./Login.module.css";

export default class Login extends Component {
  render() {
    return (
      <div>
        <Container className={classes.Login}>
          <div>
            <div className={classes.logoAlign}>
              <img alt="" src={logo} width="75" />
              <br />
              <h4 className={classes.Header}>
                <b>Sign In to Dubb Club</b>
              </h4>
            </div>
            <Card>
              <input placeholder="Email"></input>
              <input placeholder="Password"></input>

              {/* <Form>
                <Form.Group>
                  <Form.Check type="checkbox" label="Remember Me" />
                </Form.Group>
              </Form> */}
              <br />
              <br />
              <div className={classes.ButtonAlign}>
                <Button>Login</Button>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

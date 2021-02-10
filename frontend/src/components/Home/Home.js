import React, { Component } from "react";
import Card from "../Card/Card";
import Button from "../Button/Button";
import SmartButton from "../SmartButton/SmartButton";

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Homepage</h1>
        <br />
        <SmartButton
          runOnClick={async () => {
            var res = await fetch("https://dubbclub.free.beeceptor.com ");
            console.log(res);
            return true;
          }}
        >
          Test
        </SmartButton>
        <br />
        <Card>
          <h1>Hello There</h1>
          <h2>General Kenobi</h2>
          <h3>Wait a second, wasn't this your plan</h3>
          <h4>This is where the fun begins</h4>
          <h5>Don't Try It</h5>
          <h6>I have the High Ground</h6>
          <hr />
          <Button>Hello There</Button>
          <hr />
          <form>
            <input placeholder="John Smith" />
          </form>
        </Card>
        <br />
        <Card>
          <h1>DUBB CLUB</h1>
          <h2>General Kenobi</h2>
          <h3>Wait a second, wasn't this your plan</h3>
          <h4>This is where the fun begins</h4>
          <h5>Don't Try It</h5>
          <h6>I have the High Ground</h6>
          <hr />
          <Button>Hello There</Button>
        </Card>
        <br />
        <Card>
          <h1>DUBB CLUB</h1>
          <h2>General Kenobi</h2>
          <h3>Wait a second, wasn't this your plan</h3>
          <h4>This is where the fun begins</h4>
          <h5>Don't Try It</h5>
          <h6>I have the High Ground</h6>
          <hr />
          <Button>Hello There</Button>
        </Card>
      </div>
    );
  }
}

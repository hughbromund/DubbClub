import Navigation from "./components/Navigation/Navigation";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";

import "./App.css";

function App() {
  return (
    <div>
      <Navigation />
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

export default App;

import { Route, BrowserRouter as Router } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

import classes from "./App.module.css";

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <div className={classes.App}>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
        </div>
      </Router>
    </div>
  );
}

export default App;

import { Route, BrowserRouter as Router } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

import classes from "./App.module.css";

// Initialization of Fontawesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab);
library.add(fas);

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

// Making another small change

export default App;

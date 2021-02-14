import { Route, BrowserRouter as Router } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import "./constants/Constants";

import classes from "./App.module.css";

// Initialization of Fontawesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "./constants/Constants";
library.add(fab);
library.add(fas);

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <div className={classes.App}>
          <Route exact path={LOGIN_ROUTE} component={Login} />
          <Route exact path={REGISTER_ROUTE} component={Register} />
          <Route exact path={HOME_ROUTE} component={Home} />
        </div>
      </Router>
    </div>
  );
}

export default App;

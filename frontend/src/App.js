import { Route, BrowserRouter as Router } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Home} />
      </Router>
    </div>
  );
}

export default App;

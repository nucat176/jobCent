import React, { Component } from "react";
import Landing from "./components/landing";
import { AuthRoute, ProtectedRoute } from "../util/route_util";
import { Route, Switch } from "react-router-dom";
import "./scss/App.css";
import Test from "./components/test";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <ProtectedRoute path="/dashboard" component={Test} />
          <AuthRoute path="/login" component={Test} />
          <Route exact path="/" component={Landing} />
        </Switch>
      </div>
    );
  }
}

export default App;

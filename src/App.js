import React from "react";
import "./App.css";
import Header from "./components/HeaderComponent";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import Home from "./components/HomeComponent";
import PlayComputer from "./components/PlayComputerComponent";
import Contact from "./components/ContactMe";

function App() {
	return (
		<BrowserRouter>
			<React.Fragment>
				<Header />
				<Switch>
					<Route exact path="/home" component={Home} />
          <Route exact path="/playcomputer" component={PlayComputer} />
          <Route exact path="/contact" component={Contact} />
          <Redirect to="/home" />
				</Switch>
			</React.Fragment>
		</BrowserRouter>
	);
}

export default App;

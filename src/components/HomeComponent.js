import React, { Component } from "react";
import Board from "./BoardComponent";

class Home extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<Board />
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;

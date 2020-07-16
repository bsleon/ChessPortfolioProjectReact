import React, { Component } from "react";
// import Chessboard from "chessboardjsx";
// import { Chess } from "chess.js";
// import * as Chess from 'chess.js';
import MoveValidation from "../integrations/MoveValidation";

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			boardWidth: 600,
		};
		this.updateDimensions = this.updateDimensions.bind(this);
	}
	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
	}

	updateDimensions() {
		this.setState({
			boardWidth: window.innerWidth/2,
        });
	}
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		fen: "start",
	// 		dropSquareStyle: {},
	// 		squareStyles: {},
	// 		pieceSquare: "",
	// 		square: "",
	// 		history: []
	// 	  };

	// 	this.game = new Chess();
	// }

	render() {
		// console.log(this.game);
		// const { fen, dropSquareStyle, squareStyles } = this.state;

		return (
			<React.Fragment>
				{/* <div className="container" style={{boardsContainer}}> */}
				<div className="container">
					{/* <p>HOME PAGE</p> */}
					{/* <Chessboard position="start" /> */}
					<MoveValidation boardWidth={this.state.boardWidth}/>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;

// const boardsContainer = {
// 	display: "flex",
// 	justifyContent: "space-around",
// 	alignItems: "center",
// 	flexWrap: "wrap",
// 	width: "100vw",
// 	marginTop: 300,
// 	marginBottom: 50
//   };

import React, { Component } from "react";
// import Chessboard from "chessboardjsx";
// import { Chess } from "chess.js";
// import * as Chess from 'chess.js';
import Board from "../integrations/Board";

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
			boardWidth: window.innerWidth / 2,
		});
		console.log(this.state.boardWidth);
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
				<div className="container">
					<div className="row">
						<div className="col-12 col-md-8 m-0 p-0">
							<Board boardWidth={this.state.boardWidth} />

							{/* Playthrough Buttons */}
							<div
								id="playthroughButtons"
								className="text-center"
							>
								<span
									type="button"
									className="btn btn-default"
									id="startPositionBtn"
								>
									<i className="fas fa-fast-backward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="prevBtn"
								>
									<i className="fas fa-backward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="nextBtn"
								>
									<i className="fas fa-forward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="endPositionBtn"
								>
									<i className="fas fa-fast-forward"></i>
								</span>
							</div>

							{/* Action Buttons */}
							<div id="actionButtons" class="text-center">
								<span
									type="button"
									class="btn btn-default"
									id="clearBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Clear Board"
									style={{ display: "none" }}
								>
									<i class="fas fa-trash-alt"></i>
								</span>
								<span
									type="button"
									class="btn btn-default"
									id="startBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Start Board"
									style={{ display: "none" }}
								>
									<i class="fas fa-chess-board"></i>
								</span>
								<span
									type="button"
									class="btn btn-default"
									id="undoMoveBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Undo Move"
								>
									<i class="fas fa-undo-alt"></i>
								</span>
								<span
									type="button"
									class="btn btn-default"
									id="newGameBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="New Game"
								>
									<i class="fas fa-chess-board"></i>
								</span>
								<span
									type="button"
									class="btn btn-default"
									id="flipBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Flip Board"
								>
									<i class="fas fa-arrows-alt-v"></i>
								</span>
								<span
									type="button"
									class="btn btn-default"
									id="setupBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Edit Board"
								>
									<i class="far fa-edit"></i>
								</span>
							</div>
						</div>
					</div>
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

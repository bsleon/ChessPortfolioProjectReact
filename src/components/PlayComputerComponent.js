import React, { Component } from "react";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
// import OpeningStats from "./OpeningStatsComponent";

class PlayComputer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position:
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			// position:
			// 	"r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
			orientation: "white",
			// fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			fen: "start",
			dropSquareStyle: {},
			squareStyles: {},
			pieceSquare: "",
			square: "",
			history: [],
			undo: true,
			sparePieces: false,
			fensArray: [],
			fensIndex: 0,
		};
	}

	componentDidMount() {
		this.game = new Chess();
		this.setState(() => ({
			fensArray: [
				...this.state.fensArray,
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			],
		}));
	}

	undoMove = () => {
		this.game.undo();
        let i = 0;
        let arr = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"];
		if (this.state.fensIndex > 0) {
			i = this.state.fensIndex - 1;
			arr = [...this.state.fensArray];
			arr.pop();
		}
		this.setState({
			fen: this.game.fen(),
			position: this.game.fen(),
			history: this.game.history({ verbose: false }),
			fensArray: [...arr],
			fensIndex: i,
		});
	};

	flipBoard = () => {
		if (this.state.orientation === "white") {
			this.setState({
				orientation: "black",
			});
		} else
			this.setState({
				orientation: "white",
			});
	};

	newGame = () => {
		this.game = new Chess();
		let arr = [];
		arr.push("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		this.setState({
			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			position: this.game.fen(),
			history: [],
			dropSquareStyle: {},
			squareStyles: {},
			pieceSquare: "",
			square: "",
			fensArray: [...arr],
			fensIndex: 0,
		});
	};

	editBoard = () => {
		let sparePiecesFlag = !this.state.sparePieces;
		this.setState({
			sparePieces: sparePiecesFlag,
		});
	};

	moveEnd = () => {
		let i = this.state.fensArray.length - 1;
		this.setState({
			fensIndex: i,
			position: this.state.fensArray[i],
		});
	};

	moveForward = () => {
		if (this.state.fensIndex < this.state.fensArray.length - 1) {
			let i = this.state.fensIndex + 1;
			this.setState({
				fensIndex: i,
				position: this.state.fensArray[i],
			});
		}
	};

	moveBackward = () => {
		if (this.state.fensIndex > 0) {
			let i = this.state.fensIndex - 1;
			this.setState({
				fensIndex: i,
				position: this.state.fensArray[i],
			});
		}
	};

	moveBeginning = () => {
		this.setState({
			fensIndex: 0,
			position: this.state.fensArray[0],
		});
	};

	// onSquareRightClick = () => {
	// 	this.game.undo();
	// 	this.setState({
	// 		// orientation: "black"
	// 		fen: this.game.fen(),
	// 		position: this.game.fen(),
	// 	});
	// };

	onDrop = ({ sourceSquare, targetSquare }) => {
		// console.log("DROPPED");
		// see if the move is legal
		let move = this.game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return;
		this.setState(() => ({
			fen: this.game.fen(),
			history: this.game.history({ verbose: false }),
			position: this.game.fen(),
			fensArray: [...this.state.fensArray, this.game.fen()],
			fensIndex: this.state.fensArray.length,
		}));

		// console.log(this.game.history());
	};

	render() {
		// return <p>Play Computer</p>;
		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<Chessboard
								position={this.state.position}
								orientation={this.state.orientation}
								onSquareRightClick={this.onSquareRightClick}
								onDrop={this.onDrop}
								undo={this.state.undo}
								sparePieces={this.state.sparePieces}
								lightSquareStyle={{
									backgroundColor: "#FFFFDD",
								}}
								darkSquareStyle={{ backgroundColor: "#86A666" }}
								transitionDuration={150}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-6">
							<div
								id="playthroughButtons"
								className="text-center"
							>
								<span
									type="button"
									className="btn btn-default"
									id="startPositionBtn"
									onClick={this.moveBeginning}
								>
									<i className="fas fa-fast-backward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="prevBtn"
									onClick={this.moveBackward}
								>
									<i className="fas fa-backward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="nextBtn"
									onClick={this.moveForward}
								>
									<i className="fas fa-forward"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="endPositionBtn"
									onClick={this.moveEnd}
								>
									<i className="fas fa-fast-forward"></i>
								</span>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-6">
							<div id="actionButtons" className="text-center">
								<span
									type="button"
									className="btn btn-default"
									id="clearBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Clear Board"
									style={{ display: "none" }}
								>
									<i className="fas fa-trash-alt"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="startBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Start Board"
									style={{ display: "none" }}
								>
									<i className="fas fa-chess-board"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="undoMoveBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Undo Move"
									onClick={this.undoMove}
								>
									<i className="fas fa-undo-alt"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="newGameBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="New Game"
									onClick={this.newGame}
								>
									<i className="fas fa-chess-board"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="flipBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Flip Board"
									onClick={this.flipBoard}
								>
									<i className="fas fa-arrows-alt-v"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="setupBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Edit Board"
									onClick={this.editBoard}
								>
									<i className="far fa-edit"></i>
								</span>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default PlayComputer;

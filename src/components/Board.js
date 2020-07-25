import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { Chess } from "chess.js";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
// import { render } from "@testing-library/react";
import OpeningStats from "./OpeningStatsComponent";
import { Fade } from "react-animation-components";

class Board extends Component {
	//   static propTypes = { children: PropTypes.func };
	constructor(props) {
		super(props);
		this.state = {
			position:
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

			orientation: "white",

			undo: false,

			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

			// square styles for active drop square
			dropSquareStyle: {},

			// custom square styles
			squareStyles: {},

			// square with the currently clicked piece
			pieceSquare: "",

			// currently clicked square
			square: "",

			// array of past game moves
			history: [],
		};
	}

	componentDidMount() {
		this.game = new Chess();
	}

	setPosition = () => {
		this.setState({ fen: this.game.fen() });
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
		// console.log(this.state.orientation);
	};

	newGame = () => {
		this.game = new Chess();
		this.setState({
			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			position: this.game.fen(),
			history: [],
			dropSquareStyle: {},
			squareStyles: {},
			pieceSquare: "",
			square: "",
			// undo: true
		});
		this.removeHighlightSquare();
		console.log(this.game.history());
		console.log(this.game);
	};

	undoMove = () => {
		// console.log("Position before: " + this.state.position);
		// console.log("Game fen before: " + this.game.fen());
		// this.chess.undo();
		this.game.undo();
		this.setPosition();


		// this.setState(({ history, pieceSquare }) => {
		// 	return {
		// 		// position: this.game.fen(),
		// 		fen: this.game.fen(),
		// 		undo: true,
		// 		history: this.game.history({ verbose: true }),
		// 		squareStyles: squareStyling({ pieceSquare, history })
		// 	};
		// });



		// this.setState({
		// 	position: this.game.fen(),
		// 	// undo: true
		// 	fen: this.game.fen(),
		// 	history: this.game.history({ verbose: true }),
		// 	// dropSquareStyle: {},
		// 	// squareStyles: {},
		// });
		// console.log("UNDO");
		// console.log(this.game.history());
		// console.log("Position after: " + this.state.position);
		// console.log("Game fen after: " + this.game.fen());
	};

	// keep clicked square style and remove hint squares
	removeHighlightSquare = () => {
		this.setState(({ pieceSquare, history }) => ({
			squareStyles: squareStyling({ pieceSquare, history }),
		}));
	};

	// show possible moves
	highlightSquare = (sourceSquare, squaresToHighlight) => {
		const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
			(a, c) => {
				return {
					...a,
					...{
						[c]: {
							background:
								"radial-gradient(circle, #fffc00 36%, transparent 40%)",
							borderRadius: "50%",
						},
					},
					...squareStyling({
						history: this.state.history,
						pieceSquare: this.state.pieceSquare,
					}),
				};
			},
			{}
		);

		this.setState(({ squareStyles }) => ({
			squareStyles: { ...squareStyles, ...highlightStyles },
		}));
	};

	onDrop = ({ sourceSquare, targetSquare }) => {
		// see if the move is legal
		let move = this.game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return;
		this.setState(({ history, pieceSquare }) => ({
			fen: this.game.fen(),
			history: this.game.history({ verbose: true }),
			squareStyles: squareStyling({ pieceSquare, history }),
			position: this.game.fen(),
		}));

		this.removeHighlightSquare(sourceSquare);

		console.log(this.game.history());
	};

	//   onMouseOverSquare = square => {
	//     // get list of possible moves for this square
	//     let moves = this.game.moves({
	//       square: square,
	//       verbose: true
	//     });

	//     // exit if there are no moves available for this square
	//     if (moves.length === 0) return;

	//     let squaresToHighlight = [];
	//     for (var i = 0; i < moves.length; i++) {
	//       squaresToHighlight.push(moves[i].to);
	//     }

	//     this.highlightSquare(square, squaresToHighlight);
	//   };

	// onMouseOutSquare = (square) => this.removeHighlightSquare(square);
	// onDrop = (square) => this.removeHighlightSquare(square);

	// central squares get diff dropSquareStyles
	//   onDragOverSquare = square => {
	//     this.setState({
	//     //   dropSquareStyle:
	//     //     square === "e4" || square === "d4" || square === "e5" || square === "d5"
	//     //       ? { backgroundColor: "cornFlowerBlue" }
	//     //       : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
	//     dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
	//     });
	//   };

	onSquareClick = (square, sourceSquare) => {
		this.setState(({ history }) => ({
			squareStyles: squareStyling({ pieceSquare: square, history }),
			pieceSquare: square,
		}));

		let move = this.game.move({
			from: this.state.pieceSquare,
			to: square,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return;
		// else this.removeHighlightSquare(sourceSquare);

		this.setState({
			fen: this.game.fen(),
			history: this.game.history({ verbose: true }),
			pieceSquare: "",
		});
	};

	onSquareRightClick = (square) => {
		this.setState({
			squareStyles: { [square]: { backgroundColor: "deepPink" } },
			// orientation: "black"
		});
	};

	render() {
		const {
			position,
			orientation,
			undo,
			fen,
			dropSquareStyle,
			squareStyles,
		} = this.state;
		// console.log("CHILDREN: " + this.state.fen);
		return [
			this.props.children({
				squareStyles,
				orientation: orientation,
				undo: undo,
				position: position,
				onMouseOverSquare: this.onMouseOverSquare,
				onMouseOutSquare: this.onMouseOutSquare,
				onDrop: this.onDrop,
				dropSquareStyle,
				onDragOverSquare: this.onDragOverSquare,
				// onSquareClick: this.onSquareClick,
				onSquareRightClick: this.onSquareRightClick,
				// orientation: this.orientation
			}),

			<React.Fragment>
				{/* Playthrough Buttons */}
				<div id="playthroughButtons" className="text-center">
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
					>
						<i className="far fa-edit"></i>
					</span>
				</div>

				<Fade in>
					{/* <div className="row"> */}
					{/* <div className="col-12"> */}
					<OpeningStats fen={this.state.fen} />
					{/* </div> */}
					{/* </div> */}
				</Fade>
			</React.Fragment>,
		];
	}
}

// window.addEventListener('resize', function(event){
//     this.setState({
//         boardWidth: window.innerWidth/2
//     })
// })

export default function MoveValidation(props) {
	// console.log(this.game);
	return (
		<React.Fragment>
			<Board>
				{({
					undo,
					position,
					orientation,
					onDrop,
					onMouseOverSquare,
					onMouseOutSquare,
					squareStyles,
					dropSquareStyle,
					onDragOverSquare,
					// onSquareClick,
					onSquareRightClick,
				}) => (
					<Chessboard
						undo={undo}
						id="humanVsHuman"
						orientation={orientation}
						width={props.boardWidth}
						position={position}
						onDrop={onDrop}
						onMouseOverSquare={onMouseOverSquare}
						onMouseOutSquare={onMouseOutSquare}
						boardStyle={{
							borderRadius: "5px",
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
							// max-width: '100%'
						}}
						squareStyles={squareStyles}
						dropSquareStyle={dropSquareStyle}
						onDragOverSquare={onDragOverSquare}
						// onSquareClick={onSquareClick}
						onSquareRightClick={onSquareRightClick}
						// darkSquareStyle={{ backgroundColor: "rgb(100,100,100)" }}
						lightSquareStyle={{ backgroundColor: "#FFFFDD" }}
						darkSquareStyle={{ backgroundColor: "#86A666" }}
					/>
				)}
			</Board>
		</React.Fragment>
	);
}

const squareStyling = ({ pieceSquare, history }) => {
	const sourceSquare = history.length && history[history.length - 1].from;
	const targetSquare = history.length && history[history.length - 1].to;

	return {
		[pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
		...(history.length && {
			[sourceSquare]: {
				backgroundColor: "rgba(255, 255, 0, 0.4)",
			},
		}),
		...(history.length && {
			[targetSquare]: {
				backgroundColor: "rgba(255, 255, 0, 0.4)",
			},
		}),
	};
};

import React, { Component } from "react";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
import OpeningStats from "./OpeningStatsComponent";
import { Fade } from "react-animation-components";
import History from "./HistoryComponent";
import Pgn from "./PgnComponent";

class Board extends Component {
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
			dropOffBoard: "snapback",
			// width: this.calcWidth
			// getPosition: "position",
			// showSpareOnDrop: false,
			deletePieceFlag: false,
			btnState: "btn btn-default",
			deleteBtnDisplay: { display: "none" },
			clearBtnDisplay: { display: "none" },
			undoBtnDisplay: { display: "initial" },
			pgnValue: [],
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

	onChangeTextHandler(text) {
		let arr = [text.target.value];
		this.setState({ pgnValue: [...arr] });
		// console.log(this.state.pgnValue);
	}

	onPgnSubmit() {
		// console.log("PGN SUBMITTED!!!!!!");
		let pgn = [this.state.pgnValue].join("\n");
		// var pgn = [
		// 	'[Event "?"]',
		// 	'[Site "?"]',
		// 	'[Date "2015.11.26"]',
		// 	'[Round "?"]',
		// 	'[White "New game"]',
		// 	'[Black "?"]',
		// 	'[Result "*"]',
		// 	'[ECO "C31"]',
		// 	'[PlyCount "8"]\n',
		// 	"1. e4 e5 2. f4 d5 3. fxe5 Nc6 4. Bb5 Nge7",
		// ].join("\n");
		// console.log(pgn);
		this.game.load_pgn(pgn);
		// console.log("FEN: " + this.game.fen());
		this.setState({
			fen: this.game.fen(),
			position: this.game.fen(),
			history: this.game.history({ verbose: false }),
		});
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
			dropOffBoard: "snapback",
		});
	};

	editBoard = () => {
		let sparePiecesFlag = !this.state.sparePieces;
		if (sparePiecesFlag) {
			this.setState({
				sparePieces: sparePiecesFlag,
				// dropOffBoard: "trash",
				deleteBtnDisplay: { display: "initial" },
				clearBtnDisplay: { display: "initial" },
				undoBtnDisplay: { display: "none" },
			});
		} else {
			this.setState({
				sparePieces: sparePiecesFlag,
				deleteBtnDisplay: { display: "none" },
				clearBtnDisplay: { display: "none" },
				undoBtnDisplay: { display: "initial" },
				// dropOffBoard: "snapback",
			});
		}
		//check for legal position grey out button if not
		//load position into the game rules engine if legal
		//load the setup buttons in place of others like undo
		//add the gray background so can see the pieces

		//FIX:
		//when dragging the original king it disappears
		//cant drag pieces off to delete them
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

	isString(s) {
		return typeof s === "string";
	}

	validSquare(square) {
		return this.isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
	}

	validPieceCode(code) {
		return this.isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
	}

	isPlainObject = function (obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	};

	validPositionObject(pos) {
		// if (!$.isPlainObject(pos)) return false;
		if (!this.isPlainObject(pos)) return false;

		for (var i in pos) {
			if (!pos.hasOwnProperty(i)) continue;

			if (!this.validSquare(i) || !this.validPieceCode(pos[i])) {
				return false;
			}
		}

		return true;
	}

	pieceCodeToFen(piece) {
		var pieceCodeLetters = piece.split("");

		// white piece
		if (pieceCodeLetters[0] === "w") {
			return pieceCodeLetters[1].toUpperCase();
		}

		// black piece
		return pieceCodeLetters[1].toLowerCase();
	}

	squeezeFenEmptySquares(fen) {
		return fen
			.replace(/11111111/g, "8")
			.replace(/1111111/g, "7")
			.replace(/111111/g, "6")
			.replace(/11111/g, "5")
			.replace(/1111/g, "4")
			.replace(/111/g, "3")
			.replace(/11/g, "2");
	}

	objToFen(obj) {
		let COLUMNS = "abcdefgh".split("");
		if (!this.validPositionObject(obj)) return false;

		var fen = "";

		var currentRow = 8;
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var square = COLUMNS[j] + currentRow;

				// piece exists
				if (obj.hasOwnProperty(square)) {
					fen = fen + this.pieceCodeToFen(obj[square]);
				} else {
					// empty space
					fen = fen + "1";
				}
			}

			if (i !== 7) {
				fen = fen + "/";
			}

			currentRow = currentRow - 1;
		}

		// squeeze the empty numbers together
		fen = this.squeezeFenEmptySquares(fen);

		return fen;
	}

	// calcWidth = (screenWidth, screenHeight) => {
	// 	return screenWidth;
	// }

	// getPosition = (position) => {
	// 	// console.log(position);
	// 	// this.game.load(position);

	// 	if (this.isPlainObject(this.state.position)) {
	// 		console.log("getPosition Called, Was object Position: ");
	// 		this.setState({
	// 			position: this.objToFen(this.state.position) + " w KQkq - 0 1",
	// 		});
	// 		console.log("Position now: " + this.state.position);
	// 	} else {
	// 		console.log("getPosition Called, Was fen Position: ");
	// 		this.setState({ position: position });
	// 		console.log("Position now: " + this.state.position);
	// 	}

	// 	// if (this.isPlainObject(this.state.position)) {
	// 	// 	console.log(
	// 	// 		"getPosition Called, Was object Position: ",
	// 	// 		this.objToFen(this.state.position)
	// 	// 	);
	// 	// } else {
	// 	// 	console.log(
	// 	// 		"getPosition Called, Was fen Position: ",
	// 	// 		this.state.position
	// 	// 	);
	// 	// }
	// 	// this.game.load(this.state.position);
	// };

	onDrop = ({ sourceSquare, targetSquare, piece }) => {
		console.log(sourceSquare + " " + targetSquare + " " + piece);
		if (!this.state.sparePieces) {
			// see if the move is legal
			let move = this.game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q", // always promote to a queen for example simplicity
			});

			// illegal move
			if (move === null) return;

			// if (move === null) return;
			this.setState(() => ({
				fen: this.game.fen(),
				history: this.game.history({ verbose: false }),
				position: this.game.fen(),
				fensArray: [...this.state.fensArray, this.game.fen()],
				fensIndex: this.state.fensArray.length,
			}));
		} else {
			console.log("Drop off: " + this.state.dropOffBoard);

			// console.log("dropped off");
			// return;
			// console.log(sourceSquare + " " + targetSquare + " " + piece);
			// this.game.put({ type: this.game.PAWN, color: this.game.BLACK }, 'a5');
			// this.game.put({ type: 'n', color: 'b' }, 'h1');

			this.game.remove(sourceSquare);
			this.game.put(
				{
					type: piece.slice(-1).toLowerCase(),
					color: piece.slice(0, 1),
				},
				targetSquare
			);

			this.setState(() => ({
				fen: this.game.fen(),
				position: this.game.fen(),
				history: [],
				// dropOffBoard: "trash",
			}));

			// console.log(
			// 	"type: " +
			// 		piece.slice(-1).toLowerCase() +
			// 		" color: " +
			// 		piece.slice(0, 1) +
			// 		" " +
			// 		targetSquare
			// );

			// this.getPosition();
			// console.log("TARGET SQUARE!!! " + targetSquare);
			// this.game.load(this.objToFen(this.state.position));
			// if (targetSquare != null) {
			// 	console.log("Regular move");
			// 	this.game.load(this.objToFen(this.state.position));
			// } else {
			// 	console.log("Dropoff move");
			// 	this.game.load(
			// 		this.objToFen(this.state.position) + " w KQkq - 0 1"
			// 	);
			// }
			// console.log("Game Fen: " + this.game.fen());

			// this.setState(() => ({
			// 	// fen: this.game.fen(),
			// 	position: this.game.fen(),
			// 	// dropOffBoard: "trash",
			// }));
		}
	};

	deletePieces = () => {
		// console.log("Delete pieces clicked! ");
		let flag = this.state.deletePieceFlag;
		// console.log(this.state.deletePieceFlag);
		if (!flag && this.state.sparePieces) {
			this.setState(() => ({
				btnState: "btn btn-dark",
			}));
		} else {
			this.setState(() => ({
				btnState: "btn btn-default",
			}));
		}
		this.setState(() => ({
			deletePieceFlag: !flag,
		}));
	};

	clearBoard = () => {
		this.game.clear();
		this.setState(() => ({
			fen: this.game.fen(),
			position: this.game.fen(),
			history: [],
		}));
	};

	// onPieceClick = (piece) => {
	// 	console.log("Piece clicked is: " + piece);
	// 	this.deletePieces();
	// };

	onSquareClick = (square) => {
		if (this.state.deletePieceFlag) {
			this.game.remove(square);
			this.setState(() => ({
				fen: this.game.fen(),
				position: this.game.fen(),
				history: [],
				fensArray: [],
				fensIndex: 0,
				// dropOffBoard: "trash",
			}));
		}
	};

	render() {
		// return <p>Play Computer</p>;
		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<div className="col-8">
							{/* Normal Chessboard */}
							{!this.state.sparePieces && (
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
									darkSquareStyle={{
										backgroundColor: "#86A666",
									}}
									transitionDuration={150}
									width={650}
									// width={this.calcWidth}
									dropOffBoard={this.state.dropOffBoard}
									// getPosition={this.getPosition}
									// onPieceClick={this.onPieceClick}
									onSquareClick={this.onSquareClick}
								/>
							)}
							{/* Setup Chessboard */}
							{this.state.sparePieces && (
								<Chessboard
									sparePieces
									onDrop={this.onDrop}
									orientation={this.state.orientation}
									position={this.state.position}
									dropOffBoard="trash"
									lightSquareStyle={{
										backgroundColor: "#FFFFDD",
									}}
									darkSquareStyle={{
										backgroundColor: "#86A666",
									}}
									transitionDuration={150}
									width={650}
									// getPosition={this.getPosition}
									// onPieceClick={this.onPieceClick}
									onSquareClick={this.onSquareClick}
								/>
							)}
						</div>

						<div className="col-4">
							<History history={this.state.history} />
						</div>
					</div>

					<div className="row">
						<div className="col-7">
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
						<div className="col-7">
							<div id="actionButtons" className="text-center">
								<span
									type="button"
									className={this.state.btnState}
									id="deleteBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Delete Pieces"
									onClick={this.deletePieces}
									style={this.state.deleteBtnDisplay}
								>
									<i className="fas fa-ban"></i>
								</span>
								<span
									type="button"
									className="btn btn-default"
									id="clearBoardBtn"
									data-toggle="tooltip"
									data-placement="top"
									title="Clear Board"
									style={this.state.clearBtnDisplay}
									onClick={this.clearBoard}
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
									style={this.state.undoBtnDisplay}
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
					<Fade in>
						<div className="row mt-5">
							<div className="col-8">
								<OpeningStats fen={this.state.fen} />
							</div>
							<div className="col-4">
								<Pgn
									// onChangeTextHandler={(text) =>
									// 	this.setState({
									// 		pgnValue: text.target.value,
									// 	})
									// }
									onChangeTextHandler={(text) =>
										this.onChangeTextHandler(text)
									}
									onPgnSubmit={() => this.onPgnSubmit()}
								/>
							</div>
						</div>
					</Fade>
				</div>
			</React.Fragment>
		);
	}
}

export default Board;

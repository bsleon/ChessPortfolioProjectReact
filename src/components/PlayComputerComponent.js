import React, { Component } from "react";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
import OpeningStats from "./OpeningStatsComponent";
import { Fade } from "react-animation-components";
import History from "./HistoryComponent";
import Pgn from "./PgnComponent";
import Fen from "./FenComponent";
import Switch from "react-switch";

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
			dropOffBoard: "snapback",
			// getPosition: "position",
			// showSpareOnDrop: false,
			deletePieceFlag: false,
			btnState: "btn btn-default",
			deleteBtnDisplay: { display: "none" },
			clearBtnDisplay: { display: "none" },
			undoBtnDisplay: { display: "initial" },
			pgnValue: [],
			fenValue: "",
			messageArray: [],
			engineOn: false,
			checked: false,
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

	onEngineHandler = (checked) => {
		this.setState({ checked: checked, engineOn: !this.state.engineOn });
		console.log("engineOn is: " + checked);
		if (checked) this.engineMove();
	};

	onChangePgnHandler(text) {
		let arr = [text.target.value];
		this.setState({ pgnValue: [...arr] });
	}

	onChangeFenHandler(text) {
		let fen = text.target.value;
		this.setState({ fenValue: fen });
	}

	onPgnSubmit() {
		let pgn = [this.state.pgnValue].join("\n");

		if (this.game.load_pgn(pgn)) {
			this.setState({
				fen: this.game.fen(),
				position: this.game.fen(),
				history: this.game.history({ verbose: false }),
			});
			this.fensMaker();
		} else {
			console.log("NOT A VALID PGN");
		}
	}

	onFenSubmit() {
		console.log("NEW FEN IS: " + this.state.fenValue);
		if (this.game.load(this.state.fenValue)) {
			this.setState({
				fen: this.game.fen(),
				position: this.game.fen(),
				history: [],
			});
		} else {
			console.log("NOT A VALID FEN!");
		}
	}

	fensMaker() {
		const moves = this.game.history();
		const tmpGame = new Chess();
		const startingPos = tmpGame.fen();
		let fens = [];
		for (let i = 0; i < moves.length; ++i) {
			tmpGame.move(moves[i]);
			fens.push(tmpGame.fen());
		}
		//add the start position
		fens.unshift(startingPos);
		this.setState({
			fensArray: [...fens],
			fensIndex: fens.length - 1,
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

		for (let i in pos) {
			if (!pos.hasOwnProperty(i)) continue;

			if (!this.validSquare(i) || !this.validPieceCode(pos[i])) {
				return false;
			}
		}

		return true;
	}

	pieceCodeToFen(piece) {
		let pieceCodeLetters = piece.split("");

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

		let fen = "";

		let currentRow = 8;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let square = COLUMNS[j] + currentRow;

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

	calcWidth = () => {
		let chessBoard = document.getElementById("ChessBoard");
		if (chessBoard) {
			let style =
				chessBoard.currentStyle || window.getComputedStyle(chessBoard);

			let paddingLeft = parseInt(style.paddingLeft.slice(0, -2));
			let paddingRight = parseInt(style.paddingRight.slice(0, -2));
			let padding = paddingLeft + paddingRight;

			// let marginLeft = parseInt(style.marginLeft.slice(0, -2));
			// let marginRight = parseInt(style.marginRight.slice(0, -2));
			// let margin = marginLeft + marginRight;

			let rect = chessBoard.getBoundingClientRect();
			return rect.width - padding;
		}
		return 600;
	};

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
				promotion: "q", // always promote to a queen for now
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

		if (this.state.engineOn) this.engineMove();
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

	engineMove = (options) => {
		const engineDepth = 10;
		const moveTime = 300;

		let stockfish = new Worker(
			`${process.env.PUBLIC_URL}/stockfish/stockfish.js`
		);

		stockfish.onmessage = (event) => {
			console.log(event.data);
			this.messageParser(event.data);
		};

		stockfish.postMessage(`position fen ${this.game.fen()}`);
		// stockfish.postMessage(
		// 	`setoption name MultiPV value ${numOfSuggestions}`
		// );
		stockfish.postMessage(`depth ${engineDepth}`);
		stockfish.postMessage(`go movetime ${moveTime}`);
	};

	messageParser = (message) => {
		console.log("MESSAGE IS: " + message);
		// mess = message.data;
		// messageArray = mess.split(/\r\n|\n|\r/);
		// console.log(messageArray[0]);
		if (message.includes("multipv 1")) {
			// let multipv1 = "multipv";
			let messages = message.split(" ");
			let multipv1Index = messages.findIndex((msg) => msg === "multipv");
			let suggestion1 = messages[multipv1Index + 4];
			if (this.game.turn() === "b")
				suggestion1 = parseInt(suggestion1) * -1;
			console.log("multipv 1: " + suggestion1 / 100);
		} else if (message.includes("multipv 2")) {
			// let multipv1 = "multipv";
			let messages = message.split(" ");
			let multipv1Index = messages.findIndex((msg) => msg === "multipv");
			let suggestion1 = messages[multipv1Index + 4];
			if (this.game.turn() === "b")
				suggestion1 = parseInt(suggestion1) * -1;
			console.log("multipv 2: " + suggestion1 / 100);
		} else if (message.includes("multipv 3")) {
			// let multipv1 = "multipv";
			let messages = message.split(" ");
			let multipv1Index = messages.findIndex((msg) => msg === "multipv");
			let suggestion1 = messages[multipv1Index + 4];
			if (this.game.turn() === "b")
				suggestion1 = parseInt(suggestion1) * -1;
			console.log("multipv 3: " + suggestion1 / 100);
			console.log("\n");
		}

		if (message.includes("bestmove")) {
			// console.log("contained stockfish!");
			this.setState({
				messageArray: [...this.state.messageArray, message],
			});
			// messageArray.push(message);
			// if (messageArray.length >= engineDepth + 1) {
			// console.log(messageArray);
			let msgArray = this.state.messageArray;
			let engineMove = msgArray[msgArray.length - 1].split(" ");
			// console.log(messageArray[engineDepth + 1]);
			// console.log("Engine move is: " + engineMove[1]);
			if (this.state.engineOn && this.game.turn() === "b") {
				this.game.move(engineMove[1], { sloppy: true });
				this.setState({
					position: this.game.fen(),
				});
				// board.position(this.game.fen());
			}
		}
	};

	render() {
		// return <p>Play Computer</p>;
		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<div className="col-lg-8">
							<div id="ChessBoard" className="col-12">
								{/* Normal Chessboard */}
								{!this.state.sparePieces && (
									<Chessboard
										position={this.state.position}
										orientation={this.state.orientation}
										onSquareRightClick={
											this.onSquareRightClick
										}
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
										// width={this.state.width}
										calcWidth={this.calcWidth}
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

							<div className="row">
								<div className="col-12">
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
								<div className="col-12">
									<div
										id="actionButtons"
										className="text-center"
									>
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
						</div>

						<div id="History" className="col-lg-4">
							<Switch
								onChange={this.onEngineHandler}
								checked={this.state.checked}
								checkedIcon={false}
								uncheckedIcon={false}
								onColor="#629924"
								offColor="#6B6B6B"
								offHandleColor="#262421"
								onHandleColor="#262421"
							/>
							<History history={this.state.history} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default PlayComputer;

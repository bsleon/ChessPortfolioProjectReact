import React, { Component } from "react";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
import OpeningStats from "./OpeningStatsComponent";
import { Fade } from "react-animation-components";
import History from "./HistoryComponent";
import Pgn from "./PgnComponent";
import Fen from "./FenComponent";
import OpeningsDropdown from "./OpeningsDropdownComponent";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";

let stockfish = null;

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position:
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			orientation: "white",
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
			boardWidth: "600",
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
			suggestion: "",
			score: "",
			selectedOption: null,
			turnDropdownDisplay: { display: "none" },
			isTurnDropdownOpen: false,
			turnDropdownValue: "White's Turn",
			turn: "w",
			setupBoardIcon: "far fa-edit",
			setupBoardIconTitle: "Edit Board",
		};
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown);
		this.game = new Chess();
		this.setState(() => ({
			fensArray: [
				...this.state.fensArray,
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			],
		}));
	}

	// componentWillUnmount() {
	// 	document.removeEventListener("keydown", this.handleKeyDown);
	// }

	toggleTurn = () => {
		this.setState({
			isTurnDropdownOpen: !this.state.isTurnDropdownOpen,
		});
	};

	changeTurnDropdownValue = (value) => {
		let fen = this.game.fen();
		if (value === "w") {
			fen = fen.replace(" b ", " w ");
			this.setState({
				turnDropdownValue: "White's Turn",
				turn: "w",
				fen: fen,
			});
		} else {
			fen = fen.replace(" w ", " b ");
			this.setState({
				turnDropdownValue: "Black's Turn",
				turn: "b",
				fen: fen,
			});
		}
		this.game.load(fen);
		// console.log("Value is: " + value);
		// console.log("Turn is: " + this.game.turn());
	};

	onHistoryClickHander = (index) => {
		console.log("INDEX: " + index);

		this.setState({
			fensIndex: index + 1,
			position: this.state.fensArray[index + 1],
		});
	};

	handleKeyDown = (event) => {
		if (event.key === "ArrowLeft") {
			this.moveBackward();
		} else if (event.key === "ArrowRight") {
			this.moveForward();
		}
	};

	onEngineHandler = (checked) => {
		this.setState({
			checked: checked,
			engineOn: !this.state.engineOn,
			suggestion: "Thinking...",
		});
		console.log("engineOn is: " + checked);
		if (checked) this.engineAnalysis();
		else {
			stockfish.terminate();
			this.setState({ suggestion: "", score: "" });
		}
	};

	onChangeOpeningsHandler = (selectedOption) => {
		if (selectedOption) {
			this.setState(
				{
					selectedOption: selectedOption,
				},
				() => console.log(this.state.selectedOption.value)
			);
		}
		let fen = selectedOption.value + " 0 1";
		if (this.game.validate_fen(fen)) {
			this.game.load(fen);
			let histArr = this.game_to_san(selectedOption.moves.split(" "));
			console.log(histArr);
			this.setState({ history: [...histArr] });
			this.fensMaker();

			this.setState({
				fen: selectedOption.value + " 0 1",
				fenValue: selectedOption.value + " 0 1",
				position: fen,
			});
		} else console.log("NOT A VALID FEN");
	};

	onCheckHandler = (checked) => {
		this.setState({ checked: checked });
	};

	onChangePgnHandler(text) {
		let arr = [text.target.value];
		this.setState({ pgnValue: [...arr] });
	}

	onChangeFenHandler(text) {
		let fen = text.target.value.trim();
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
			if (this.state.checked) {
				this.setState({ suggestion: "Thinking..." });
				this.engineAnalysis();
			}
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
				fensArray: [],
				fensIndex: 0,
			});
			if (this.state.checked) {
				this.setState({ suggestion: "Thinking..." });
				this.engineAnalysis();
			}
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
		let arr = [`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR ${this.state.turn} KQkq - 0 1`];
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

		if (this.state.checked) {
			stockfish.terminate();
			this.setState({
				suggestion: "Thinking...",
			});
			this.engineAnalysis();
		}
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
			suggestion: "",
			score: "",
			turnDropdownValue: "White's Turn",
			turn: "w",
		});
		if (this.state.checked) {
			stockfish.terminate();
			this.setState({
				suggestion: "Thinking...",
			});
			this.engineAnalysis();
		}
	};

	editBoard = () => {
		let sparePiecesFlag = !this.state.sparePieces;
		if (sparePiecesFlag) {
			this.setState({
				sparePieces: sparePiecesFlag,
				dropOffBoard: "trash",
				deleteBtnDisplay: { display: "initial" },
				clearBtnDisplay: { display: "initial" },
				undoBtnDisplay: { display: "none" },
				turnDropdownDisplay: { display: "initial" },
				setupBoardIcon: "fas fa-chess-knight",
				setupBoardIconTitle: "Continue From Here",
			});
		} else {
			this.setState({
				sparePieces: sparePiecesFlag,
				deleteBtnDisplay: { display: "none" },
				clearBtnDisplay: { display: "none" },
				undoBtnDisplay: { display: "initial" },
				dropOffBoard: "snapback",
				turnDropdownDisplay: { display: "none" },
				setupBoardIcon: "far fa-edit",
				setupBoardIconTitle: "Edit Board",
			});
		}
		//check for legal position grey out button if not
		//load position into the game rules engine if legal
		//load the setup buttons in place of others like undo
		//add the gray background so can see the pieces

		//FIX:
		//when dragging the original king it disappears
		//cant drag pieces off to delete them
		//move king ontop of piece then click newGame bug
	};

	moveEnd = () => {
		if (this.state.history.length) {
			let i = this.state.fensArray.length - 1;
			this.setState({
				fensIndex: i,
				position: this.state.fensArray[i],
			});
		}
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
		if (this.state.history.length) {
			this.setState({
				fensIndex: 0,
				position: this.state.fensArray[0],
			});
		}
	};

	// isString(s) {
	// 	return typeof s === "string";
	// }

	// validSquare(square) {
	// 	return this.isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
	// }

	// validPieceCode(code) {
	// 	return this.isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
	// }

	// isPlainObject = function (obj) {
	// 	return Object.prototype.toString.call(obj) === "[object Object]";
	// };

	// validPositionObject(pos) {
	// 	// if (!$.isPlainObject(pos)) return false;
	// 	if (!this.isPlainObject(pos)) return false;

	// 	for (let i in pos) {
	// 		if (!pos.hasOwnProperty(i)) continue;

	// 		if (!this.validSquare(i) || !this.validPieceCode(pos[i])) {
	// 			return false;
	// 		}
	// 	}

	// 	return true;
	// }

	// pieceCodeToFen(piece) {
	// 	let pieceCodeLetters = piece.split("");

	// 	// white piece
	// 	if (pieceCodeLetters[0] === "w") {
	// 		return pieceCodeLetters[1].toUpperCase();
	// 	}

	// 	// black piece
	// 	return pieceCodeLetters[1].toLowerCase();
	// }

	// squeezeFenEmptySquares(fen) {
	// 	return fen
	// 		.replace(/11111111/g, "8")
	// 		.replace(/1111111/g, "7")
	// 		.replace(/111111/g, "6")
	// 		.replace(/11111/g, "5")
	// 		.replace(/1111/g, "4")
	// 		.replace(/111/g, "3")
	// 		.replace(/11/g, "2");
	// }

	// objToFen(obj) {
	// 	let COLUMNS = "abcdefgh".split("");
	// 	if (!this.validPositionObject(obj)) return false;

	// 	let fen = "";

	// 	let currentRow = 8;
	// 	for (let i = 0; i < 8; i++) {
	// 		for (let j = 0; j < 8; j++) {
	// 			let square = COLUMNS[j] + currentRow;

	// 			// piece exists
	// 			if (obj.hasOwnProperty(square)) {
	// 				fen = fen + this.pieceCodeToFen(obj[square]);
	// 			} else {
	// 				// empty space
	// 				fen = fen + "1";
	// 			}
	// 		}

	// 		if (i !== 7) {
	// 			fen = fen + "/";
	// 		}

	// 		currentRow = currentRow - 1;
	// 	}

	// 	// squeeze the empty numbers together
	// 	fen = this.squeezeFenEmptySquares(fen);

	// 	return fen;
	// }

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
			// this.setState({ boardWidth: rect.width - padding });
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

	// onPieceClick = () => {
	// 	// if (stockfish) stockfish.postMessage(`stop`);
	// 	stockfish.terminate();
	// 	console.log("Piece Clicked!");
	// };

	// onDragOverSquare = (square) => {
	// 	// if (stockfish) stockfish.postMessage(`stop`);
	// 	if (square != null && stockfish) stockfish.terminate();
	// 	console.log("Dragging");
	// };

	getPosition = (position) => {
		// console.log(position);
		this.objToFen(position);
	};

	objToFen = (position) => {
		// console.log(typeof position);
		// console.log(position);

		if (this.state.sparePieces) {
			let positionArr = [];
			if (position) positionArr = Object.entries(position);
			// console.log(positionArr);
			this.game.clear();
			positionArr.forEach((pos) => {
				// console.log(pos);

				this.game.put(
					{
						type: pos[1].charAt(1).toLowerCase(),
						color: pos[1].charAt(0),
					},
					pos[0]
				);
			});
			this.setState(() => ({
				fen: this.game.fen(),
				history: this.game.history({ verbose: false }),
				position: this.game.fen(),
				fensArray: [this.game.fen()],
				fensIndex: 0,
			}));
			// console.log(this.game.fen());
		}
		// this.game.put({ type: "k", color: "w" }, "h1");
	};

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

			if (this.state.checked)
				this.setState({ suggestion: "Thinking..." });

			this.setState(() => ({
				fen: this.game.fen(),
				history: this.game.history({ verbose: false }),
				position: this.game.fen(),
				fensArray: [...this.state.fensArray, this.game.fen()],
				fensIndex: this.state.fensArray.length,
			}));
		} else {
			if (targetSquare) {
				this.game.remove(sourceSquare);
				this.game.put(
					{
						type: piece.slice(-1).toLowerCase(),
						color: piece.slice(0, 1),
					},
					targetSquare
				);
			} else if (piece !== "wK" && piece !== "bK") this.getPosition();

			this.setState(() => ({
				fen: this.game.fen(),
				position: this.game.fen(),
				history: [],
				// dropOffBoard: "trash",
			}));
		}

		if (this.state.engineOn) {
			stockfish.terminate();
			this.engineAnalysis();
		}
	};

	deletePieces = () => {
		let flag = this.state.deletePieceFlag;
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

	move_to_san(move) {
		console.log("MOVE IS BEFORE: " + move);
		const attemptMove = this.game.move(move, { sloppy: true });
		if (attemptMove) console.log("MOVE IS AFTER: " + attemptMove.san);
		this.game.undo();

		if (attemptMove) {
			return attemptMove.san;
		}
		return false;
	}

	game_to_san(moves) {
		this.newGame();
		let sanMoves = [];
		sanMoves = moves.map(
			(move) => this.game.move(move, { sloppy: true }).san
		);

		return sanMoves;
	}

	engineAnalysis = (options) => {
		const engineDepth = 15;
		const moveTime = 1000;
		const numOfSuggestions = 5;

		stockfish = new Worker(
			`${process.env.PUBLIC_URL}/stockfish/stockfish.js`
		);

		stockfish.onmessage = (event) => {
			console.log("\nNew data!");
			console.log(event.data);
			this.messageParser(event.data, numOfSuggestions);
		};

		stockfish.postMessage(`position fen ${this.game.fen()}`);
		stockfish.postMessage(
			`setoption name MultiPV value ${numOfSuggestions}`
		);
		stockfish.postMessage(`depth ${engineDepth}`);
		stockfish.postMessage(`go movetime ${moveTime}`);
	};

	messageParser = (message, numOfSuggestions) => {
		let score = 0;
		let multipvIndex = 0;

		if (message.includes("multipv 1")) {
			let messages = message.split(" ");
			multipvIndex = messages.findIndex((msg) => msg === "multipv");
			score = messages[multipvIndex + 4];

			if (this.game.turn() === "b") score = parseInt(score) * -1;
			score = score / 100;
			this.setState({
				score: score,
			});
		}

		if (message.includes("bestmove")) {
			let msgArr = [];
			msgArr.push(message);
			let engineSuggestion = msgArr[msgArr.length - 1].split(" ");
			this.setState({
				suggestion: engineSuggestion[1],
			});
			let moveToSan = this.move_to_san(engineSuggestion[1]);
			if (moveToSan) {
				this.setState({ suggestion: moveToSan });
			}

			console.log("Engine suggestion is: " + engineSuggestion[1]);
			console.log("San move is: " + moveToSan);
		}

		// write an object array for these and display them with a map

		//*****FOR SHOWING MULTIPLE SUGGESTIONS IN THE FUTURE */
		// for (let i = 1; i <= numOfSuggestions; ++i) {
		// 	if (message.includes("multipv " + i)) {
		// 		// let multipv1 = "multipv";
		// 		let messages = message.split(" ");
		// 		multipvIndex = messages.findIndex((msg) => msg === "multipv");

		// 		score = messages[multipvIndex + 4];
		// 		suggestion = messages[multipvIndex + 14];
		// 		if (this.game.turn() === "b") score = parseInt(score) * -1;
		// 		score = score / 100;

		// 		this.setState({
		// 			score: score,
		// 			suggestion: suggestion,
		// 		});

		// 		let obj = {
		// 			multipvIndex: i,
		// 			score: score,
		// 			suggestion: suggestion,
		// 		};
		// 		// suggArr.push(obj);
		// 		suggArr[i] = obj;

		// 		console.log(
		// 			"multipv " +
		// 				i +
		// 				": " +
		// 				"score: " +
		// 				score / 100 +
		// 				" suggestion " +
		// 				i +
		// 				": " +
		// 				suggestion
		// 		);
		// 	}
		// }

		// console.log(suggArr)

		// this.setState({
		// 	suggestionArray: [...suggArr],
		// });

		// console.log(this.state.suggestionArray);
	};

	render() {
		// return <p>Play Computer</p>;
		return (
			<React.Fragment>
				<div id="wrap">
					<div
						id="main"
						className="container"
						onKeyDown={this.handleKeyPress}
					>
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
											calcWidth={this.calcWidth}
											dropOffBoard={
												this.state.dropOffBoard
											}
											onSquareClick={this.onSquareClick}
											getPosition={this.getPosition}
										/>
									)}
									{/* Setup Chessboard */}
									{this.state.sparePieces && (
										<Chessboard
											sparePieces
											onDrop={this.onDrop}
											orientation={this.state.orientation}
											position={this.state.position}
											dropOffBoard={
												this.state.dropOffBoard
											}
											lightSquareStyle={{
												backgroundColor: "#FFFFDD",
											}}
											darkSquareStyle={{
												backgroundColor: "#86A666",
											}}
											transitionDuration={150}
											calcWidth={this.calcWidth}
											onSquareClick={this.onSquareClick}
											getPosition={this.getPosition}
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
												style={
													this.state.deleteBtnDisplay
												}
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
												style={
													this.state.clearBtnDisplay
												}
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
												style={
													this.state.undoBtnDisplay
												}
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
												title={
													this.state
														.setupBoardIconTitle
												}
												onClick={this.editBoard}
											>
												<i
													className={
														this.state
															.setupBoardIcon
													}
												></i>
											</span>
										</div>
									</div>
								</div>
							</div>

							<div id="History" className="col-lg-4">
								<History
									history={this.state.history}
									width={this.calcWidth()}
									checked={this.state.checked}
									suggestion={this.state.suggestion}
									score={this.state.score}
									fensIndex={this.state.fensIndex}
									onEngineHandler={(checked) =>
										this.onEngineHandler(checked)
									}
									onHistoryClickHander={(index) =>
										this.onHistoryClickHander(index)
									}
								/>
								<div className="row pt-4">
									<div className="col-12">
										<Pgn
											onChangePgnHandler={(text) =>
												this.onChangePgnHandler(text)
											}
											onPgnSubmit={() =>
												this.onPgnSubmit()
											}
										/>
									</div>
									<div className="col-12">
										<Fen
											onChangeFenHandler={(text) =>
												this.onChangeFenHandler(text)
											}
											onFenSubmit={() =>
												this.onFenSubmit()
											}
										/>
									</div>
									<div className="col-12">
										<OpeningsDropdown
											onChangeOpeningsHandler={(text) =>
												this.onChangeOpeningsHandler(
													text
												)
											}
										/>
									</div>
									<div className="col-12 mt-4">
										<Dropdown
											isOpen={
												this.state.isTurnDropdownOpen
											}
											toggle={this.toggleTurn}
											style={
												this.state.turnDropdownDisplay
											}
										>
											<DropdownToggle caret>
												{this.state.turnDropdownValue}
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem
													onClick={() =>
														this.changeTurnDropdownValue(
															"w"
														)
													}
													dropDownValue="w"
												>
													White's Turn
												</DropdownItem>
												<DropdownItem
													onClick={() =>
														this.changeTurnDropdownValue(
															"b"
														)
													}
													dropDownValue="b"
												>
													Black's Turn
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								</div>
							</div>
						</div>

						<Fade in>
							<div className="row mt-1 mr-1">
								<div className="col-12 col-lg-8">
									<OpeningStats fen={this.state.fen} />
								</div>
							</div>
						</Fade>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Board;

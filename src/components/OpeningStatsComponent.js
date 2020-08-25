import React, { Component } from "react";

const openingsUrl = "https://explorer.lichess.ovh/master?fen=";

class OpeningStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movesList: [],
			openingName: "",
		};
	}

	searchOpening = async (nextProps) => {
		let fenURL = nextProps;
		if (nextProps == null) {
			fenURL = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		}
		const res = await fetch(`${openingsUrl}${fenURL}`);
		return await res.json();
	};

	displayOpeningsInfo = async (nextProps) => {
		let openingInfo = await this.searchOpening(nextProps);
		let openingTitle = "";
		let movesArray = [];

		if (openingInfo.opening != null) {
			openingTitle =
				openingInfo.opening.eco + " " + openingInfo.opening.name;
		} else if (
			this.props.fen ===
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		) {
			openingTitle = "";
		}

		this.setState({
			openingName: openingTitle,
		});

		openingInfo.moves.forEach((openMove) => {
			const totalGames = openMove.white + openMove.black + openMove.draws;
			const whitePerc = Math.ceil((openMove.white / totalGames) * 100);
			const blackPerc = Math.ceil((openMove.black / totalGames) * 100);
			const drawsPerc = Math.ceil((openMove.draws / totalGames) * 100);

			const str = `
		        <div class="row">
		            <div class="col-1 p-0">
		                ${openMove.san}
		            </div>
		            <div class="col-2 p-0">
		                ${totalGames.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
		            </div>
		            <div class="col-2 p-0">
		                ${openMove.averageRating}
		            </div>
		            <div class="progress col-7 p-0">
		                <div class="progress-bar bg-light" role="progressbar" style="width:${whitePerc}%; color:black" aria-valuenow="${whitePerc}" aria-valuemin="0"
		                    aria-valuemax="100">${whitePerc}%
		                </div>
		                <div class="progress-bar bg-secondary" role="progressbar" style="width:${drawsPerc}%" aria-valuenow="${drawsPerc}"
		                    aria-valuemin="0" aria-valuemax="100">${drawsPerc}%
		                </div>
		                <div class="progress-bar bg-dark" role="progressbar" style="width:${blackPerc}%" aria-valuenow="{blackPerc}" aria-valuemin="0"
		                    aria-valuemax="100">${blackPerc}%
		                </div>
		            </div>
		        </div>
		`;
			movesArray.push(str);
		});

		this.setState({
			movesList: [...movesArray],
		});
	};

	componentDidMount() {
		this.displayOpeningsInfo();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.fen !== this.props.fen) {
			this.displayOpeningsInfo(nextProps.fen);
		}
	}

	render() {
		return (
			<React.Fragment>
				<div class="row ml-0 p-0">
					<h5>{this.state.openingName}</h5>
				</div>
				<div className="row mb-3 ml-0 p-0" id="openingsInfoHeader">
					<div className="col-1 p-0 m-0">Move</div>
					<div className="col-2 p-0 m-0">Total Games</div>
					<div className="col-2 p-0 m-0">Avg Rating</div>
					<div className="col-7 text-center">White/Draw/Black</div>
				</div>
				<div className="row ml-0 pl-0">
					{this.state.movesList.map((item, index) => (
						<div
							className="col-12"
							key={index}
							dangerouslySetInnerHTML={{ __html: item }}
						></div>
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default OpeningStats;

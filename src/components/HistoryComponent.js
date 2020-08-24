import React, { Component } from "react";
import { Card, CardBody, CardTitle, Button } from "reactstrap";
import Switch from "react-switch";

class History extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: false };
	}

	// updateScroll() {
	// 	let element = document.getElementById("historyCard");
	// 	element.scrollTop = element.scrollHeight-1;
	// }

	renderHistory(item, index) {
		console.log(this.props.fensIndex);
		if (index === 0) {
			return (
				// <span key={0}>
				<>
					{index / 2 + 1}.{" "}
					<Button
						key={0}
						id={"histBtn" + index}
						style={styles.button}
						onClick={() => this.props.onHistoryClickHander(index)}
						className="historyBtn"
						active={
							this.props.fensIndex === index + 1 ? true : false
						}
					>
						{item}
					</Button>
					{/* </span> */}
				</>
			);
		} else if (index % 2 === 0) {
			return (
				<>
					<br />
					{/* <span key={index}> */}
					{index / 2 + 1}.{" "}
					<Button
						key={index}
						id={"histBtn" + index}
						style={styles.button}
						onClick={() => this.props.onHistoryClickHander(index)}
						className="historyBtn"
						active={
							this.props.fensIndex === index + 1 ? true : false
						}
					>
						{item}
					</Button>
					{/* </span> */}
				</>
			);
		} else {
			return (
				<>
					{/* // {" "} */}
					{/* // <span key={index}> */}{" "}
					<Button
						key={index}
						id={"histBtn" + index}
						style={styles.button}
						onClick={() => this.props.onHistoryClickHander(index)}
						className="historyBtn"
						active={
							this.props.fensIndex === index + 1 ? true : false
						}
					>
						{item}
					</Button>
					{/* // </span> */}
				</>
			);
		}
	}

	render() {
		// console.log("HISTORY WIDTH IS: " + this.props.width);
		return (
			<>
				<div>
					<Card id="engineCard">
						<CardBody id="engineCardBody">
							<CardTitle>
								<div className="row">
									<div className="col-9">Engine Analysis</div>
									<div className="col-3">
										<Switch
											onChange={(checked) =>
												this.props.onEngineHandler(
													checked
												)
											}
											checked={this.props.checked}
											checkedIcon={false}
											uncheckedIcon={false}
											onColor="#629924"
											offColor="#6B6B6B"
											offHandleColor="#262421"
											onHandleColor="#262421"
										/>
									</div>
								</div>
							</CardTitle>
							<div className="row">
								{/* <div className="col-4"></div> */}
								<div className="col-12">
									<div className="row">
										<div className="col-6">
											Score: {this.props.score}
										</div>
										<div className="col-6">
											Move: {this.props.suggestion}
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
				<div>
					<Card
						id="cardScroll"
						style={{ height: this.props.width / 2.667 }}
					>
						<CardBody className="histCardBody">
							<CardTitle>Move History</CardTitle>
							{this.props.history.map((item, index) =>
								this.renderHistory(item, index)
							)}
						</CardBody>
					</Card>
				</div>
			</>
		);
	}
}

const styles = {
	button: {
		backgroundColor: "transparent",
		border: "none",
		padding: 4,
	},
};

export default History;

import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import Switch from "react-switch";

class History extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: false };
	}

	renderHistory(item, index) {
		if (index === 0) {
			return (
				<span key={0}>
					{index / 2 + 1}. {item}
				</span>
			);
		} else if (index % 2 === 0) {
			return (
				<span key={index}>
					<br />
					{index / 2 + 1}. {item}
				</span>
			);
		} else {
			return <span key={index}> {item}</span>;
		}
	}

	render() {
		console.log("HISTORY WIDTH IS: " + this.props.width);
		return (
			<Card
				className="card-scroll"
				style={{ height: this.props.width / 2 }}
			>
				<CardBody>
					<div className="row">
						<div className="col-4">
							<Switch
								onChange={(checked) =>
									this.props.onEngineHandler(checked)
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
						<div className="col-8">
							<div>Score: {this.props.score}</div>
							<div>Move: {this.props.suggestion}</div>
						</div>
					</div>
					<CardTitle>Move History</CardTitle>
					{this.props.history.map((item, index) =>
						this.renderHistory(item, index)
					)}
				</CardBody>
			</Card>
		);
	}
}

export default History;

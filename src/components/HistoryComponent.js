import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

class History extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
		console.log(this.props.width)
		return (
			<Card className="card-scroll">
				<CardBody style={{height:this.props.width}}>
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

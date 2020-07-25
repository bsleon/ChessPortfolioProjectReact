import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

class History extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Card>
				<CardBody>
					<CardTitle>Move History</CardTitle>
                    <ol>
                    {this.props.history.map((item, index) => (
                        <li
                            key={index}
                            dangerouslySetInnerHTML={{ __html: item }}
                        ></li>
                    ))}
                    </ol>
				</CardBody>
			</Card>
		);
	}
}

export default History;

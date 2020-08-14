import React, { Component } from "react";
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Col,
	Row,
	FormFeedback,
} from "reactstrap";

class Pgn extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		pgnValue: "",
	// 	};
	// }

	onChangeTextHandler(text) {
		this.setState({ pgnValue: text.target.value });
		console.log(this.state.pgnValue);
	}

	render() {
		return (
			<Form>
				<FormGroup>
					<Label htmlFor="feedback" md={4}>
						PGN
					</Label>
					<Col md={15}>
						<Input
							type="textarea"
							id="feedback"
							name="feedback"
							rows="3"
							// value={this.state.feedback}
							// onChange={this.handleInputChange}
							onChange={(text) => this.props.onChangeTextHandler(text)}
						></Input>
					</Col>
					<Col className="text-right m-0 p-0">
						<Button type="button" color="secondary" onClick={() => this.props.onPgnSubmit()}>
							Import PGN
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

export default Pgn;

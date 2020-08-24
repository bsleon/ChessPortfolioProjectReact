import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

class Pgn extends Component {
	// onChangeTextHandler(text) {
	// 	this.setState({ pgnValue: text.target.value });
	// 	console.log(this.state.pgnValue);
	// }

	render() {
		return (
			<Form>
				<FormGroup>
					{/* <Label htmlFor="pgn" md={4}>
						PGN:
					</Label> */}
					<Col md={15}>
						<Input
							placeholder="PGN:"
							type="textarea"
							id="pgn"
							name="pgn"
							rows="3"
							onChange={(text) =>
								this.props.onChangePgnHandler(text)
							}
						></Input>
					</Col>
					<Col className="text-right m-0 p-0">
						<Button
							type="button"
							color="dark"
							onClick={() => this.props.onPgnSubmit()}
						>
							Import PGN
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

export default Pgn;

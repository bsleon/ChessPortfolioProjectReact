import React, { Component } from "react";
import { Button, Form, FormGroup, Input, Col } from "reactstrap";

class Pgn extends Component {
	render() {
		return (
			<Form>
				<FormGroup>
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

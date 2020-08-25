import React, { Component } from "react";
import { Button, Form, FormGroup, Input, Col } from "reactstrap";

class Fen extends Component {
	render() {
		return (
			<Form>
				<FormGroup>
					<Col md={15}>
						<Input
							placeholder="FEN:"
							type="textarea"
							id="fen"
							name="fen"
							rows="3"
							onChange={(text) => {
								this.props.onChangeFenHandler(text);
							}}
						></Input>
					</Col>
					<Col className="text-right m-0 p-0">
						<Button
							type="button"
							color="dark"
							onClick={() => {
								this.props.onFenSubmit();
							}}
						>
							Import FEN
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

export default Fen;

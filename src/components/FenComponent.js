import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

class Fen extends Component {
	onChangeTextHandler(text) {
		this.setState({ fenValue: text.target.value });
		console.log(this.state.fenValue);
	}

	render() {
		return (
			<Form>
				<FormGroup>
					<Label htmlFor="fen" md={4}>
						FEN:
					</Label>
					<Col md={15}>
						<Input
							type="textarea"
							id="fen"
							name="fen"
							rows="3"
							onChange={(text) =>
								this.props.onChangeFenHandler(text)
							}
						></Input>
					</Col>
					<Col className="text-right m-0 p-0">
						<Button
							type="button"
							color="dark"
							onClick={() => this.props.onFenSubmit()}
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

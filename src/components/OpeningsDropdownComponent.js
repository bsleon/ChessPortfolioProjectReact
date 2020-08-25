import React, { Component } from "react";
import Select from "react-virtualized-select";
import "react-select/dist/react-select.css";
import openings from "../db/openings.json";

class OpeningsDropdown extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedOption: "", fenValue: "" };
	}

	render() {
		const { selectedOption } = this.state;

		return (
			<Select
				options={openings}
				value={selectedOption}
				onChange={(text) => this.props.onChangeOpeningsHandler(text)}
				filterOptions={{ ignoreAccents: false }}
				labelKey="label"
				optionHeight={50}
				searchable={true}
				placeholder={"Load an Opening..."}
				valueKey="value"
			/>
		);
	}
}

export default OpeningsDropdown;

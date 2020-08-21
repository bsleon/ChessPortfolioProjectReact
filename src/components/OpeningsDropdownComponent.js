import React, { Component } from "react";
// import VirtualizedSelect from "react-virtualized-select";
// import Select from "react-select";
import Select from "react-virtualized-select";
import "react-select/dist/react-select.css";
// import "react-virtualized-select/styles.css";
import openings from "../db/openings.json";
import createFilterOptions from "react-select-fast-filter-options";
import { ExactWordIndexStrategy } from "js-search";

const indexStrategy = new ExactWordIndexStrategy();

class OpeningsDropdown extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedOption: "", fenValue: "" };
	}

	// options = [
	// 	{ value: "chocolate", label: "Chocolate" },
	// 	{ value: "strawberry", label: "Strawberry" },
	// 	{ value: "vanilla", label: "Vanilla" },
	// ];

	handleChange = (selectedOption) => {
		if (selectedOption) {
			this.setState(
				{
					selectedOption: selectedOption,
					// fenValue: selectedOption.value,
				},
				() =>
					// console.log(`Option selected:`, this.state.selectedOption),
				console.log(this.state.selectedOption.value)
				// console.log(`Fen Value: `, this.state.fenValue)
			);
		}
	};

	filterOptions = createFilterOptions({
		openings,
		// indexStrategy,
	});

	render() {
		const { selectedOption } = this.state;

		return (
			<Select
				// data={openings.map((opening) => ({
				// 	label: opening.name,
				// 	value: opening.fen,
				// }))}
				options={openings}
				// isSearchable={true}
				value={this.state.selectedOption}
				onChange={this.handleChange}
				// filterOptions={this.filterOptions}
				// filterOption={createFilter({ ignoreAccents: false })}
				// async={false}
				// autofocus={true}
				// clearable={true}
				// disabled={false}
				labelKey="label"
				// maxHeight={200}
				// multi={false}
				optionHeight={45}
				searchable={true}
				// simpleValue={true}
				placeholder={"Load an Opening..."}
				valueKey="value"
				// isLoading={true}
				// name="Openings"
				// defaultValue="asdf;lkasdf"
			/>
		);
	}
}

export default OpeningsDropdown;

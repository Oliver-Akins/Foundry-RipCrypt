const inputTypes = {
	set: displayOnly,
	integer: displayOnly,
	bar: displayOnly,
	dropdown: displayOnly,
	boolean: displayOnly,
};

function displayOnly(input) {
	return `<div data-input-type="${input.type}">${input.label}</div>`;
};

export function formFields(inputs) {
	let htmlString = ``;
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };
		htmlString += inputTypes[input.type](input);
	};
	return htmlString;
};

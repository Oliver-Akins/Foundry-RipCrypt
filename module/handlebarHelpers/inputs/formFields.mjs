import { stringSet } from "./stringSet.mjs";

const inputTypes = {
	"string-set": stringSet,
	integer: displayOnly,
	bar: displayOnly,
	dropdown: displayOnly,
	boolean: displayOnly,
};

function displayOnly(input) {
	return `<div data-input-type="${input.type}">${input.label}</div>`;
};

export function formFields(inputs, opts) {
	let htmlString = ``;
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };
		htmlString += inputTypes[input.type](input, opts.data.root);
	};
	return htmlString;
};

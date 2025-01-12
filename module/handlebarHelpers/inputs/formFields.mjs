import { numberInput } from "./numberInput.mjs";
import { stringSet } from "./stringSet.mjs";

const inputTypes = {
	"string-set": stringSet,
	integer: numberInput,
	bar: displayOnly,
	dropdown: displayOnly,
	boolean: displayOnly,
};

function displayOnly(input) {
	return `<div data-input-type="${input.type}">${input.label}</div>`;
};

export function formFields(inputs, opts) {
	const fields = [];
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };
		fields.push(inputTypes[input.type](input, opts.data.root));
	};
	return fields.join(opts.hash?.joiner ?? `<hr />`);
};

import { barInput } from "./barInput.mjs";
import { booleanInput } from "./booleanInput.mjs";
import { dropdownInput } from "./dropdownInput.mjs";
import { numberInput } from "./numberInput.mjs";
import { stringSet } from "./stringSet.mjs";

const { getType } = foundry.utils;

const inputTypes = {
	"string-set": stringSet,
	integer: numberInput,
	bar: barInput,
	dropdown: dropdownInput,
	boolean: booleanInput,
};

const typesToSanitize = new Set([ `string`, `number` ]);

function displayOnly(input) {
	return `<div data-input-type="${input.type}">${input.label}</div>`;
};

export function formFields(inputs, opts) {
	const fields = [];
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };

		input.limited ??= true;

		if (typesToSanitize.has(getType(input.value))) {
			input.value = Handlebars.escapeExpression(input.value);
		};
		fields.push(inputTypes[input.type](input, opts.data.root));
	};
	return fields
		.filter(i => i.length > 0)
		.join(opts.hash?.joiner ?? `<hr />`);
};

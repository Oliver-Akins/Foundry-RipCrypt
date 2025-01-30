import { barInput } from "./barInput.mjs";
import { booleanInput } from "./booleanInput.mjs";
import { dropdownInput } from "./dropdownInput.mjs";
import { groupInput } from "./groupInput.mjs";
import { numberInput } from "./numberInput.mjs";
import { stringSet } from "./stringSet.mjs";
import { textInput } from "./textInput.mjs";

const { getType } = foundry.utils;

const inputTypes = {
	"string-set": stringSet,
	integer: numberInput,
	bar: barInput,
	dropdown: dropdownInput,
	boolean: booleanInput,
	group: groupInput,
	text: textInput,
};

const typesToSanitize = new Set([ `string`, `number` ]);

export function formFields(inputs, opts) {
	const fields = [];
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };

		if (input.type !== `group`) {
			input.limited ??= true;
		};

		if (typesToSanitize.has(getType(input.value))) {
			input.value = Handlebars.escapeExpression(input.value);
		};
		fields.push(inputTypes[input.type](input, opts.data.root));
	};
	return fields
		.filter(i => i.length > 0)
		.join(opts.hash?.joiner ?? `<hr />`);
};

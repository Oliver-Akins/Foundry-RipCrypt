import { barInput } from "./barInput.mjs";
import { booleanInput } from "./booleanInput.mjs";
import { costInput } from "./currency.mjs";
import { dropdownInput } from "./dropdownInput.mjs";
import { groupInput } from "./groupInput.mjs";
import { numberInput } from "./numberInput.mjs";
import { prosemirrorInput } from "./prosemirrorInput.mjs";
import { stringSet } from "./stringSet.mjs";
import { textInput } from "./textInput.mjs";

const { getType } = foundry.utils;

const inputTypes = {
	"string-set": stringSet,
	prosemirror: prosemirrorInput,
	integer: numberInput,
	bar: barInput,
	dropdown: dropdownInput,
	boolean: booleanInput,
	group: groupInput,
	text: textInput,
	cost: costInput,
};

const typesToSanitize = new Set([ `string`, `number` ]);

export function formFields(inputs, opts) {
	const fields = [];
	for (const input of inputs) {
		if (inputTypes[input.type] == null) { continue };

		if (input.type !== `group`) {
			input.limited ??= true;
		};

		if (
			input.type !== `prosemirror`
			&& typesToSanitize.has(getType(input.value))
		) {
			input.value = Handlebars.escapeExpression(input.value);
		};
		fields.push(inputTypes[input.type](input, opts.data.root));
	};
	return fields
		.filter(i => i.length > 0)
		.join(opts.hash?.joiner ?? `<hr />`);
};

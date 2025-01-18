import { localizer } from "../../utils/Localizer.mjs";

export function numberInput(input, data) {
	const label = localizer(input.label);
	const id = `${data.meta.idp}-${input.id}`;

	if (!data.meta.editable) {
		return `<div data-input-type="integer">
			<span class="label">${label}</span>
			<span class="value">${data.meta.limited && input.limited ? `???` : input.value}</span>
		</div>`;
	};

	let attrs = ``;
	if (input.min) { attrs += ` min="${input.min}"` };
	if (input.max) { attrs += ` max="${input.max}"` };
	if (input.step) { attrs += `step="${input.step}"` };

	return `<div data-input-type="integer">
		<label
			for="${id}"
		>
			${label}
		</label>
		<input
			type="number"
			id="${id}"
			value="${input.value}"
			name="${input.path}"
			${attrs}
		/>
	</div>`;
};

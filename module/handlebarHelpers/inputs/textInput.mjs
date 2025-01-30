import { localizer } from "../../utils/Localizer.mjs";

export function textInput(input, data) {
	const label = localizer(input.label);
	const id = `${data.meta.idp}-${input.id}`;

	if (!data.meta.editable) {
		return `<div data-input-type="integer">
			<span class="label">${label}</span>
			<span class="value">${data.meta.limited && input.limited ? `???` : input.value}</span>
		</div>`;
	};

	return `<div data-input-type="text">
		<label
			for="${id}"
		>
			${label}
		</label>
		<input
			type="text"
			id="${id}"
			value="${input.value}"
			name="${input.path}"
		/>
	</div>`;
};

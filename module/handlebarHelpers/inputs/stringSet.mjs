import { localizer } from "../../utils/Localizer.mjs";

const { randomID } = foundry.utils;

export function stringSet(input, data) {
	const label = localizer(input.label);
	const id = `${data.meta.idp}-${randomID(10)}`;

	if (!data.meta.editable) {
		return `<div data-input-type="string-set">
			<span class="label">${label}</span>
			<span>${input.value}</span>
		</div>`;
	};

	return `<div data-input-type="string-set">
		<label
			for="${id}"
		>
			${label}
		</label>
		<string-tags
			id="${id}"
			value="${input.value}"
			name="${input.path}"
		/>
	</div>`;
};

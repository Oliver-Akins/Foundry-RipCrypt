import { localizer } from "../../utils/Localizer.mjs";

export function booleanInput(input, data) {
	const label = localizer(input.label);
	const id = `${data.meta.idp}-${input.id}`;

	if (data.meta.limited) {
		return `<div data-input-type="boolean">
			<span class="label">${label}</span>
			<div>
				<span class="value">???</span>
			</div>
		</div>`;
	};

	return `<div data-input-type="boolean">
		<label for="${id}">
			${label}
		</label>
		<div class="checkbox-container">
			<input
				type="checkbox"
				id="${id}"
				${input.value ? `checked` : ``}
				name="${input.path}"
				${data.meta.editable ? `` : `disabled`}
			>
		</div>
	</div>`;
};

import { localizer } from "../../utils/Localizer.mjs";

export function stringSet(input, data) {
	const label = localizer(input.label);

	if (!data.meta.editable) {
		return `<div data-input-type="string-set">
			<span class="label">${label}</span>
			<span>${input.value}</span>
		</div>`;
	};

	return `<div data-input-type="string-set">
		<label
			for="${data.meta.idp}-traits"
		>
			${label}
		</label>
		<string-tags
			id="${data.meta.idp}-traits"
			value="${input.value}"
			name="${input.path}"
		/>
	</div>`;
};

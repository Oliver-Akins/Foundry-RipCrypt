import { localizer } from "../../utils/Localizer.mjs";

export function barInput(input, data) {
	const label = localizer(input.label);

	// Trying to do limited bar info is... annoying to do.
	if (data.meta.limited && input.limited) {
		return ``;
	};

	return `<div data-input-type="bar">
		<span class="label" aria-hidden="true">
			${label}
		</span>
		<div class="pill-bar">
			<input
				type="number"
				aria-label="${localizer(input.value.label)}"
				${data.meta.editable ? `` : `disabled`}
				name="${input.value.path}"
				value="${input.value.value}"
				min="${input.value.min ?? ``}"
				max="${input.value.max ?? ``}"
			>
			<input
				type="number"
				aria-label="${localizer(input.max.label)}"
				${data.meta.editable ? `` : `disabled`}
				name="${input.max.path}"
				value="${input.max.value}"
				min="${input.max.min ?? ``}"
				max="${input.max.max ?? ``}"
			>
		</div>
	</div>`;
};

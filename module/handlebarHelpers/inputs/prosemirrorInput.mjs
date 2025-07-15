import { localizer } from "../../utils/Localizer.mjs";

export function prosemirrorInput(input, data) {
	const label = localizer(input.label);

	if (!data.meta.editable) {
		return `<div data-input-type="prose-mirror">
			<div class="label-row">
				<div class="label">
					${label}
				</div>
			</div>
			<div class="value">
				${input.value}
			</div>
		</div>`;
	};

	return `<div data-input-type="prose-mirror">
		<div class="label-row">
			<div class="label">
				${label}
			</div>
			<button
				type="button"
				data-action="openRichEditor"
				data-uuid="${input.uuid}"
				data-path="${input.path}"
				data-compact="${input.compact}"
				data-collaborative="${input.collaborative}"
			>
				${localizer(`RipCrypt.common.edit`)}
			</button>
		</div>

		<!--
		This cannot be spread across multiple lines because of the :empty selector
		considering whitespace as "not being empty". Though browsers will eventually
		treat :empty as "empty, or only whitespace".
		-->
		<div class="value">${input.value}</div>
	</div>`;
};

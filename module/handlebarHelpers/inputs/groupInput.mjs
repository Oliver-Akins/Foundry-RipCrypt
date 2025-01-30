import { formFields } from "./formFields.mjs";
import { localizer } from "../../utils/Localizer.mjs";

export function groupInput(input, data) {
	const title = localizer(input.title);

	const content = formFields(
		input.fields,
		{
			data: { root: data },
			hash: { joiner: input.joiner ?? `` },
		},
	);

	return `<rc-border
		data-input-type="group"
		var:border-color="${input.borderColor ?? `var(--accent-1)`}"
		var:vertical-displacement="${input.verticalDisplacement ?? `12px`}"
		var:padding-top="${input.paddingTop ?? `16px`}"
	>
		<div slot="title">${title}</div>
		<div slot="content" class="content">
			${content}
		</div>
	</rc-border>`;
};

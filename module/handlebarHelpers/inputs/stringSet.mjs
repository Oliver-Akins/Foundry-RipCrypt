import { localizer } from "../../utils/Localizer.mjs";

const { randomID } = foundry.utils;

export function stringSet(input, data) {
	const label = localizer(input.label);
	const placeholder = localizer(input.placeholder ?? ``);
	const id = `${data.meta.idp}-${randomID(10)}`;

	if (!data.meta.editable) {
		const tagList = input.value
			.split(/,\s*/)
			.filter(t => t.length > 0)
			.map(t => {
				return `<div class="tag">${t.trim()}</div>`;
			});
		let count = tagList.length;
		let tags = tagList.join(``);

		if (tagList.length === 0) {
			tags = `---`;
		};

		if (data.meta.limited && input.limited) {
			count = 0;
			tags = `???`;
		};

		return `<div data-input-type="string-set">
			<span class="label">${label}</span>
			<div
				class="input-element-tags tags ${count == 0 ? `empty` : ``}"
				data-tag-count="${count}"
			>
				${tags}
			</div>
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
			placeholder="${placeholder}"
			value="${input.value}"
			name="${input.path}"
		/>
	</div>`;
};

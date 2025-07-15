import { groupInput } from "./groupInput.mjs";

export function costInput(input, data) {
	return groupInput({
		title: input.label,
		fields: [
			{
				id: input.id + `-gold`,
				type: `integer`,
				label: `RipCrypt.common.currency.gold`,
				value: input.gold,
				path: `system.cost.gold`,
				limited: input.limited,
			},
			{
				id: input.id + `-silver`,
				type: `integer`,
				label: `RipCrypt.common.currency.silver`,
				value: input.silver,
				path: `system.cost.silver`,
				limited: input.limited,
			},
			{
				id: input.id + `-copper`,
				type: `integer`,
				label: `RipCrypt.common.currency.copper`,
				value: input.copper,
				path: `system.cost.copper`,
				limited: input.limited,
			},
		],
	}, data);
};

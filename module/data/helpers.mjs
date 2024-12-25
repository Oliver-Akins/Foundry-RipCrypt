const { fields } = foundry.data;

export function barAttribute(min, initial, max = undefined) {
	return new fields.SchemaField({
		value: new fields.NumberField({
			min,
			initial,
			max,
			integer: true,
			nullable: false,
		}),
		max: new fields.NumberField({
			min,
			initial,
			max,
			integer: true,
			nullable: false,
		}),
	});
};

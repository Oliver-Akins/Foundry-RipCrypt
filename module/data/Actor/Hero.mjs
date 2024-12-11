const { fields } = foundry.data;

export class HeroData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const schema = new fields.SchemaField({
			ability: new fields.SchemaField({
				grit: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				gait: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				grip: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				glim: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
			}),
		});
		return schema;
	};

	prepareBaseData() {};

	prepareDerivedData() {};
};

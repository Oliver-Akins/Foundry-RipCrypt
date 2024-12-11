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
			coin: new fields.SchemaField({
				gold: new fields.NumberField({
					initial: 5,
					integer: true,
					required: true,
					nullable: false,
				}),
				silver: new fields.NumberField({
					initial: 0,
					integer: true,
					required: true,
					nullable: false,
				}),
				copper: new fields.NumberField({
					initial: 0,
					integer: true,
					required: true,
					nullable: false,
				}),
			}),
		});
		return schema;
	};

	prepareBaseData() {
		super.prepareBaseData();

		// The limitations imposed on things like inventory spaces and equipped
		// weapon count
		this.limit = {
			weapons: 4,
			equipment: 12,
		};
	};

	prepareDerivedData() {};
};

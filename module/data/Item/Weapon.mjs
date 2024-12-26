const { fields } = foundry.data;

export class WeaponData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			traits: new fields.SetField(
				new fields.StringField({
					blank: false,
					trim: true,
					nullable: false,
				}),
				{
					nullable: false,
					required: true,
				},
			),
		};
	};

	prepareBaseData() {
		super.prepareBaseData();
	};

	prepareDerivedData() {
		super.prepareDerivedData();
	};
};

import { optionalInteger } from "../helpers.mjs";

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
			range: new fields.SchemaField({
				short: optionalInteger(),
				long: optionalInteger(),
			}),
		};
	};

	prepareBaseData() {
		super.prepareBaseData();
	};

	prepareDerivedData() {
		super.prepareDerivedData();
	};
};

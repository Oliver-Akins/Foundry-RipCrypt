import { barAttribute, optionalInteger, requiredInteger } from "../helpers.mjs";
import { gameTerms } from "../../gameTerms.mjs";

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
			damage: requiredInteger({ min: 0, initial: 0 }),
			wear: barAttribute(0, 0, 4),
			access: new fields.StringField({
				blank: true,
				nullable: false,
				trim: true,
				choices: gameTerms.Access,
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

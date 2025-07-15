import { optionalInteger, requiredInteger } from "../helpers.mjs";
import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

export class CommonItemData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		return {
			quantity: requiredInteger({ min: 0, initial: 1 }),
			access: new fields.StringField({
				blank: true,
				nullable: false,
				trim: true,
				choices: gameTerms.Access,
			}),
			cost: new fields.SchemaField({
				gold: optionalInteger(),
				silver: optionalInteger(),
				copper: optionalInteger(),
			}),
		};
	};

	// MARK: Base Data
	prepareBaseData() {
		super.prepareBaseData();
	};

	// MARK: Derived Data
	prepareDerivedData() {
		super.prepareDerivedData();
	};
};

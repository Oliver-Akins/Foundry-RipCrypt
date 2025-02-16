import { gameTerms } from "../../gameTerms.mjs";
import { requiredInteger } from "../helpers.mjs";

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

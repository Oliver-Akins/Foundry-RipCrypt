import { requiredInteger } from "../helpers.mjs";

export class CommonItemData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		return {
			quantity: requiredInteger({ min: 0, initial: 1 }),
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

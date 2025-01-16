import { requiredInteger } from "../helpers.mjs";

const { fields } = foundry.data;

export class ArmourData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		return {
			protection: requiredInteger({ min: 0, initial: 1 }),
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

	// #region Sheet Data
	getFormFields(ctx) {
		const fields = [
			{
				type: `integer`,
				label: `RipCrypt.common.protection`,
				value: this.protection,
				path: `system.protection`,
				min: 0,
			},
		];
		return fields;
	};
	// #endregion
};

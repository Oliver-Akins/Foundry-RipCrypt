const { fields } = foundry.data;

export class ArmourData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		return {};
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
		const fields = [];
		return fields;
	};
	// #endregion
};

export class SkillData extends foundry.abstract.TypeDataModel {
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

	// #region Getters
	// #endregion

	// #region Sheet Data
	getFormFields(_ctx) {
		const fields = [];
		return fields;
	};
	// #endregion
};

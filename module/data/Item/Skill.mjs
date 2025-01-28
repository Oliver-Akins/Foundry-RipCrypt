import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

export class SkillData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		const schema = {};

		const advances = {};
		for (const rank of Object.values(gameTerms.Rank)) {
			advances[rank] = new fields.StringField({
				blank: false,
				nullable: true,
				initial: null,
			});
		};
		schema.advances = new fields.SchemaField(advances);

		return schema;
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

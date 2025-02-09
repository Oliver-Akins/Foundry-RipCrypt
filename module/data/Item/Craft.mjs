import { gameTerms } from "../../gameTerms.mjs";
import { SkillData } from "./Skill.mjs";

const { fields } = foundry.data;

export class CraftData extends SkillData {
	// MARK: Schema
	static defineSchema() {
		const schema = super.defineSchema();
		delete schema.ability;

		schema.aspect = new fields.StringField({
			initial: gameTerms.Aspects.FLECT,
			blank: true,
			trim: true,
			nullable: false,
			required: true,
			choices: () => Object.values(gameTerms.Aspects),
		});

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
		const fields = [
			{
				id: `fate-path`,
				type: `dropdown`,
				label: `RipCrypt.common.aspect`,
				path: `system.aspect`,
				value: this.aspect,
				options: Object.values(gameTerms.Aspects).map(aspect => ({
					label: `RipCrypt.common.aspectNames.${aspect}`,
					value: aspect,
				})),
			},
			{
				type: `group`,
				title: `RipCrypt.common.advances`,
				paddingTop: `20px`,
				fields: Object.values(gameTerms.Rank).map(rank => {
					return {
						id: `advance-${rank}`,
						type: `text`,
						label: `RipCrypt.common.rankNames.${rank}`,
						path: `system.advances.${rank}`,
						value: this.advances[rank] ?? ``,
					};
				}),
			},
		];
		return fields;
	};
	// #endregion
};

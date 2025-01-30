import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

const abilityPaths = [`grit`, `gait`, `grip`, `glim`, `thin-glim`];

export class SkillData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		const schema = {
			ability: new fields.StringField({
				initial: abilityPaths[0],
				blank: true,
				trim: true,
				nullable: false,
				required: true,
				choices: () => abilityPaths,
			}),
		};

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
		const fields = [
			{
				id: `fate-path`,
				type: `dropdown`,
				label: `RipCrypt.common.ability`,
				path: `system.ability`,
				value: this.ability,
				options: abilityPaths.map(ability => ({
					label: `RipCrypt.common.abilities.${ability}`,
					value: ability,
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

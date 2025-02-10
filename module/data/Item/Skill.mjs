import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

export class SkillData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		const schema = {
			ability: new fields.StringField({
				initial: gameTerms.Abilities.GRIT,
				blank: true,
				trim: true,
				nullable: false,
				required: true,
				choices: () => Object.values(gameTerms.Abilities),
			}),
			description: new fields.HTMLField({
				blank: true,
				nullable: false,
				trim: true,
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
				options: Object.values(gameTerms.Abilities).map(ability => ({
					label: `RipCrypt.common.abilities.${ability}`,
					value: ability,
				})),
			},
			{
				// TODO: Figure out how tf to make this work nicely on a generic level
				id: `description`,
				type: `prosemirror`,
				label: `RipCrypt.common.description`,
				path: `system.description`,
				collaborative: true,
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

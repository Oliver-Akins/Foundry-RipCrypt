import { barAttribute, optionalInteger, requiredInteger } from "../helpers.mjs";
import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

export class WeaponData extends foundry.abstract.TypeDataModel {
	// MARK: Schema
	static defineSchema() {
		return {
			traits: new fields.SetField(
				new fields.StringField({
					blank: false,
					trim: true,
					nullable: false,
				}),
				{
					nullable: false,
					required: true,
				},
			),
			range: new fields.SchemaField({
				short: optionalInteger(),
				long: optionalInteger(),
			}),
			damage: requiredInteger({ min: 0, initial: 0 }),
			wear: barAttribute(0, 0, 4),
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

	// #region Getters
	get traitString() {
		return [...this.traits].join(`, `);
	};

	get rangeString() {
		if (this.range.short && this.range.long) {
			return `${this.range.short} / ${this.range.long}`;
		};
		return String(this.range.short ?? this.range.long ?? ``);
	};
	// #endregion

	// #region Sheet Data
	getFormFields(_ctx) {
		const fields = [
			{
				id: `traits`,
				type: `string-set`,
				label: `RipCrypt.common.traits`,
				placeholder: `RipCrypt.Apps.traits-placeholder`,
				path: `system.traits`,
				value: this.traitString,
			},
			{
				id: `short-range`,
				type: `integer`,
				label: `RipCrypt.Apps.short-range`,
				path: `system.range.short`,
				value: this.range.short ?? ``,
				min: 0,
			},
			{
				id: `long-range`,
				type: `integer`,
				label: `RipCrypt.Apps.long-range`,
				path: `system.range.long`,
				value: this.range.long ?? ``,
				min: 0,
			},
			{
				id: `damage`,
				type: `integer`,
				label: `RipCrypt.common.damage`,
				path: `system.damage`,
				value: this.damage,
				min: 0,
			},
			{
				type: `bar`,
				label: `RipCrypt.common.wear`,
				value: {
					label: `RipCrypt.Apps.current-wear`,
					path: `system.wear.value`,
					value: this.wear.value,
					min: 0, max: this.wear.max,
				},
				max: {
					label: `RipCrypt.Apps.max-wear`,
					path: `system.wear.max`,
					value: this.wear.max,
					min: 0,
				},
			},
			{
				id: `access`,
				type: `dropdown`,
				label: `Access`,
				path: `system.access`,
				value: this.access,
				limited: false,
				options: [
					{
						label: `RipCrypt.common.empty`,
						value: ``,
					},
					...gameTerms.Access.map(opt => ({
						label: `RipCrypt.common.access.${opt}`,
						value: opt,
					})),
				],
			},
		];

		if (this.parent.isEmbedded) {
			fields.push({
				id: `equipped`,
				type: `boolean`,
				label: `Equipped`,
			});
		};

		return fields;
	};
	// #endregion
};

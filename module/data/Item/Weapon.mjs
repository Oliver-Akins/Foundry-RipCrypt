import { barAttribute, optionalInteger, requiredInteger } from "../helpers.mjs";
import { CommonItemData } from "./Common.mjs";
import { gameTerms } from "../../gameTerms.mjs";

const { fields } = foundry.data;

export class WeaponData extends CommonItemData {
	// MARK: Schema
	static defineSchema() {
		return {
			...super.defineSchema(),
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
			equipped: new fields.BooleanField({
				initial: false,
				required: true,
				nullable: false,
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
				id: `quantity`,
				type: `integer`,
				label: `RipCrypt.common.quantity`,
				path: `system.quantity`,
				value: this.quantity,
				min: 0,
			},
			{
				id: `traits`,
				type: `string-set`,
				label: `RipCrypt.common.traits`,
				placeholder: `RipCrypt.Apps.traits-placeholder`,
				path: `system.traits`,
				value: this.traitString,
			},
		];

		// Add the range inputs depending on whether the user wants condensed range
		// or not.
		if (game.settings.get(`ripcrypt`, `condensedRange`)) {
			fields.push({
				type: `bar`,
				label: `RipCrypt.common.range`,
				value: {
					label: `RipCrypt.Apps.short-range`,
					path: `system.range.short`,
					value: this.range.short,
				},
				max: {
					label: `RipCrypt.Apps.long-range`,
					path: `system.range.long`,
					value: this.range.long,
				},
			});
		} else {
			fields.push({
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
			});
		};

		fields.push(
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
		);

		if (this.parent.isEmbedded) {
			fields.push({
				id: `equipped`,
				type: `boolean`,
				label: `RipCrypt.common.equipped`,
				value: this.equipped,
				path: `system.equipped`,
			});
		};

		return fields;
	};
	// #endregion
};

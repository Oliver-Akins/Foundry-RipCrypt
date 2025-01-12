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
	}

	get rangeString() {
		if (this.range.short && this.range.long) {
			return `${this.range.short} / ${this.range.long}`;
		};
		return String(this.range.short ?? this.range.long ?? ``);
	}
	// #endregion

	// #region Sheet Data
	getFormFields(ctx) {
		const fields = [
			{
				type: `string-set`,
				label: `RipCrypt.common.traits`,
				placeholder: `RipCrypt.Apps.traits-placeholder`,
				path: `system.traits`,
				value: ctx.meta.limited ? `???` : this.traitString,
			},
			{
				type: `integer`,
				label: `RipCrypt.Apps.short-range`,
				path: `system.range.short`,
				value: ctx.meta.limited ? `???` : (this.range.short ?? ``),
				min: 0,
			},
			{
				type: `integer`,
				label: `RipCrypt.Apps.long-range`,
				path: `system.range.long`,
				value: ctx.meta.limited ? `???` : (this.range.long ?? ``),
				min: 0,
			},
			{
				type: `integer`,
				label: `RipCrypt.common.damage`,
				path: `system.damage`,
				value: ctx.meta.limited ? `???` : this.damage,
				min: 0,
			},
			// { type: `bar`, label: `Wear` },
			// { type: `dropdown`, label: `Access` },
		];

		if (this.parent.isEmbedded) {
			fields.push({ type: `boolean`, label: `Equipped` });
		};

		return fields;
	};
	// #endregion
};

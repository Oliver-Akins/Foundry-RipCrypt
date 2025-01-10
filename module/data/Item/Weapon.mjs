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
				path: `system.traits`,
				value: this.traitString,
			},
			{ type: `integer`, label: `Short Range` },
			{ type: `integer`, label: `Long Range` },
			{ type: `integer`, label: `Damage` },
			{ type: `bar`, label: `Wear` },
			{ type: `dropdown`, label: `Access` },
		];

		if (this.parent.isEmbedded) {
			fields.push({ type: `boolean`, label: `Equipped` });
		};

		return fields;
	};
	// #endregion
};

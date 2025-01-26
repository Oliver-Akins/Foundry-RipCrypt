import { CommonItemData } from "./Common.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { requiredInteger } from "../helpers.mjs";

const { fields } = foundry.data;

/** Used for Armour and Shields */
export class ProtectorData extends CommonItemData {
	// MARK: Schema
	static defineSchema() {
		return {
			...super.defineSchema(),
			protection: requiredInteger({ min: 0, initial: 1 }),
			location: new fields.SetField(
				new fields.StringField({
					blank: false,
					trim: true,
					nullable: false,
					options: Object.values(gameTerms.Anatomy),
				}),
				{
					nullable: false,
					required: true,
				},
			),
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
	get locationString() {
		return [...this.location].join(`, `);
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
				id: `location`,
				type: `string-set`,
				label: `RipCrypt.common.location`,
				placeholder: `RipCrypt.Apps.location-placeholder`,
				path: `system.location`,
				value: this.locationString,
			},
			{
				id: `protection`,
				type: `integer`,
				label: `RipCrypt.common.protection`,
				value: this.protection,
				path: `system.protection`,
				min: 0,
			},
		];

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

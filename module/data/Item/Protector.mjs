import { CommonItemData } from "./Common.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { requiredInteger } from "../helpers.mjs";

const { fields } = foundry.data;
const { hasProperty, mergeObject } = foundry.utils;

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

	// #region Lifecycle
	async _preUpdate(changes, options, user) {
		if (options.force && game.settings.get(`ripcrypt`, `devMode`)) { return };
		let valid = super._preUpdate(changes, options, user);

		if (hasProperty(changes, `system.equipped`) && !this.parent.isEmbedded) {
			ui.notifications.error(localizer(
				`RipCrypt.notifs.error.cannot-equip-not-embedded`,
				{ itemType: `@TYPES.Item.${this.parent.type}` },
			));
			mergeObject(
				changes,
				{ "-=system.equipped": null },
				{ inplace: true, performDeletions: true },
			);
			return false;
		};
		return valid;
	};
	// #endregion

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

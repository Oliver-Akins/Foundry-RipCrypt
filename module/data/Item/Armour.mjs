import { CommonItemData } from "./Common.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";
import { requiredInteger } from "../helpers.mjs";

const { fields } = foundry.data;
const { hasProperty, diffObject, mergeObject } = foundry.utils;

/** Used for Armour and Shields */
export class ArmourData extends CommonItemData {
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
			weight: new fields.StringField({
				blank: false,
				nullable: true,
				initial: null,
				options: Object.values(gameTerms.WeightRatings),
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
		// return false
		if (options.force && game.settings.get(`ripcrypt`, `devMode`)) { return };

		// Ensure changes is a diffed object
		const diff = diffObject(this.parent._source, changes);
		let valid = await super._preUpdate(changes, options, user);

		if (hasProperty(diff, `system.equipped`) && !this._canEquip()) {
			ui.notifications.error(
				localizer(
					`RipCrypt.notifs.error.cannot-equip`,
					{ itemType: `@TYPES.Item.${this.parent.type}` },
				),
				{ console: false },
			);

			// Don't stop the update, but don't allow changing the equipped status
			mergeObject(changes, {
				"system.equipped": false,
			});

			// Set a flag so that we can tell the sheet that it needs to rerender
			this.forceRerender = true;
		};

		return valid;
	};

	/** Used to tell the preUpdate logic whether or not to prevent the */
	_canEquip() {
		const parent = this.parent;
		if (!parent.isEmbedded || !(parent.parent instanceof Actor)) {
			Logger.error(`Unable to equip item when it's not embedded`);
			return false;
		};

		if (this.location.size === 0) {
			Logger.error(`Unable to equip an item without any locations`);
			return false;
		};

		const slots = parent.parent.system.equippedArmour ?? {};
		Logger.debug(`slots`, slots);
		for (const locationTag of this.location) {
			if (slots[locationTag.toLowerCase()] != null) {
				Logger.error(`Unable to equip multiple items in the same slot`);
				return false;
			};
		};
		return true;
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
				id: `access`,
				type: `dropdown`,
				label: `RipCrypt.common.access`,
				path: `system.access`,
				value: this.access,
				limited: false,
				options: [
					{
						label: `RipCrypt.common.empty`,
						value: ``,
					},
					...gameTerms.Access.map(opt => ({
						label: `RipCrypt.common.accessLevels.${opt}`,
						value: opt,
					})),
				],
			},
			{
				id: `cost`,
				type: `cost`,
				label: `RipCrypt.common.cost`,
				gold: this.cost.gold,
				silver: this.cost.silver,
				copper: this.cost.copper,
			},
			{
				id: `weight`,
				type: `dropdown`,
				label: `RipCrypt.common.weightRating`,
				path: `system.weight`,
				value: this.weight,
				options: [
					{
						label: `RipCrypt.common.empty`,
						value: null,
					},
					...Object.values(gameTerms.WeightRatings).map(opt => ({
						label: `RipCrypt.common.weightRatings.${opt}`,
						value: opt,
					})),
				],
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

import { filePath } from "../../consts.mjs";
import { GenericPopoverMixin } from "./GenericPopoverMixin.mjs";
import { ItemFlags } from "../../flags/item.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class AmmoTracker extends GenericPopoverMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt`,
		],
		window: {
			title: `RipCrypt.app-titles.AmmoTracker`,
			contentClasses: [
				`ripcrypt--AmmoTracker`,
			],
		},
		actions: {
			favourite: this.#favourite,
			unfavourite: this.#unfavourite,
		},
	};

	static PARTS = {
		ammoList: {
			template: filePath(`templates/Apps/popovers/AmmoTracker/ammoList.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	_favouriteCount = 0;
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, data) {
		const ctx = {
			meta: { idp: this.id },
			partId,
		};

		let favouriteCount = 0;
		ctx.ammos = data.ammos.map(ammo => {
			const favourite = ammo.getFlag(game.system.id, ItemFlags.FAVOURITE) ?? false;
			if (favourite) { favouriteCount++ };

			return {
				ammo,
				favourite,
			};
		});

		this._favouriteCount = favouriteCount;
		ctx.atFavouriteLimit = favouriteCount >= 3;
		return ctx;
	};
	// #endregion

	// #region Actions
	static async #favourite(_, el) {
		const targetEl = el.closest(`[data-item-id]`);
		if (!targetEl) {
			Logger.warn(`Cannot find a parent element with data-item-id`);
			return;
		};

		if (this._favouriteCount > 3) {
			ui.notifications.error(localizer(`RipCrypt.notifs.error.at-favourite-limit`));
			return;
		};

		const data = targetEl.dataset;
		const item = await fromUuid(data.itemId);
		if (!item) { return };

		item.setFlag(game.system.id, ItemFlags.FAVOURITE, true);
	};

	static async #unfavourite(_, el) {
		const targetEl = el.closest(`[data-item-id]`);
		if (!targetEl) {
			Logger.warn(`Cannot find a parent element with data-item-id`);
			return;
		};

		const data = targetEl.dataset;
		const item = await fromUuid(data.itemId);
		if (!item) { return };

		item.unsetFlag(game.system.id, ItemFlags.FAVOURITE);
	};
	// #endregion
};

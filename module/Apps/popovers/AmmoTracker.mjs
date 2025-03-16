import { filePath } from "../../consts.mjs";
import { GenericPopoverMixin } from "./GenericPopoverMixin.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class AmmoTracker extends GenericPopoverMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt`,
		],
		window: {
			title: `Ammo Tracker`,
			contentClasses: [
				`ripcrypt--AmmoTracker`,
			],
		},
		actions: {},
	};

	static PARTS = {
		ammoList: {
			template: filePath(`templates/Apps/popovers/AmmoTracker/ammoList.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, data) {
		const ctx = { partId };
		ctx.canPin = false;
		ctx.ammos = data.ammos;
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

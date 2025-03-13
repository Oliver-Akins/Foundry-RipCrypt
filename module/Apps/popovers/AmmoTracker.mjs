import { filePath } from "../../consts.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class AmmoTracker extends GenericAppMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--AmmoTracker`,
		],
		window: {
			frame: false,
			positioned: true,
			resizable: false,
			minimizable: false,
		},
		position: {
			width: 100,
			height: 30,
		},
		actions: {},
	};

	static PARTS = {
		main: {
			template: filePath(`templates/Apps/popovers/AmmoTracker/content.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	// #endregion

	// #region Lifecycle
	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		const ammoContainer = this.element.querySelector(`.ammo`);
		console.dir(ammoContainer);
	};
	// #endregion

	// #region Actions
	// #endregion
};

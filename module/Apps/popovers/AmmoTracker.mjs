import { filePath } from "../../consts.mjs";
import { GenericPopoverMixin } from "./GenericPopoverMixin.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class AmmoTracker extends GenericPopoverMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt`,
			`ripcrypt--AmmoTracker`,
		],
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
	// #endregion

	// #region Actions
	// #endregion
};

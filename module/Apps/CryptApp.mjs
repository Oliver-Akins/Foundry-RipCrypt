import { filePath } from "../consts.mjs";
import { GenericAppMixin } from "./GenericApp.mjs";
import { Logger } from "../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class CryptApp extends GenericAppMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		window: {
			title: `Crypt Overview`,
			frame: true,
			positioned: true,
			resizable: false,
			minimizable: true,
		},
		actions: {},
	};

	static PARTS = {
		main: {
			template: filePath(`Apps/CryptApp/main.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _renderFrame(options) {
		const frame = await super._renderFrame(options);
		this.window.close.remove(); // Prevent closing
		return frame;
	}

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		Logger.log(`Context`, ctx);
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

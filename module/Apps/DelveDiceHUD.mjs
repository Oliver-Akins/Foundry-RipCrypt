import { filePath } from "../consts.mjs";
import { Logger } from "../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

const conditions = [
	{ label: `RipCrypt.common.difficulties.easy`, value: 4 },
	{ label: `RipCrypt.common.difficulties.normal`, value: 5 },
	{ label: `RipCrypt.common.difficulties.tough`, value: 6 },
	{ label: `RipCrypt.common.difficulties.hard`, value: 7 },
];

export class DelveDiceHUD extends HandlebarsApplicationMixin(ApplicationV2) {
	// #region Options
	static DEFAULT_OPTIONS = {
		id: `ripcrypt-delve-dice`,
		tag: `aside`,
		classes: [
			`ripcrypt`,
			`ripcrypt--DelveDiceHUD`
		],
		window: {
			frame: false,
			positioned: false,
		},
		actions: {
			tourDelta: this.#tourDelta,
		},
	};

	static PARTS = {
		previousTour: {
			template: filePath(`templates/Apps/DelveDiceHUD/tour/previous.hbs`),
		},
		difficulty: {
			template: filePath(`templates/Apps/DelveDiceHUD/difficulty.hbs`),
		},
		fateCompass: {
			template: filePath(`templates/Apps/DelveDiceHUD/fateCompass.hbs`),
		},
		currentTour: {
			template: filePath(`templates/Apps/DelveDiceHUD/tour/current.hbs`),
		},
		nextTour: {
			template: filePath(`templates/Apps/DelveDiceHUD/tour/next.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	/**
	 * Injects the element into the Foundry UI in the top middle
	 */
	_insertElement(element) {
		const existing = document.getElementById(element.id);
		if (existing) {
			existing.replaceWith(element);
		} else {
			const parent = document.getElementById(`ui-top`);
			parent.prepend(element);
		};
	};

	async _onRender(context, options) {
		await super._onRender(context, options);

		// Shortcut because users can't edit
		if (!game.user.isGM) { return };
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.meta ??= {};

		ctx.meta.editable = game.user.isGM;

		switch (partId) {
			case `currentTour`: {
				await this._prepareTourContext(ctx);
				break;
			};
			case `difficulty`: {
				await this._prepareDifficultyContext(ctx);
				break;
			};
		};

		Logger.log(`${partId} Context`, ctx);
		return ctx;
	};

	async _prepareTourContext(ctx) {
		ctx.tour = game.settings.get(`ripcrypt`, `sandsOfFate`);
	};

	async _prepareDifficultyContext(ctx) {
		ctx.dc = game.settings.get(`ripcrypt`, `dc`);
	}
	// #endregion

	// #region Actions
	static async #tourDelta() {
		ui.notifications.info(`Button Clicked!`, { console: false });
	};
	// #endregion
};

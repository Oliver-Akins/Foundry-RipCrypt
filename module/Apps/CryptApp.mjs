import { filePath } from "../consts.mjs";
import { GenericAppMixin } from "./GenericApp.mjs";
import { Logger } from "../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

const conditions = [
	{ label: `RipCrypt.common.difficulties.easy`, value: 4 },
	{ label: `RipCrypt.common.difficulties.normal`, value: 5 },
	{ label: `RipCrypt.common.difficulties.tough`, value: 6 },
	{ label: `RipCrypt.common.difficulties.hard`, value: 7 },
];

export class CryptApp extends GenericAppMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--CryptApp`,
		],
		window: {
			title: `Crypt`,
			frame: true,
			positioned: true,
			resizable: false,
			minimizable: false,
		},
		position: {
			width: `auto`,
		},
		actions: {
			randomCondition: this.#randomCondition,
		},
	};

	static PARTS = {
		turnCount: {
			template: filePath(`templates/Apps/CryptApp/turnCount.hbs`),
		},
		delveConditions: {
			template: filePath(`templates/Apps/CryptApp/delveConditions.hbs`),
		},
		fate: {
			template: filePath(`templates/Apps/CryptApp/fate.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _renderFrame(options) {
		const frame = await super._renderFrame(options);
		this.window.close.remove(); // Prevent closing
		return frame;
	};

	async _onRender(context, options) {
		await super._onRender(context, options);

		// Shortcut because users can't edit
		if (!game.user.isGM) { return };

		// Add event listener for the dropdown
		if (options.parts.includes(`delveConditions`)) {
			const select = this.element.querySelector(`#${this.id}-difficulty`);
			select.addEventListener(`change`, async (ev) => {
				const newDifficulty = parseInt(ev.target.value);
				if (!Number.isNaN(newDifficulty)) {
					await game.settings.set(`ripcrypt`, `dc`, newDifficulty);
				};
				this.render({ parts: [`delveConditions`] });
			});
		};
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);

		ctx.meta.editable = game.user.isGM;

		switch (partId) {
			case `delveConditions`: {
				ctx = this._prepareDifficulty(ctx);
				break;
			};
		};

		Logger.log(`${partId} Context`, ctx);
		return ctx;
	};

	_prepareDifficulty(ctx) {
		ctx.options = conditions;
		ctx.difficulty = game.settings.get(`ripcrypt`, `dc`);
		return ctx;
	};
	// #endregion

	// #region Actions
	static async #randomCondition() {
		const dc = conditions[Math.floor(Math.random() * conditions.length)];
		await game.settings.set(`ripcrypt`, `dc`, dc.value);
		await this.render({ parts: [`delveConditions`] });
	};
	// #endregion
};

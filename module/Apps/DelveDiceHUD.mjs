import { distanceBetweenFates } from "../utils/distanceBetweenFates.mjs";
import { filePath } from "../consts.mjs";
import { gameTerms } from "../gameTerms.mjs";
import { Logger } from "../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { FatePath } = gameTerms;

const CompassRotations = {
	[FatePath.NORTH]: -90,
	[FatePath.EAST]: 0,
	[FatePath.SOUTH]: 90,
	[FatePath.WEST]: 180,
};

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
			`ripcrypt--DelveDiceHUD`,
		],
		window: {
			frame: false,
			positioned: false,
		},
		actions: {
			tourDelta: this.#tourDelta,
			setFate: this.#setFate,
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
		sandsOfFate: {
			template: filePath(`templates/Apps/DelveDiceHUD/tour/current.hbs`),
		},
		nextTour: {
			template: filePath(`templates/Apps/DelveDiceHUD/tour/next.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	/**
	 * The current number of degrees the compass pointer should be rotated, this
	 * is not stored in the DB since we only care about the initial rotation on
	 * reload, which is derived from the current fate.
	 * @type {Number}
	 */
	_rotation;

	constructor(...args) {
		super(...args);
		this._sandsOfFate = game.settings.get(`ripcrypt`, `sandsOfFate`);
		this._currentFate = game.settings.get(`ripcrypt`, `currentFate`);
		this._rotation = CompassRotations[this._currentFate];
		this._difficulty = game.settings.get(`ripcrypt`, `dc`);
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
			case `sandsOfFate`: {
				ctx.sandsOfFate = this._sandsOfFate;
				break;
			};
			case `difficulty`: {
				ctx.dc = this._difficulty;
				break;
			};
			case `fateCompass`: {
				ctx.fate = this._currentFate;
				ctx.rotation = `${this._rotation}deg`;
				break;
			};
		};

		Logger.log(`${partId} Context`, ctx);
		return ctx;
	};

	async animate({ parts = [] } = {}) {
		if (parts.includes(`fateCompass`)) {
			this.#animateCompassTo();
		};

		if (parts.includes(`sandsOfFate`)) {};
	};

	#animateCompassTo(newFate) {
		/** @type {HTMLElement|undefined} */
		const pointer = this.element.querySelector(`.compass-pointer`);
		if (!pointer) { return };

		let distance = distanceBetweenFates(this._currentFate, newFate);
		Logger.table({ newFate, fate: this._currentFate, distance, _rotation: this._rotation });
		if (distance === 3) { distance = -1 };

		this._rotation += distance * 90;

		pointer.style.setProperty(`transform`, `rotate(${this._rotation}deg)`);
	};
	// #endregion

	// #region Actions
	static async #tourDelta() {};

	/** @this {DelveDiceHUD} */
	static async #setFate(_event, element) {
		const fate = element.dataset.toFate;
		this.#animateCompassTo(fate);

		// must be done after animate, otherwise it won't change the rotation
		this._currentFate = fate;
		game.settings.set(`ripcrypt`, `currentFate`, fate);
	};
	// #endregion
};

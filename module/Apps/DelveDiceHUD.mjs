import { distanceBetweenFates, nextFate, previousFate } from "../utils/fates.mjs";
import { filePath } from "../consts.mjs";
import { gameTerms } from "../gameTerms.mjs";
import { localizer } from "../utils/Localizer.mjs";
import { Logger } from "../utils/Logger.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { ContextMenu } = foundry.applications.ui;
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
			`hud`,
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

		new ContextMenu(
			this.element,
			`#delve-difficulty`,
			[
				...conditions.map(condition => ({
					name: localizer(condition.label),
					callback: DelveDiceHUD.#setDifficulty.bind(this, condition.value),
				})),
				{
					name: localizer(`RipCrypt.common.difficulties.random`),
					callback: () => {
						const condition = conditions[Math.floor(Math.random() * conditions.length)];
						DelveDiceHUD.#setDifficulty.bind(this)(condition.value);
					},
				},
			],
			{ jQuery: false, fixed: true },
		);
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

		if (parts.includes(`sandsOfFate`)) {
			this.#animateSandsTo();
		};
	};

	#animateCompassTo(newFate) {
		if (newFate === this._currentFate) { return };

		/** @type {HTMLElement|undefined} */
		const pointer = this.element.querySelector(`.compass-pointer`);
		if (!pointer) { return };

		newFate ??= game.settings.get(`ripcrypt`, `currentFate`);

		let distance = distanceBetweenFates(this._currentFate, newFate);
		if (distance === 3) { distance = -1 };

		this._rotation += distance * 90;

		pointer.style.setProperty(`transform`, `rotate(${this._rotation}deg)`);
		this._currentFate = newFate;
	};

	#animateSandsTo(newSands) {
		/** @type {HTMLElement|undefined} */
		const sands = this.element.querySelector(`.sands-value`);
		if (!sands) { return };

		newSands ??= game.settings.get(`ripcrypt`, `sandsOfFate`);

		sands.innerHTML = newSands;
		this._sandsOfFate = newSands;
	};
	// #endregion

	// #region Actions
	/** @this {DelveDiceHUD} */
	static async #tourDelta(_event, element) {
		const delta = parseInt(element.dataset.delta);
		const initial = game.settings.get(`ripcrypt`, `sandsOfFateInitial`);
		let newSands = this._sandsOfFate + delta;

		if (newSands > initial) {
			Logger.info(`Cannot go to a previous Delve Tour above the initial value`);
			return;
		};

		if (newSands === 0) {
			newSands = initial;
			await this.alertCrypticEvent();
		};

		switch (Math.sign(delta)) {
			case -1: {
				game.settings.set(`ripcrypt`, `currentFate`, nextFate(this._currentFate));
				break;
			}
			case 1: {
				game.settings.set(`ripcrypt`, `currentFate`, previousFate(this._currentFate));
				break;
			}
		};

		this.#animateSandsTo(newSands);
		game.settings.set(`ripcrypt`, `sandsOfFate`, newSands);
	};

	/** @this {DelveDiceHUD} */
	static async #setFate(_event, element) {
		const fate = element.dataset.toFate;
		this.#animateCompassTo(fate);
		game.settings.set(`ripcrypt`, `currentFate`, fate);
	};

	/** @this {DelveDiceHUD} */
	static async #setDifficulty(value) {
		this._difficulty = value;
		game.settings.set(`ripcrypt`, `dc`, value);
	};
	// #endregion

	// #region Public API
	async alertCrypticEvent() {
		const alertType = game.settings.get(`ripcrypt`, `onCrypticEvent`);
		if (alertType === `nothing`) { return };

		if ([`both`, `notif`].includes(alertType)) {
			ui.notifications.info(
				localizer(`RipCrypt.notifs.info.cryptic-event-alert`),
				{ console: false },
			);
		};

		if ([`both`, `pause`].includes(alertType) && game.user.isGM) {
			game.togglePause(true, { broadcast: true });
		};
	};
	// #endregion
};

import { filePath } from "../consts.mjs";
import { GenericAppMixin } from "./GenericApp.mjs";
import { localizer } from "../utils/Localizer.mjs";
import { Logger } from "../utils/Logger.mjs";

const { Roll } = foundry.dice;
const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class DicePool extends GenericAppMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--DicePool`,
		],
		window: {
			title: `Dice Pool`,
			frame: true,
			positioned: true,
			resizable: false,
			minimizable: true,
		},
		position: {
			width: `auto`,
			height: `auto`,
		},
		actions: {
			diceCountDelta: this.#diceCountDelta,
			targetDelta: this.#targetDelta,
			edgeDelta: this.#edgeDelta,
			dragDelta: this.#dragDelta,
			roll: this.#roll,
		},
	};

	static PARTS = {
		numberOfDice: {
			template: filePath(`templates/Apps/DicePool/numberOfDice.hbs`),
		},
		target: {
			template: filePath(`templates/Apps/DicePool/target.hbs`),
		},
		drag: {
			template: filePath(`templates/Apps/DicePool/drag.hbs`),
		},
		edge: {
			template: filePath(`templates/Apps/DicePool/edge.hbs`),
		},
		buttons: {
			template: filePath(`templates/Apps/DicePool/buttons.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	_diceCount;
	_target;
	_drag;
	_edge;

	constructor({
		diceCount = 1,
		target,
		drag = 0, edge = 0,
		flavor = ``,
		...opts
	} = {}) {
		super(opts);

		this._drag = drag;
		this._edge = edge;
		this._flavor = flavor;
		this._diceCount = diceCount;
		this._target = target ?? game.settings.get(`ripcrypt`, `dc`) ?? 1;
	};

	get title() {
		if (!this._flavor) {
			return super.title;
		}
		return `${super.title}: ${this._flavor}`;
	};
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, ctx, _opts) {
		ctx = {};

		switch (partId) {
			case `numberOfDice`: {
				await this._prepareNumberOfDice(ctx);
				break;
			};
			case `target`: {
				await this._prepareTarget(ctx);
				break;
			};
			case `edge`: {
				await this._prepareEdge(ctx);
				break;
			};
			case `drag`: {
				await this._prepareDrag(ctx);
				break;
			};
			case `buttons`: {
				break;
			};
		}

		Logger.debug(`${partId} Context:`, ctx);
		return ctx;
	};

	async _prepareNumberOfDice(ctx) {
		ctx.numberOfDice = this._diceCount;
		ctx.decrementDisabled = this._diceCount <= 1;
	};

	async _prepareTarget(ctx) {
		ctx.target = this._target;
		ctx.incrementDisabled = this._target >= 8;
		ctx.decrementDisabled = this._target <= 1;
	};

	async _prepareEdge(ctx) {
		ctx.edge = this._edge;
		ctx.incrementDisabled = false;
		ctx.decrementDisabled = this._edge <= 0;
	};

	async _prepareDrag(ctx) {
		ctx.drag = this._drag;
		ctx.incrementDisabled = false;
		ctx.decrementDisabled = this._drag <= 0;
	};
	// #endregion

	// #region Actions
	static async #diceCountDelta(_event, element) {
		const delta = parseInt(element.dataset.delta);
		if (Number.isNaN(delta)) {
			ui.notifications.error(
				localizer(`RipCrypt.notifs.error.invalid-delta`, { name: `@RipCrypt.Apps.numberOfDice` }),
			);
			return;
		};

		let newCount = this._diceCount + delta;

		if (newCount < 0) {
			ui.notifications.warn(
				localizer(`RipCrypt.notifs.warn.cannot-go-negative`, { name: `@RipCrypt.Apps.numberOfDice` }),
			);
		};

		this._diceCount = Math.max(newCount, 0);
		this.render({ parts: [`numberOfDice`] });
	};

	static async #targetDelta(_event, element) {
		const delta = parseInt(element.dataset.delta);
		if (Number.isNaN(delta)) {
			ui.notifications.error(
				localizer(`RipCrypt.notifs.error.invalid-delta`, { name: `@RipCrypt.Apps.rollTarget` }),
			);
			return;
		};

		this._target += delta;
		this.render({ parts: [`target`] });
	};

	static async #edgeDelta(_event, element) {
		const delta = parseInt(element.dataset.delta);
		if (Number.isNaN(delta)) {
			ui.notifications.error(
				localizer(`RipCrypt.notifs.error.invalid-delta`, { name: `@RipCrypt.common.edge` }),
			);
			return;
		};

		this._edge += delta;
		this.render({ parts: [`edge`] });
	};

	static async #dragDelta(_event, element) {
		const delta = parseInt(element.dataset.delta);
		if (Number.isNaN(delta)) {
			ui.notifications.error(
				localizer(`RipCrypt.notifs.error.invalid-delta`, { name: `@RipCrypt.common.drag` }),
			);
			return;
		};

		this._drag += delta;
		this.render({ parts: [`drag`] });
	};

	static async #roll() {
		let target = this._target;
		target -= this._edge;
		target += this._drag;
		target = Math.max(target, 1);

		const formula = `${this._diceCount}d8rc${target}`;
		Logger.debug(`Attempting to roll formula: ${formula}`);

		let flavor = this._flavor;
		if (this._flavor) {
			flavor += ` ` + localizer(`RipCrypt.Apps.difficulty`, { dc: this._target });
		}

		const roll = new Roll(formula);
		await roll.evaluate();
		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor,
		});
		this.close();
	};
	// #endregion
};

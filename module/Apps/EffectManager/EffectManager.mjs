import { filePath } from "../../consts.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class EffectManager extends GenericAppMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--EffectManager`,
		],
		window: {
			title: `Effect Manager`,
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
		},
	};

	static PARTS = {
		numberOfDice: {
			template: filePath(`templates/Apps/DicePool/numberOfDice.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	_effects = new Map();
	_showSource;

	constructor({ document, showSource = true, ...opts } = {}) {
		super(opts);

		this._showSource = showSource;

		for (const effect of document.allApplicableEffects()) {
			this._effects.add(effect._id, effect);
		};
	};
	// #endregion

	// #region Lifecycle
	// #endregion

	// #region Actions
	// #endregion
};

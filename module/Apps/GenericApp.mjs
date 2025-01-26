import { deleteItemFromElement, editItemFromElement } from "./utils.mjs";
import { DicePool } from "./DicePool.mjs";

/**
 * A mixin that takes the class from HandlebarsApplicationMixin and
 */
export function GenericAppMixin(HandlebarsApp) {
	class GenericRipCryptApp extends HandlebarsApp {

		// #region Options
		static DEFAULT_OPTIONS = {
			classes: [
				`ripcrypt`,
			],
			actions: {
				roll: this._rollDice,
				editItem: (_event, target) => editItemFromElement(target),
				deleteItem: (_event, target) => deleteItemFromElement(target),
			},
		};

		static themes = {
			dark: `SETTINGS.UI.FIELDS.colorScheme.dark`,
		};
		// #endregion

		// #region Lifecycle
		/**
		 * @override
		 * Making it so that if the app is already open, it's brought to
		 * top after being re-rendered as normal
		 */
		async render(options = {}, _options = {}) {
			super.render(options, _options);
			const instance = foundry.applications.instances.get(this.id);
			if (instance !== undefined && !options.noBringToFront) {
				instance.bringToFront();
			};
		};

		async _preparePartContext(partId, ctx, opts) {
			ctx = await super._preparePartContext(partId, ctx, opts);
			delete ctx.document;
			delete ctx.fields;

			ctx.meta ??= {};
			ctx.meta.idp = this.document?.uuid ?? this.id;
			if (this.document) {
				ctx.meta.limited = this.document.limited;
				ctx.meta.editable = ctx.editable;
			}
			delete ctx.editable;

			return ctx;
		};
		// #endregion

		// #region Actions
		/** @this {GenericRipCryptApp} */
		static async _rollDice(_$e, el) {
			const data = el.dataset;
			const diceCount = parseInt(data.diceCount);
			const flavor = data.flavor;

			const dp = new DicePool({ diceCount, flavor });
			dp.render({ force: true });
		};
		// #endregion
	};
	return GenericRipCryptApp;
};

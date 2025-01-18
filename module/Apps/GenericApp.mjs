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
				roll: this.rollDice,
			},
		};

		static themes = {
			dark: `SETTINGS.UI.FIELDS.colorScheme.dark`,
		};
		// #endregion

		// #region Lifecycle
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
		static async rollDice(_$e, el) {
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

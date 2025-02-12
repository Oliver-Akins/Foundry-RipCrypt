import { deleteItemFromElement, editItemFromElement } from "./utils.mjs";
import { DicePool } from "./DicePool.mjs";
import { RichEditor } from "./RichEditor.mjs";
import { toBoolean } from "../consts.mjs";

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
				roll: this.#rollDice,
				editItem: (_event, target) => editItemFromElement(target),
				deleteItem: (_event, target) => deleteItemFromElement(target),
				openRichEditor: this.#openRichEditor,
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
			if (instance !== undefined && options.orBringToFront) {
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
		static async #rollDice(_event, target) {
			const data = target.dataset;
			const diceCount = parseInt(data.diceCount);
			const flavor = data.flavor;

			const dp = new DicePool({ diceCount, flavor });
			dp.render({ force: true });
		};

		/** @this {GenericRipCryptApp} */
		static async #openRichEditor(_event, target) {
			const data = target.dataset;
			const {
				uuid,
				path,
				collaborative,
				compact,
			} = data;

			if (!uuid || !path) {
				console.error(`Rich Editor requires a document uuid and path to edit`);
				return;
			};

			const document = await fromUuid(uuid);
			const app = new RichEditor({
				document,
				path,
				collaborative: toBoolean(collaborative),
				compact: toBoolean(compact ),
			});
			app.render({ force: true });
		};
		// #endregion
	};
	return GenericRipCryptApp;
};

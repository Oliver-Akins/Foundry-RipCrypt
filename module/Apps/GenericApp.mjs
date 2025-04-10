import { createItemFromElement, deleteItemFromElement, editItemFromElement } from "./utils.mjs";
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
				createItem(_event, target) { // uses arrow-less function for "this"
					const parent = this.document;
					createItemFromElement(target, { parent });
				},
				editItem: (_event, target) => editItemFromElement(target),
				deleteItem: (_event, target) => deleteItemFromElement(target),
				openRichEditor: this.#openRichEditor,
			},
		};

		static themes = {
			dark: `SETTINGS.UI.FIELDS.colorScheme.dark`,
		};
		// #endregion

		// #region Instance Data
		/** @type {Map<string, PopoverEventManager>} */
		_popoverManagers = new Map();
		/** @type {Map<number, string>} */
		_hookIDs = new Map();
		// #endregion

		// #region Lifecycle
		/**
		 * @override
		 * Making it so that if the app is already open, it's brought to
		 * top after being re-rendered as normal
		 */
		async render(options = {}, _options = {}) {
			await super.render(options, _options);
			const instance = foundry.applications.instances.get(this.id);
			if (instance !== undefined && options.orBringToFront) {
				instance.bringToFront();
			};
		};

		/** @override */
		async _onRender(...args) {
			await super._onRender(...args);

			/*
			Rendering each of the popover managers associated with this app allows us
			to have them be dynamic and update when their parent application is rerendered,
			this could eventually be something we can move into the Document's apps
			collection so Foundry auto-rerenders it, but because it isn't actually
			associated with the Document (as it's dependendant on the Application), I
			decided that it would be best to do my own handling for it.
			*/
			for (const manager of this._popoverManagers.values()) {
				manager.render();
			};

			/*
			Foreign update listeners so that we can easily update items that may not
			be this document itself, but are useful to be able to be edited from this
			sheet. Primarily useful for editing the Actors' Item collection, or an Items'
			ActiveEffect collection.
			*/
			this.element.querySelectorAll(`input[data-foreign-update-on]`).forEach(el => {
				const events = el.dataset.foreignUpdateOn.split(`,`);
				for (const event of events) {
					el.addEventListener(event, this.updateEmbedded);
				};
			});
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

		_tearDown(options) {
			// Clear all popovers associated with the app
			for (const manager of this._popoverManagers.values()) {
				manager.destroy();
			};
			this._popoverManagers.clear();

			// Remove any hooks added for this app
			for (const [id, hook] of this._hookIDs.entries()) {
				Hooks.off(hook, id);
			};
			this._hookIDs.clear();

			super._tearDown(options);
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

		/**
		 * @param {Event} event
		 */
		async updateForeign(event) {
			const target = event.currentTarget;
			const data = target.dataset;
			const document = await fromUuid(data.foreignUuid);

			let value = target.value;
			switch (target.type) {
				case `checkbox`: value = target.checked; break;
			};

			await document?.update({ [data.foreignName]: value });
		};
		// #endregion
	};
	return GenericRipCryptApp;
};

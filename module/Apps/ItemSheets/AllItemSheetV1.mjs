import { filePath } from "../../consts.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { Logger } from "../../utils/Logger.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class AllItemSheetV1 extends GenericAppMixin(HandlebarsApplicationMixin(ItemSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--item`,
			`ripcrypt--AllItemSheetV1`,
		],
		position: {
			width: `auto`,
			height: `auto`,
		},
		window: {
			resizable: false,
		},
		actions: {
		},
		form: {
			submitOnChange: true,
			closeOnSubmit: false,
		},
	};

	static PARTS = {
		content: {
			template: filePath(`templates/Apps/AllItemSheetV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.item = this.document;

		ctx.formFields = this.document.system.getFormFields(ctx);

		Logger.debug(`Context:`, ctx);
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

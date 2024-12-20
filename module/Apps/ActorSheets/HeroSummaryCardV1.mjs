import { filePath } from "../../consts.mjs";

const { DocumentSheetV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HeroSummaryCardV1 extends HandlebarsApplicationMixin(DocumentSheetV2) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt`,
			`ripcrypt--actor`,
			`ripcrypt--HeroSummaryCardV1`,
			`ripcrypt-theme--dark`,
		],
		position: {
			width: `auto`,
			height: `auto`,
		},
		window: {
			resizable: false,
		},
		actions: {},
		form: {
			submitOnChange: true,
			closeOnSubmit: false,
		},
	};

	static PARTS = {
		content: {
			template: filePath(`Apps/HeroSummaryCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);

		ctx.meta ??= {};
		ctx.meta.idp = this.document.uuid;

		partId = partId.slice(0,1).toUpperCase() + partId.slice(1);
		if (this[`_prepare${partId}Context`] != null) {
			ctx = await this[`_prepare${partId}Context`](ctx, opts);
		};
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

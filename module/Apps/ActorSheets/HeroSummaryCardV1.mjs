import { filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { Logger } from "../../utils/Logger.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class HeroSummaryCardV1 extends HandlebarsApplicationMixin(ActorSheetV2) {

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

		ctx.actor = this.document;

		ctx = await this._prepareFatePath(ctx);

		partId = partId.slice(0,1).toUpperCase() + partId.slice(1);
		if (this[`_prepare${partId}Context`] != null) {
			ctx = await this[`_prepare${partId}Context`](ctx, opts);
		};

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	async _prepareFatePath(ctx) {
		ctx.fate = {};
		ctx.fate.selected = ctx.actor.system.fate;
		ctx.fate.options = [
			{ label: `RipCrypt.common.empty`, v: `` },
			...gameTerms.FatePath
				.map(v => ({ label: `RipCrypt.common.fate.${v}`, value: v })),
		];
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

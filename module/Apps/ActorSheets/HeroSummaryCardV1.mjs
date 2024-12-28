import { filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { localizer } from "../../utils/Localizer.mjs";
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

		ctx = await this.prepareFatePath(ctx);
		ctx = await this.prepareAbilityRow(ctx);
		ctx = await this.prepareSpeed(ctx);

		partId = partId.slice(0,1).toUpperCase() + partId.slice(1);
		if (this[`_prepare${partId}Context`] != null) {
			ctx = await this[`_prepare${partId}Context`](ctx, opts);
		};

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	async prepareFatePath(ctx) {
		ctx.fate = {};
		ctx.fate.selected = ctx.actor.system.fate;
		ctx.fate.options = [
			{ label: `RipCrypt.common.empty`, v: `` },
			...gameTerms.FatePath
				.map(v => ({ label: `RipCrypt.common.fate.${v}`, value: v })),
		];
		return ctx;
	};

	async prepareAbilityRow(ctx) {
		ctx.abilities = [];
		for (const key in ctx.actor.system.ability) {
			ctx.abilities.push({
				id: key,
				name: localizer(
					`RipCrypt.common.ability.${key}`,
					{ value: ctx.actor.system.ability[key] },
				),
				value: ctx.actor.system.ability[key],
				readonly: !this.isEditable,
			});
		};
		return ctx;
	};

	async prepareSpeed(ctx) {
		ctx.speed = ctx.actor.system.speed;
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

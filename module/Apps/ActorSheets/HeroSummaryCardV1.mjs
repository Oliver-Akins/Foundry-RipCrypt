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
		delete ctx.document;
		delete ctx.fields;

		ctx.meta ??= {};
		ctx.meta.idp = this.document.uuid;
		ctx.meta.limited = this.actor.limited;
		ctx.meta.editable = ctx.editable;
		delete ctx.editable;

		ctx.actor = this.document;

		ctx = await HeroSummaryCardV1.prepareGuts(ctx);
		ctx = await HeroSummaryCardV1.prepareWeapons(ctx);
		ctx = await HeroSummaryCardV1.prepareFatePath(ctx);
		ctx = await HeroSummaryCardV1.prepareAbilityRow(ctx);
		ctx = await HeroSummaryCardV1.prepareSpeed(ctx);

		partId = partId.slice(0,1).toUpperCase() + partId.slice(1);
		if (this[`_prepare${partId}Context`] != null) {
			ctx = await this[`_prepare${partId}Context`](ctx, opts);
		};

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	static async prepareFatePath(ctx) {
		ctx.fate = {};
		ctx.fate.selected = ctx.actor.system.fate;
		ctx.fate.options = [
			{ label: `RipCrypt.common.empty`, v: `` },
			...gameTerms.FatePath
				.map(v => ({ label: `RipCrypt.common.fate.${v}`, value: v })),
		];
		return ctx;
	};

	static async prepareAbilityRow(ctx) {
		ctx.abilities = [];
		for (const key in ctx.actor.system.ability) {
			ctx.abilities.push({
				id: key,
				name: localizer(
					`RipCrypt.common.ability.${key}`,
					{ value: ctx.actor.system.ability[key] },
				),
				value: ctx.meta.limited ? `?` : ctx.actor.system.ability[key],
				readonly: !ctx.meta.editable,
			});
		};
		return ctx;
	};

	static async prepareSpeed(ctx) {
		ctx.speed = foundry.utils.deepClone(ctx.actor.system.speed);
		if (ctx.meta.limited) {
			ctx.speed = {
				move: `?`,
				run: `?`,
			};
		};
		return ctx;
	};

	static async prepareWeapons(ctx) {
		const limit = ctx.actor.system.limit.weapons;
		ctx.weapons = [];
		for (let i = 0; i < limit; i++) {
			ctx.weapons.push({
				data: null,
				empty: true,
				index: i + 1,
				class: i % 2 === 1 ? `row-alt` : ``,
			});
		};
		return ctx;
	};

	static async prepareGuts(ctx) {
		ctx.guts = foundry.utils.deepClone(ctx.actor.system.guts);
		if (ctx.meta.limited) {
			ctx.guts = {
				value: `?`,
				max: `?`,
			};
		};
		return ctx;
	}
	// #endregion

	// #region Actions
	// #endregion
};

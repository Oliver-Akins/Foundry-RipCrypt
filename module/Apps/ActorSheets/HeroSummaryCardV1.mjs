import { filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";


const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
// const { Roll } = foundry.dice;

export class HeroSummaryCardV1 extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			// `ripcrypt`,
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
		actions: {
			// roll: this.rollDice,
		},
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
		ctx.actor = this.document;

		ctx = await HeroSummaryCardV1.prepareGuts(ctx);
		ctx = await HeroSummaryCardV1.prepareWeapons(ctx);
		ctx = await HeroSummaryCardV1.prepareFatePath(ctx);
		ctx = await HeroSummaryCardV1.prepareAbilityRow(ctx);
		ctx = await HeroSummaryCardV1.prepareSpeed(ctx);
		ctx = await HeroSummaryCardV1.prepareLevelData(ctx);

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	static async prepareLevelData(ctx) {
		ctx.level = {
			glory: ctx.actor.system.level.glory,
			step: ctx.actor.system.level.step,
			rank: {
				selected: ctx.actor.system.level.rank,
				options: Object.values(gameTerms.Rank),
			},
		};
		if (ctx.meta.limited) {
			ctx.level.glory = `?`;
			ctx.level.step = `?`;
			ctx.level.rank.selected = `?`;
		};
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
		const embedded = ctx.actor.itemTypes.weapon;
		ctx.weapons = [];
		for (let i = 0; i < limit; i++) {
			ctx.weapons.push({
				data: embedded[i],
				empty: embedded.at(i) === undefined,
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
	// static async rollDice(_$e, el) {
	// 	const data = el.dataset;
	// 	const formula = data.formula;
	// 	Logger.debug(`Attempting to roll formula: ${formula}`);

	// 	let flavor;
	// 	if (data.flavor) {
	// 		flavor = localizer(
	// 			data.flavor,
	// 		);
	// 	}

	// 	const roll = new Roll(formula);
	// 	await roll.evaluate();
	// 	await roll.toMessage({
	// 		speaker: ChatMessage.getSpeaker({ actor: this.actor }),
	// 		flavor,
	// 	});
	// };
	// #endregion
};

import { deleteItemFromElement, editItemFromElement } from "../utils.mjs";
import { filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ContextMenu } = foundry.applications.ui;

export class HeroSummaryCardV1 extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--actor`,
			`ripcrypt--HeroSummaryCardV1`,
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
			template: filePath(`templates/Apps/HeroSummaryCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);
		HeroSummaryCardV1._onRender.bind(this)(context, options);
	};

	static async _onRender(context, options) {
		const {
			element = this.element,
			isEditable = this.isEditable,
		} = options;
		new ContextMenu(
			element,
			`[data-ctx-menu="weapon"],[data-ctx-menu="armour"]`,
			[
				{
					name: localizer(`RipCrypt.common.edit`),
					condition: (el) => {
						const itemId = el.dataset.itemId;
						return isEditable && itemId !== ``;
					},
					callback: editItemFromElement,
				},
				{
					name: localizer(`RipCrypt.common.delete`),
					condition: (el) => {
						const itemId = el.dataset.itemId;
						return isEditable && itemId !== ``;
					},
					callback: deleteItemFromElement,
				},
			],
			{ jQuery: false, fixed: true },
		);
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.actor = this.document;

		ctx = await HeroSummaryCardV1.prepareGuts(ctx);
		ctx = await HeroSummaryCardV1.prepareWeapons(ctx);
		ctx = await HeroSummaryCardV1.prepareArmor(ctx);
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
				options: Object.values(gameTerms.Rank).map(rank => ({
					label: `RipCrypt.common.rankNames.${rank}`,
					value: rank,
				})),
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
				.map(v => ({ label: `RipCrypt.common.path.${v}`, value: v })),
		];
		return ctx;
	};

	static async prepareAbilityRow(ctx) {
		ctx.abilities = [];
		for (const key in ctx.actor.system.ability) {
			ctx.abilities.push({
				id: key,
				name: localizer(
					`RipCrypt.common.abilities.${key}`,
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

	static async prepareArmor(ctx) {
		ctx.armours = {};
		const equipped = ctx.actor.system.equippedArmour;
		const shield = ctx.actor.system.equippedShield;
		const defenses = ctx.actor.system.defense;
		for (const slot of Object.values(gameTerms.Anatomy)) {
			const item = equipped[slot];
			ctx.armours[slot] = {
				name: item?.name ?? ``,
				uuid: item?.uuid ?? ``,
				defense: defenses[slot],
				shielded: shield?.system.location.has(slot) ?? false,
			};
		};

		ctx.shield = {
			name: shield?.name ?? ``,
			uuid: shield?.uuid ?? ``,
			bonus: shield?.system.protection ?? 0,
		};

		return ctx;
	};

	static async prepareWeapons(ctx) {
		const limit = ctx.actor.system.limit.weapons;
		const embedded = ctx.actor.itemTypes.weapon;
		ctx.weapons = [];
		for (const item of embedded) {
			if (!item.system.equipped) { continue };

			const index = ctx.weapons.length;
			ctx.weapons.push({
				data: item,
				empty: false,
				index,
				class: index % 2 === 1 ? `row-alt` : ``,
			});

			if (ctx.weapons.length >= limit) { break };
		};

		if (ctx.weapons.length < limit) {
			for (let i = ctx.weapons.length; i < limit; i++) {
				const itemIndex = ctx.weapons.length;
				ctx.weapons.push({
					data: null,
					empty: true,
					index: itemIndex,
					class: itemIndex % 2 === 1 ? `row-alt` : ``,
				});
			};
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
	};
	// #endregion

	// #region Actions
	// #endregion
};

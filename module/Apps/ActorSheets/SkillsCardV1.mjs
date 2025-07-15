import { deleteItemFromElement, editItemFromElement } from "../utils.mjs";
import { documentSorter, filePath } from "../../consts.mjs";
import { AmmoTracker } from "../popovers/AmmoTracker.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { ItemFlags } from "../../flags/item.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";
import { PopoverEventManager } from "../../utils/PopoverEventManager.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ContextMenu } = foundry.applications.ux;
const { deepClone } = foundry.utils;

export class SkillsCardV1 extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--actor`,
			`ripcrypt--SkillsCardV1`,
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
			template: filePath(`templates/Apps/SkillsCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);
		SkillsCardV1._onRender.bind(this)(context, options);
		SkillsCardV1._createPopoverListeners.bind(this)();
	};

	static async _onRender(_context, options) {
		const {
			element = this.element,
			isEditable = this.isEditable,
		} = options;
		new ContextMenu(
			element,
			`[data-ctx-menu="gear"],[data-ctx-menu="skill"]`,
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

	/** @this {SkillsCardV1} */
	static async _createPopoverListeners() {
		const ammoInfoIcon = this.element.querySelector(`.ammo-info-icon`);
		const idPrefix = this.actor.uuid;

		const manager = new PopoverEventManager(`${idPrefix}.ammo-info-icon`, ammoInfoIcon, AmmoTracker);
		this._popoverManagers.set(`.ammo-info-icon`, manager);
		this._hookIDs.set(Hooks.on(`prepare${manager.id}Context`, (ctx) => {
			ctx.ammos = this.actor.itemTypes.ammo;
		}), `prepare${manager.id}Context`);
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.actor = this.document;

		ctx = await SkillsCardV1.prepareGear(ctx);
		ctx = await SkillsCardV1.prepareAmmo(ctx);
		ctx = await SkillsCardV1.prepareSkills(ctx);

		ctx.aura = deepClone(ctx.actor.system.aura);

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	static async prepareGear(ctx) {
		const limit = ctx.actor.system.limit.equipment;
		ctx.gear = [];
		const items = [...ctx.actor.items];
		for (const item of items) {
			if (!gameTerms.gearItemTypes.has(item.type)) { continue };

			if (`equipped` in item.system && item.system.equipped) { continue };
			ctx.gear.push({
				index: ctx.gear.length,
				uuid: item.uuid,
				name: item.quantifiedName,
				empty: false,
			});

			if (ctx.gear.length >= limit) { break };
		};

		if (ctx.gear.length < limit) {
			for (let i = ctx.gear.length; i < limit; i++) {
				ctx.gear.push({
					index: ctx.gear.length,
					uuid: ``,
					name: ``,
					empty: true,
				});
			};
		};

		return ctx;
	};

	static async prepareAmmo(ctx) {
		let total = 0;
		let favouriteCount = 0;
		ctx.favouriteAmmo = new Array(3).fill(null);

		for (const ammo of ctx.actor.itemTypes.ammo) {
			total += ammo.system.quantity;

			if (favouriteCount < 3 && ammo.getFlag(game.system.id, ItemFlags.FAVOURITE)) {
				ctx.favouriteAmmo[favouriteCount] = {
					uuid: ammo.uuid,
					name: ammo.name,
					quantity: ammo.system.quantity,
				};
				favouriteCount++;
			};
		};

		ctx.ammo = total;
		return ctx;
	};

	static async prepareSkills(ctx) {
		ctx.skills = {};
		const abilities = Object.values(gameTerms.Abilities);
		const heroRank = ctx.actor.system.level.rank;
		const embeddedSkills = ctx.actor.itemTypes.skill;

		for (let ability of abilities) {
			const skills = [];
			for (const skill of embeddedSkills) {
				if (skill.system.ability !== ability) { continue };
				skills.push({
					uuid: skill.uuid,
					name: skill.name,
					sort: skill.sort,
					use: skill.system.advances[heroRank],
				});
			};

			// Thin Glim is grouped with full glim.
			if (ability === gameTerms.Abilities.THINGLIM) {
				ability = gameTerms.Abilities.GLIM;
			};

			ctx.skills[ability] ??= [];
			ctx.skills[ability].push(...skills);
		};

		const limit = ctx.actor.system.limit.skills;
		for (const ability of abilities) {
			if (ctx.skills[ability] == null) { continue };

			const length = ctx.skills[ability].length;
			if (length >= limit) {
				ctx.skills[ability] = ctx.skills[ability].slice(0, limit);
			} else {
				ctx.skills[ability] = ctx.skills[ability]
					.concat(Array(limit - length).fill(null))
					.slice(0, limit);
			};

			// Sort the skills
			ctx.skills[ability] = ctx.skills[ability].sort(documentSorter);
		}
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

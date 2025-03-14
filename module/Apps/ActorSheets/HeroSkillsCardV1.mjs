import { deleteItemFromElement, editItemFromElement } from "../utils.mjs";
import { documentSorter, filePath, getTooltipDelay } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";
import { AmmoTracker } from "../popovers/AmmoTracker.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ContextMenu } = foundry.applications.ui;

export class HeroSkillsCardV1 extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--actor`,
			`ripcrypt--HeroSkillsCardV1`,
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
			template: filePath(`templates/Apps/HeroSkillsCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	/** @type {number | undefined} */
	#ammoTrackerHoverTimeout = null;

	/** @type {AmmoTracker | null} */
	#ammoTracker = null;
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);
		HeroSkillsCardV1._onRender.bind(this)(context, options);
		await this.#createAmmoTrackerEvents();
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

	async #createAmmoTrackerEvents() {
		const ammoInfoIcon = this.element.querySelector(`.ammo-info-icon`);
		ammoInfoIcon.addEventListener(`pointerenter`, this.#ammoInfoPointerEnter.bind(this));
		ammoInfoIcon.addEventListener(`pointerout`, this.#ammoInfoPointerOut.bind(this));
		ammoInfoIcon.addEventListener(`click`, this.#ammoInfoClick.bind(this));
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.actor = this.document;

		ctx = await HeroSkillsCardV1.prepareGear(ctx);
		ctx = await HeroSkillsCardV1.prepareAmmo(ctx);
		ctx = await HeroSkillsCardV1.prepareSkills(ctx);

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
			for (let i = ctx.gear.length - 1; i <= limit; i++) {
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
		ctx.ammo = 0;
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

	// #region Event Listeners
	/**
	 * @param {PointerEvent} event
	 */
	async #ammoInfoPointerEnter(event) {
		const pos = event.target.getBoundingClientRect();
		const x = pos.x + Math.floor(pos.width / 2);
		const y = pos.y;

		this.#ammoTrackerHoverTimeout = setTimeout(
			() => {
				this.#ammoTrackerHoverTimeout = null;
				const tracker = new AmmoTracker({
					popover: {
						framed: false,
						x, y,
					},
				});
				tracker.render({ force: true });
				this.#ammoTracker = tracker;
			},
			getTooltipDelay(),
		);
	};

	async #ammoInfoPointerOut() {
		if (this.#ammoTracker) {
			this.#ammoTracker.close();
		};

		if (this.#ammoTrackerHoverTimeout !== null) {
			clearTimeout(this.#ammoTrackerHoverTimeout);
			this.#ammoTrackerHoverTimeout = null;
		};
	};

	async #ammoInfoClick() {};
	// #endregion

	// #region Actions
	// #endregion
};

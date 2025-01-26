import { deleteItemFromElement, editItemFromElement } from "../utils.mjs";
import { filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";

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

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);
		HeroSkillsCardV1._onRender.bind(this)(context, options);
	};

	static async _onRender(_context, options) {
		const {
			element = this.element,
			isEditable = this.isEditable,
		} = options;
		new ContextMenu(
			element,
			`[data-ctx-menu="gear"]`,
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

		ctx = await HeroSkillsCardV1.prepareGear(ctx);

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
				name: item.name,
				empty: false,
			});

			if (ctx.gear.length >= limit) { break };
		};

		if (ctx.gear.length < limit) {
			for (let i = ctx.gear.length - 1; i <= limit; i++) {
				ctx.gear.push({
					index: ctx.gear.length,
					uuid: ``, name: ``, empty: true });
			};
		};

		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

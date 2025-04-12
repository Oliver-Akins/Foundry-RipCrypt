import { deleteItemFromElement, editItemFromElement } from "../utils.mjs";
import { documentSorter, filePath } from "../../consts.mjs";
import { gameTerms } from "../../gameTerms.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { localizer } from "../../utils/Localizer.mjs";
import { Logger } from "../../utils/Logger.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ContextMenu } = foundry.applications.ui;
const { deepClone } = foundry.utils;

export class CraftCardV1 extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--actor`,
			`ripcrypt--CraftCardV1`,
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
			template: filePath(`templates/Apps/CraftCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);
		CraftCardV1._onRender.bind(this)(context, options);
	};

	static async _onRender(_context, options) {
		const {
			element = this.element,
			isEditable = this.isEditable,
		} = options;
		new ContextMenu(
			element,
			`[data-ctx-menu="craft"]`,
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

		ctx = await CraftCardV1.prepareAura(ctx);
		ctx = await CraftCardV1.prepareCraft(ctx);

		Logger.debug(`Context:`, ctx);
		return ctx;
	};

	static async prepareAura(ctx) {
		ctx.aura = deepClone(ctx.actor.system.aura);
		return ctx;
	};

	static async prepareCraft(ctx) {
		ctx.craft = {};
		const aspects = Object.values(gameTerms.Aspects);
		const heroRank = ctx.actor.system.level.rank;
		const embeddedCrafts = ctx.actor.itemTypes.craft;
		const limit = 4;

		for (const aspect of aspects) {
			let crafts = [];
			for (const craft of embeddedCrafts) {
				if (craft.system.aspect !== aspect) { continue };
				crafts.push({
					uuid: craft.uuid,
					name: craft.name,
					sort: craft.sort,
					use: craft.system.advances[heroRank],
				});
			};

			// Ensure limit isn't surpassed
			const length = crafts.length;
			if (length >= limit) {
				crafts = crafts.slice(0, limit);
			} else {
				crafts = crafts
					.concat(Array(limit - length).fill(null))
					.slice(0, limit);
			};

			ctx.craft[aspect] = crafts.sort(documentSorter);
		}
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

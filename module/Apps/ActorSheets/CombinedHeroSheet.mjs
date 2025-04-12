import { CraftCardV1 } from "./CraftCardV1.mjs";
import { filePath } from "../../consts.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { Logger } from "../../utils/Logger.mjs";
import { SkillsCardV1 } from "./SkillsCardV1.mjs";
import { StatsCardV1 } from "./StatsCardV1.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CombinedHeroSheet extends GenericAppMixin(HandlebarsApplicationMixin(ActorSheetV2)) {

	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--actor`,
			`ripcrypt--CombinedHeroSheet`,
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
		summary: {
			template: filePath(`templates/Apps/StatsCardV1/content.hbs`),
		},
		skills: {
			template: filePath(`templates/Apps/SkillsCardV1/content.hbs`),
		},
		craft: {
			template: filePath(`templates/Apps/CombinedHeroSheet/crafts.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);

		const summaryElement = this.element.querySelector(`.StatsCardV1`);
		StatsCardV1._onRender(
			context,
			{
				...options,
				element: summaryElement,
				isEditable: this.isEditable,
			},
		);

		const skillsElement = this.element.querySelector(`.SkillsCardV1`);
		SkillsCardV1._onRender.bind(this)(
			context,
			{
				...options,
				element: skillsElement,
				isEditable: this.isEditable,
			},
		);

		const craftsElement = this.element.querySelector(`.crafts-summary`);
		CraftCardV1._onRender.bind(this)(
			context,
			{
				...options,
				element: craftsElement,
				isEditable: this.isEditable,
			},
		);
	};

	async _preparePartContext(partId, ctx, opts) {
		ctx = await super._preparePartContext(partId, ctx, opts);
		ctx.actor = this.document;

		switch (partId) {
			case `summary`: {
				ctx = await StatsCardV1.prepareGuts(ctx);
				ctx = await StatsCardV1.prepareWeapons(ctx);
				ctx = await StatsCardV1.prepareArmor(ctx);
				ctx = await StatsCardV1.prepareFatePath(ctx);
				ctx = await StatsCardV1.prepareAbilityRow(ctx);
				ctx = await StatsCardV1.prepareSpeed(ctx);
				ctx = await StatsCardV1.prepareLevelData(ctx);
				break;
			};
			case `skills`: {
				ctx = await SkillsCardV1.prepareGear(ctx);
				ctx = await SkillsCardV1.prepareAmmo(ctx);
				ctx = await SkillsCardV1.prepareSkills(ctx);
				break;
			};
			case `craft`: {
				ctx = await CraftCardV1.prepareCraft(ctx);
				break;
			};
		};

		Logger.debug(`Context keys:`, Object.keys(ctx));
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

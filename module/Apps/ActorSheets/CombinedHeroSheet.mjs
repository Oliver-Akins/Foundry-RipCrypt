import { filePath } from "../../consts.mjs";
import { GenericAppMixin } from "../GenericApp.mjs";
import { HeroSkillsCardV1 } from "./HeroSkillsCardV1.mjs";
import { HeroSummaryCardV1 } from "./HeroSummaryCardV1.mjs";
import { Logger } from "../../utils/Logger.mjs";

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
		actions: {
			editItem: (_event, target) => HeroSummaryCardV1._editItem(target),
		},
		form: {
			submitOnChange: true,
			closeOnSubmit: false,
		},
	};

	static PARTS = {
		summary: {
			template: filePath(`templates/Apps/HeroSummaryCardV1/content.hbs`),
		},
		skills: {
			template: filePath(`templates/Apps/HeroSkillsCardV1/content.hbs`),
		},
	};
	// #endregion

	// #region Lifecycle
	async _onRender(context, options) {
		await super._onRender(context, options);

		const summaryElement = this.element.querySelector(`.HeroSummaryCardV1`);
		HeroSummaryCardV1._onRender(
			context,
			{
				...options,
				element: summaryElement,
				isEditable: this.isEditable,
			},
		);

		const skillsElement = this.element.querySelector(`.HeroSkillsCardV1`);
		HeroSkillsCardV1._onRender.bind(this)(
			context,
			{
				...options,
				element: skillsElement,
				isEditable: this.isEditable,
			},
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

		ctx = await HeroSkillsCardV1.prepareGear(ctx);
		ctx = await HeroSkillsCardV1.prepareAmmo(ctx);

		Logger.debug(`Context:`, ctx);
		return ctx;
	};
	// #endregion

	// #region Actions
	// #endregion
};

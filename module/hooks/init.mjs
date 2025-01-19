// Applications
import { AllItemSheetV1 } from "../Apps/ItemSheets/AllItemSheetV1.mjs";
import { CombinedHeroSheet } from "../Apps/ActorSheets/CombinedHeroSheet.mjs";
import { HeroSkillsCardV1 } from "../Apps/ActorSheets/HeroSkillsCardV1.mjs";
import { HeroSummaryCardV1 } from "../Apps/ActorSheets/HeroSummaryCardV1.mjs";

// Data Models
import { HeroData } from "../data/Actor/Hero.mjs";
import { ProtectorData } from "../data/Item/Protector.mjs";
import { WeaponData } from "../data/Item/Weapon.mjs";

// Class Overrides
import { CryptDie } from "../dice/CryptDie.mjs";

// Misc
import helpers from "../handlebarHelpers/_index.mjs";
import { Logger } from "../utils/Logger.mjs";
import { registerCustomComponents } from "../Apps/elements/_index.mjs";
import { registerDevSettings } from "../settings/devSettings.mjs";
import { registerMetaSettings } from "../settings/metaSettings.mjs";
import { registerUserSettings } from "../settings/userSettings.mjs";

Hooks.once(`init`, () => {
	Logger.log(`Initializing`);

	// #region Settings
	registerMetaSettings();
	registerDevSettings();
	registerUserSettings();
	// #endregion

	// #region Datamodels
	CONFIG.Actor.dataModels.hero = HeroData;
	CONFIG.Item.dataModels.armour = ProtectorData;
	CONFIG.Item.dataModels.weapon = WeaponData;
	// #endregion

	// #region Class Changes
	CONFIG.Dice.terms.d = CryptDie;
	// #endregion

	// #region Sheets
	// Unregister core sheets
	/* eslint-disable no-undef */
	Items.unregisterSheet(`core`, ItemSheet);
	Actors.unregisterSheet(`core`, ActorSheet);
	/* eslint-enabled no-undef */

	// #region Actors
	Actors.registerSheet(game.system.id, CombinedHeroSheet, {
		makeDefault: true,
		types: [`hero`],
		label: `RipCrypt.sheet-names.CombinedHeroSheet`,
		themes: CombinedHeroSheet.themes,
	});
	Actors.registerSheet(game.system.id, HeroSummaryCardV1, {
		types: [`hero`],
		label: `RipCrypt.sheet-names.HeroSummaryCardV1`,
		themes: HeroSummaryCardV1.themes,
	});
	Actors.registerSheet(game.system.id, HeroSkillsCardV1, {
		types: [`hero`],
		label: `RipCrypt.sheet-names.HeroSkillsCardV1`,
		themes: HeroSkillsCardV1.themes,
	});
	// #endregion

	// #region Items
	Items.registerSheet(game.system.id, AllItemSheetV1, {
		makeDefault: true,
		label: `RipCrypt.sheet-names.AllItemsSheetV1`,
		themes: AllItemSheetV1.themes,
	});
	// #endregion
	// #endregion

	// #region Token Attrs
	CONFIG.Actor.trackableAttributes.hero = HeroData.trackableAttributes;

	registerCustomComponents();
	Handlebars.registerHelper(helpers);
});

// Applications
import { HeroSummaryCardV1 } from "../Apps/ActorSheets/HeroSummaryCardV1.mjs";

// Data Models
import { HeroData } from "../data/Actor/Hero.mjs";
import { WeaponData } from "../data/Item/Weapon.mjs";

// Class Overrides
import { CryptDie } from "../dice/CryptDie.mjs";

// Misc
import helpers from "../handlebarHelpers/_index.mjs";
import { Logger } from "../utils/Logger.mjs";
import { registerDevSettings } from "../settings/devSettings.mjs";
import { registerUserSettings } from "../settings/userSettings.mjs";

Hooks.once(`init`, () => {
	Logger.log(`Initializing`);

	// #region Settings
	registerDevSettings();
	registerUserSettings();
	// #endregion

	// #region Datamodels
	CONFIG.Actor.dataModels.hero = HeroData;
	CONFIG.Item.dataModels.weapon = WeaponData;
	// #endregion

	// #region Class Changes
	CONFIG.Dice.terms.d = CryptDie;
	// #endregion

	// #region Sheets
	// #region Actors
	Actors.registerSheet(game.system.id, HeroSummaryCardV1, {
		makeDefault: true,
		types: [`hero`],
		label: `RipCrypt.sheet-names.HeroSummaryCardV1`,
	});
	// #endregion
	// #endregion

	Handlebars.registerHelper(helpers);
});

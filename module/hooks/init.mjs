// Applications
import { HeroSummaryCardV1 } from "../Apps/ActorSheets/HeroSummaryCardV1.mjs";

// Data Models
import { HeroData } from "../data/Actor/Hero.mjs";
import { registerDevSettings } from "../settings/devSettings.mjs";

// Misc
import { Logger } from "../utils/Logger.mjs";

Hooks.once(`init`, () => {
	Logger.log(`Initializing`);

	// #region Settings
	registerDevSettings();
	// #endregion

	// #region Datamodels
	CONFIG.Actor.dataModels.hero = HeroData;
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
});

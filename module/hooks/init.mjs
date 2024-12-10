import { HeroData } from "../data/Actor/Hero.mjs";
import { Logger } from "../utils/Logger.mjs";

Hooks.once(`init`, () => {
	Logger.log(`Initializing`);

	// Datamodel registrations
	CONFIG.Actor.dataModels.hero = HeroData;
});

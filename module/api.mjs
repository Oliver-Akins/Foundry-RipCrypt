// App imports
import { CombinedHeroSheet } from "./Apps/ActorSheets/CombinedHeroSheet.mjs";
import { DicePool } from "./Apps/DicePool.mjs";
import { HeroSkillsCardV1 } from "./Apps/ActorSheets/HeroSkillsCardV1.mjs";
import { HeroSummaryCardV1 } from "./Apps/ActorSheets/HeroSummaryCardV1.mjs";

// Util imports
import { documentSorter } from "./consts.mjs";

const { deepFreeze } = foundry.utils;

Object.defineProperty(
	globalThis,
	`ripcrypt`,
	{
		value: deepFreeze({
			Apps: {
				DicePool,
				CombinedHeroSheet,
				HeroSummaryCardV1,
				HeroSkillsCardV1,
			},
			utils: {
				documentSorter,
			},
		}),
		writable: false,
	},
);

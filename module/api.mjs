// App imports
import { CombinedHeroSheet } from "./Apps/ActorSheets/CombinedHeroSheet.mjs";
import { DicePool } from "./Apps/DicePool.mjs";
import { HeroSkillsCardV1 } from "./Apps/ActorSheets/HeroSkillsCardV1.mjs";
import { HeroSummaryCardV1 } from "./Apps/ActorSheets/HeroSummaryCardV1.mjs";
import { RichEditor } from "./Apps/RichEditor.mjs";

// Util imports
import { distanceBetweenFates, nextFate, previousFate } from "./utils/fates.mjs";
import { documentSorter } from "./consts.mjs";
import { rankToInteger } from "./utils/rank.mjs";

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
				RichEditor,
			},
			utils: {
				documentSorter,
				distanceBetweenFates,
				nextFate,
				previousFate,
				rankToInteger,
			},
		}),
		writable: false,
	},
);

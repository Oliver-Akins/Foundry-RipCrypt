// App imports
import { AmmoTracker } from "./Apps/popovers/AmmoTracker.mjs";
import { CombinedHeroSheet } from "./Apps/ActorSheets/CombinedHeroSheet.mjs";
import { DicePool } from "./Apps/DicePool.mjs";
import { RichEditor } from "./Apps/RichEditor.mjs";
import { SkillsCardV1 } from "./Apps/ActorSheets/SkillsCardV1.mjs";
import { StatsCardV1 } from "./Apps/ActorSheets/StatsCardV1.mjs";

// Util imports
import { distanceBetweenFates, nextFate, previousFate } from "./utils/fates.mjs";
import { documentSorter } from "./consts.mjs";
import { rankToInteger } from "./utils/rank.mjs";

// Misc Imports
import { ItemFlags } from "./flags/item.mjs";

const { deepFreeze } = foundry.utils;

Object.defineProperty(
	globalThis,
	`ripcrypt`,
	{
		value: deepFreeze({
			Apps: {
				AmmoTracker,
				DicePool,
				CombinedHeroSheet,
				StatsCardV1,
				SkillsCardV1,
				RichEditor,
			},
			utils: {
				documentSorter,
				distanceBetweenFates,
				nextFate,
				previousFate,
				rankToInteger,
			},
			ItemFlags,
		}),
		writable: false,
	},
);

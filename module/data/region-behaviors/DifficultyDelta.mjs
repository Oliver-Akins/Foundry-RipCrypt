import { Logger } from "../../utils/Logger.mjs";

const { fields } = foundry.data;
const { RegionBehaviorType } = foundry.data.regionBehaviors;

export class DifficultyDeltaBehaviorData extends RegionBehaviorType {
	static LOCALIZATION_PREFIXES = [`RipCrypt.region.difficultyDelta`];

	static defineSchema() {
		return {
			delta: new fields.NumberField({
				required: true,
				initial: 1,
			}),
		};
	};

	static events = {
		[CONST.REGION_EVENTS.TOKEN_ENTER]: this.#onTokenEnter,
		[CONST.REGION_EVENTS.TOKEN_EXIT]: this.#onTokenExit,
	};

	static async #onTokenEnter(event) {
		Logger.debug(`token enter`, event, this);
		const actor = event.data.token.actor;
		// const token = event.data.token.object;
		// Logger.debug(token.center, token.h)
		if (!actor) { return };

		let delta = actor.getFlag(game.system.id, `dcDelta`) ?? 0;
		delta += this.delta;
		actor.setFlag(game.system.id, `dcDelta`, delta);
		ui.notifications.info(`Updated delta to: ${delta}`);
		Logger.debug(`Updated delta to:`, delta);
		// await canvas.interface.createScrollingText(
		// 	token.center,
		// 	delta,
		// 	{
		// 		distance: 2 * token.h,
		// 		fontSize: 40,
		// 		fill: `#aa0000`,
		// 	}
		// );
	};

	static async #onTokenExit(event) {
		Logger.debug(`token exit`, event, this);
		const actor = event.data.token.actor;
		// const token = event.data.token.object;
		if (!actor) { return };

		let delta = actor.getFlag(game.system.id, `dcDelta`) ?? 0;
		delta -= this.delta;
		if (delta === 0) {
			actor.unsetFlag(game.system.id, `dcDelta`);
		} else {
			actor.setFlag(game.system.id, `dcDelta`, delta);
		};
		ui.notifications.info(`Updated delta to: ${delta}`);
		Logger.debug(`Updated delta to:`, delta);
		// await canvas.interface.createScrollingText(
		// 	token.center,
		// 	delta,
		// 	{
		// 		distance: 2 * token.h,
		// 		fontSize: 40,
		// 		fill: `#00aa00`,
		// 	}
		// );
	};
};

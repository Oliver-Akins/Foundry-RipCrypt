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
		if (!actor) { return };
		actor.setFlag(`ripcrypt`, `dcDelta`, this.delta);
	};

	static async #onTokenExit(event) {
		Logger.debug(`token exit`, event, this);
		const actor = event.data.token.actor;
		if (!actor) { return };
		actor.unsetFlag(`ripcrypt`, `dcDelta`);
	};
};

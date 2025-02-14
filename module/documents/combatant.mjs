import { distanceBetweenFates } from "../utils/distanceBetweenFates.mjs";

export class RipCryptCombatant extends Combatant {

	async _preCreate(data, options, user) {
		const allowed = await super._preCreate(data, options, user);
		if (allowed === false) { return false };

		const start = game.settings.get(`ripcrypt`, `currentFate`);
		const end = this.actor?.system?.fate || this.baseActor?.system?.fate;
		const fateDistance = distanceBetweenFates(start, end);

		this.updateSource({
			initiative: fateDistance,
		});
	};

	get groupKey() {
		const path = this.token?.actor?.system?.fate;

		// Disallow grouping things that don't have a fate path
		if (!path) { return null };

		// Token Disposition (group into: friendlies, unknown, hostiles)
		let disposition = `unknown`;
		switch (this.token.disposition) {
			case CONST.TOKEN_DISPOSITIONS.HOSTILE:
				disposition = `hostile`;
				break;
			case CONST.TOKEN_DISPOSITIONS.FRIENDLY:
				disposition = `friendly`;
				break;
		};

		return `${path}:${disposition}`;
	};
};

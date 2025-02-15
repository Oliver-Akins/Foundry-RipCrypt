import { distanceBetweenFates } from "../utils/distanceBetweenFates.mjs";

export class RipCryptCombatant extends Combatant {

	get disposition() {
		switch (this.token?.disposition) {
			case CONST.TOKEN_DISPOSITIONS.HOSTILE:
				return `hostile`;
			case CONST.TOKEN_DISPOSITIONS.FRIENDLY:
				return `friendly`;
		};
		return `unknown`;
	};

	/**
	 * Used by the Combat tracker to order combatants according to their
	 * fate path and the coin flip.
	 */
	get dynamicInitiative() {
		let total = 0;

		const start = game.settings.get(`ripcrypt`, `currentFate`);
		const end = this.actor?.system?.fate || this.baseActor?.system?.fate;
		total += distanceBetweenFates(start, end);

		const whoFirst = game.settings.get(`ripcrypt`, `whoFirst`);
		const disposition = this.disposition;
		if (disposition === `unknown`) {
			total += 0.25;
		} else if (whoFirst && whoFirst !== disposition) {
			total += 0.5;
		};

		return total;
	};

	get groupKey() {
		const path = this.token?.actor?.system?.fate;

		// Disallow grouping things that don't have a fate path
		if (!path) { return null };

		// Token Disposition (group into: friendlies, unknown, hostiles)
		let disposition = this.disposition;

		return `${path}:${disposition}`;
	};

	_onCreate() {
		if (this.token) {
			this.token._object._refreshTurnMarker();
		};
	};

	_onDelete() {
		if (this.token) {
			this.token._object._refreshTurnMarker();
		};
	};
};

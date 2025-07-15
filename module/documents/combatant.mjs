import { distanceBetweenFates } from "../utils/fates.mjs";

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
		if (whoFirst) {
			const disposition = this.disposition;
			if (disposition === `unknown`) {
				total += 0.25;
			} else if (whoFirst !== disposition) {
				total += 0.5;
			};
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

	/**
	 * Used to create the turn marker when the combatant is added if they're in
	 * the group whose turn it is.
	 *
	 * @override
	 */
	_onCreate() {
		this.token?._object?._refreshTurnMarker();
	};

	/**
	 * Used to remove the turn marker when the combatant is removed from combat
	 * if they had it visible so that it doesn't stick around infinitely.
	 *
	 * @override
	 */
	_onDelete() {
		this.token?._object?._refreshTurnMarker();
	};
};

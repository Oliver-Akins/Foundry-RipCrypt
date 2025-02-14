/*
Resources:
- Combat : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/documents/combat.mjs
- Combatant : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/documents/combatant.mjs
- CombatTracker : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/applications/combat/combat-tracker.mjs
*/

export class RipCryptCombat extends Combat {

	get groups() {
		let groups = new Map();

		for (const combatant of this.combatants) {
			const groupKey = combatant.groupKey;
			if (!groupKey) { continue };

			if (groups.has(groupKey)) {
				groups.get(groupKey).push(combatant);
			} else {
				groups.set(groupKey, [combatant]);
			};
		};

		return groups;
	};

	/**
	 * @override
	 * Sorts combatants for the combat tracker in the following way:
	 *	- Distance from the current fate ordinal. (0 -> 3)
	 *	- Coin Flip result (if disposition matches flip result, then 0, otherwise, 0.5)
	 */
	_sortCombatants(a, b) {
		// The distance from fate
		return super._sortCombatants(a, b) * -1;
	};

	// nextTurn() {
	// 	// Make it skip all combatants with the same initiative value
	// };

	// previousTurn() {
	// 	// Go back a step
	// };
};

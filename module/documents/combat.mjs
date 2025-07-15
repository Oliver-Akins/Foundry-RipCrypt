/*
Resources:
- Combat : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/documents/combat.mjs
- Combatant : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/documents/combatant.mjs
- CombatTracker : https://github.com/foundryvtt/dnd5e/blob/4.3.x/module/applications/combat/combat-tracker.mjs
*/

export class RipCryptCombat extends Combat {

	get customGroups() {
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
		const ia = Number.isNumeric(a.dynamicInitiative) ? a.dynamicInitiative : -Infinity;
		const ib = Number.isNumeric(b.dynamicInitiative) ? b.dynamicInitiative : -Infinity;

		const delta = ia - ib;
		if (Math.sign(delta) !== 0) {
			return delta;
		};

		// fallback to alphabetical sort
		return a.name < b.name ? -1 : 1;
	};

	async nextTurn() {
		if (this.round === 0) {return this.nextRound()}

		const turn = this.turn ?? -1;

		const groupKey = this.turns[turn]?.groupKey;

		// Determine the next turn number
		let nextTurn = null;
		for (let i = turn + 1; i < this.turns.length; i++) {
			const combatant = this.turns[i];
			if (combatant.groupKey !== groupKey) {
				nextTurn = i;
				break;
			};
		};

		// Maybe advance to the next round
		if ((nextTurn === null) || (nextTurn >= this.turns.length)) {return this.nextRound()}

		const advanceTime = this.getTimeDelta(this.round, this.turn, this.round, nextTurn);

		// Update the document, passing data through a hook first
		const updateData = {round: this.round, turn: nextTurn};
		const updateOptions = {direction: 1, worldTime: {delta: advanceTime}};
		Hooks.callAll(`combatTurn`, this, updateData, updateOptions);
		await this.update(updateData, updateOptions);
		return this;
	};

	async previousTurn() {
		if (this.round === 0) { return this }
		if ((this.turn === 0) || (this.turns.length === 0)) {return this.previousRound()}

		const currentTurn = (this.turn ?? this.turns.length) - 1;
		let previousTurn = null;
		const groupKey = this.combatant.groupKey;
		for (let i = currentTurn; i >= 0; i--) {
			const combatant = this.turns[i];
			if (combatant.groupKey !== groupKey) {
				previousTurn = i;
				break;
			}
		}

		if (previousTurn < 0) {
			if (this.round === 1) {
				this.round = 0;
				return this;
			};
			return this.previousRound();
		}

		const advanceTime = this.getTimeDelta(this.round, this.turn, this.round, previousTurn);

		// Update the document, passing data through a hook first
		const updateData = {round: this.round, turn: previousTurn};
		const updateOptions = {direction: -1, worldTime: {delta: advanceTime}};
		Hooks.callAll(`combatTurn`, this, updateData, updateOptions);
		await this.update(updateData, updateOptions);
		return this;
	};

	/**
	 * Overridden to make it so that there can be multiple tokens with turn markers
	 * visible at the same time.
	 *
	 * @protected
	 * @internal
	 * @override
	 */
	_updateTurnMarkers() {
		if (!canvas.ready) { return };

		const tokenGroup = this.combatant?.groupKey;
		for (const token of canvas.tokens.turnMarkers) {
			const actor = token.actor ?? token.baseActor;
			if (actor?.groupKey !== tokenGroup) {
				token.renderFlags.set({refreshTurnMarker: true});
			}
		}

		if (!this.active) { return };
		const currentToken = this.combatant?.token?._object;
		if (!tokenGroup && currentToken) {
			currentToken.renderFlags.set({refreshTurnMarker: true});
		} else {
			const group = this.customGroups.get(tokenGroup) ?? [];
			for (const combatant of group) {
				combatant.token?._object?.renderFlags.set({ refreshTurnMarker: true });
			}
		}
	}
};

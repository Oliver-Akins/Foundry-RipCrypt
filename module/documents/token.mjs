const { Token } = foundry.canvas.placeables;
const { TokenTurnMarker } = foundry.canvas.placeables.tokens;

export class RipCryptToken extends Token {
	/**
	 * Overridden using a slightly modified implementation in order to make it so
	 * that the turn marker shows up on tokens if they're in the same group as the
	 * currently active combatant
	 *
	 * @override
	 */
	_refreshTurnMarker() {
		// Should a Turn Marker be active?
		const {turnMarker} = this.document;
		const markersEnabled = CONFIG.Combat.settings.turnMarker.enabled
			&& (turnMarker.mode !== CONST.TOKEN_TURN_MARKER_MODES.DISABLED);
		const combatant = game.combat?.active ? game.combat.combatant : null;
		const isTurn = combatant && (combatant.groupKey === this.combatant?.groupKey);
		const isDefeated = combatant && combatant.isDefeated;
		const markerActive = markersEnabled && isTurn && !isDefeated;

		// Activate a Turn Marker
		if (markerActive) {
			if (!this.turnMarker) {
				this.turnMarker = this.addChildAt(new TokenTurnMarker(this), 0);
			};
			canvas.tokens.turnMarkers.add(this);
			this.turnMarker.draw();
		} else if (this.turnMarker) {
			canvas.tokens.turnMarkers.delete(this);
			this.turnMarker.destroy();
			this.turnMarker = null;
		}
	}
};

const { CombatTracker } = foundry.applications.sidebar.tabs;

export class RipCryptCombatTracker extends CombatTracker {
	/**
	 * @override
	 */
	async _prepareTurnContext(combat, combatant, index) {
		const turn = await super._prepareTurnContext(combat, combatant, index);

		turn.hasDecimals = true;
		turn.initiative = combatant.dynamicInitiative;

		const groupKey = combatant.groupKey;
		if (groupKey && combat.started) {
			turn.active ||= combat.combatant.groupKey === groupKey;
			if (turn.active && !turn.css.includes(`active`)) {
				turn.css += `active`;
			};
		};

		return turn;
	};

	async _onRender(...args) {
		await super._onRender(...args);

		// Purge the combat controls that I don't want to exist because they don't
		// make sense in the system.
		this.element.querySelector(`[data-action="resetAll"]`)?.remove();
		this.element.querySelector(`[data-action="rollNPC"]`)?.remove();
		this.element.querySelector(`[data-action="rollAll"]`)?.remove();
	};
};

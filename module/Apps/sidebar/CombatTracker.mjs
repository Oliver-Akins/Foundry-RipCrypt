import { Logger } from "../../utils/Logger.mjs";

const { CombatTracker } = foundry.applications.sidebar.tabs;

export class RipCryptCombatTracker extends CombatTracker {
	/**
	 * @override
	 */
	async _prepareTurnContext(combat, combatant, index) {
		Logger.debug(`_prepareTurnContext`);
		const turn = await super._prepareTurnContext(combat, combatant, index);

		// if ( !this.viewed ) return;

		// ! TODO: This is causing an error while the combat is not active, but is fine when it's active, this needs to be fixed
		Logger.debug(turn, combatant);
		const groupKey = combatant.groupKey;
		if (groupKey) {
			turn.active ||= combat.combatant.groupKey === groupKey;
			if (turn.active && !turn.css.includes(`active`)) {
				turn.css += `active`;
			};
		};

		return turn;
	}
};

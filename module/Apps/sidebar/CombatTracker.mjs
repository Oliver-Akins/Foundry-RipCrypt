const { CombatTracker } = foundry.applications.sidebar.tabs;

function createButtonInnerHTML() {
	const whoFirst = game.settings.get(`ripcrypt`, `whoFirst`);
	let icon = `evil`;
	let ariaLabel = `Geists go first, click to make heroes go first`;

	if (whoFirst === `friendly`) {
		icon = `hero`;
		ariaLabel = `Heroes go first, click to make geists go first`;
	};

	return `<rc-icon
		name="icons/${icon}"
		var:fill="currentColor"
		aria-label="${ariaLabel}"
	></rc-icon>`;
};

function createButtonTooltip() {
	const whoFirst = game.settings.get(`ripcrypt`, `whoFirst`);
	if (whoFirst === `friendly`) {
		return `Heroes currently go first`;
	};
	return `Geists currently go first`;
};

export class RipCryptCombatTracker extends CombatTracker {

	static DEFAULT_OPTIONS = {
		actions: {
			toggleFirst: this.#toggleFirst,
		},
	};

	/**
	 * Changes the way the combat tracker renders combatant rows to account for
	 * multiple combatants being in the same combat "group", thus all going at the
	 * same time.
	 *
	 * @override
	 */
	async _prepareTurnContext(combat, combatant, index) {
		const turn = await super._prepareTurnContext(combat, combatant, index);

		turn.hasDecimals = true;
		turn.initiative = combatant.dynamicInitiative;

		const groupKey = combatant?.groupKey;
		if (groupKey && combat.started) {
			turn.active ||= combat.combatant?.groupKey === groupKey;
			if (turn.active && !turn.css.includes(`active`)) {
				turn.css += ` active`;
			};
		};

		return turn;
	};

	async _onRender(...args) {
		await super._onRender(...args);

		const spacer = document.createElement(`div`);
		spacer.classList.add(`spacer`);

		const button = document.createElement(`button`);
		button.classList.add(`inline-control`, `combat-control`, `icon`);
		button.type = `button`;
		button.dataset.tooltip = createButtonTooltip();
		button.dataset.action = `toggleFirst`;
		button.innerHTML = createButtonInnerHTML();
		button.disabled = !game.user.isGM;

		// Purge the combat controls that I don't want to exist because they don't
		// make sense in the system.
		this.element?.querySelector(`[data-action="rollNPC"]`)?.replaceWith(spacer.cloneNode(true));
		this.element?.querySelector(`[data-action="rollAll"]`)?.replaceWith(button.cloneNode(true));
	};

	static async #toggleFirst(_event, element) {
		game.tooltip.deactivate();
		const whoFirst = game.settings.get(`ripcrypt`, `whoFirst`);
		const otherFirst = whoFirst === `friendly` ? `hostile` : `friendly`;
		await game.settings.set(`ripcrypt`, `whoFirst`, otherFirst);
		element.innerHTML = createButtonInnerHTML();
		element.dataset.tooltip = createButtonTooltip();
		game.tooltip.activate(element);
	};
};

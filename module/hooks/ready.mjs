import { filePath } from "../consts.mjs";
import { Logger } from "../utils/Logger.mjs";

Hooks.once(`ready`, () => {
	Logger.log(`Ready`);

	let defaultTab = game.settings.get(`ripcrypt`, `defaultTab`);
	if (defaultTab) {
		if (!ui.sidebar?.TABS?.[defaultTab]) {
			Logger.error(`Couldn't find a sidebar tab with ID:`, defaultTab);
		} else {
			Logger.debug(`Switching sidebar tab to:`, defaultTab);
			ui.sidebar.activateTab(defaultTab);
		};
	};

	if (game.settings.get(`ripcrypt`, `devMode`)) {
		ui.sidebar.expand();
		if (game.paused) { game.togglePause() };
	};

	ui.delveDice.render({ force: true });

	// MARK: 1-time updates
	if (!game.settings.get(`ripcrypt`, `firstLoadFinished`)) {
		// Update the turnMarker to be the RipCrypt defaults
		const combatConfig = game.settings.get(`core`, `combatTrackerConfig`);
		combatConfig.turnMarker.src = filePath(`assets/turn-marker.png`);
		combatConfig.turnMarker.animation = `spinPulse`;
		game.settings.set(`core`, `combatTrackerConfig`, combatConfig);
	}

	game.settings.set(`ripcrypt`, `firstLoadFinished`, true);
});

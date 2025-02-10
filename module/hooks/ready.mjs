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

	if (game.settings.get(`ripcrypt`, `showDelveTour`)) {
		ui.crypt.render({ force: true });
	};
});

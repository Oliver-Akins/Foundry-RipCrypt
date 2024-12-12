import { Logger } from "../utils/Logger.mjs";

Hooks.once(`ready`, () => {
	Logger.log(`Ready`);

	let defaultTab = game.settings.get(`ripcrypt`, `defaultTab`);
	if (defaultTab) {
		if (!ui.sidebar?.tabs?.[defaultTab]) {
			Logger.error(`Couldn't find a sidebar tab with ID:`, defaultTab);
		} else {
			Logger.debug(`Switching sidebar tab to:`, defaultTab);
			ui.sidebar.tabs[defaultTab].activate();
		};
	};

	if (game.settings.get(`ripcrypt`, `devMode`)) {
		if (game.paused) { game.togglePause() };
	};
});

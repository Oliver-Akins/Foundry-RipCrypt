export function registerDevSettings() {
	game.settings.register(`ripcrypt`, `devMode`, {
		scope: `client`,
		type: Boolean,
		config: false,
		default: false,
		requiresReload: false,
	});

	game.settings.register(`ripcrypt`, `defaultTab`, {
		name: `Default Tab`,
		scope: `client`,
		type: String,
		config: game.settings.get(`ripcrypt`, `devMode`),
		requiresReload: false,
	});
};

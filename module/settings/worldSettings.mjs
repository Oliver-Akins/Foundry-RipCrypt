export function registerWorldSettings() {
	game.settings.register(`ripcrypt`, `showDelveTour`, {
		name: `Delve Tour Popup`,
		scope: `world`,
		type: Boolean,
		config: true,
		default: true,
		requiresReload: false,
	});
};

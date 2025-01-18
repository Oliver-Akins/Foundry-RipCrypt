export function registerMetaSettings() {
	game.settings.register(`ripcrypt`, `dc`, {
		scope: `world`,
		type: Number,
		config: false,
		requiresReload: false,
	});
};

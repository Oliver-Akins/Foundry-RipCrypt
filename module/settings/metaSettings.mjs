export function registerMetaSettings() {
	game.settings.register(`ripcrypt`, `dc`, {
		scope: `world`,
		type: Number,
		config: false,
		requiresReload: false,
		onChange: () => {
			ui.crypt.render({ parts: [ `delveConditions` ]});
		},
	});

	game.settings.register(`ripcrypt`, `currentFate`, {
		scope: `world`,
		type: String,
		config: false,
		requiresReload: false,
		onChange: () => {
			ui.crypt.render({ parts: [ `fate` ] });
		},
	});
	game.settings.register(`ripcrypt`, `whoFirst`, {
		scope: `world`,
		type: String,
		config: false,
		requiresReload: false,
		initial: `friendly`,
		onChange: async () => {
			await game.combat.setupTurns();
			await ui.combat.render({ parts: [ `tracker` ] });
		},
	});
};

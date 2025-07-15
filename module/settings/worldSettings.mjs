const { NumberField, StringField } = foundry.data.fields;

export function registerWorldSettings() {
	game.settings.register(`ripcrypt`, `sandsOfFateInitial`, {
		name: `RipCrypt.setting.sandsOfFateInitial.name`,
		hint: `RipCrypt.setting.sandsOfFateInitial.hint`,
		scope: `world`,
		config: true,
		requiresReload: false,
		type: new NumberField({
			required: true,
			min: 1,
			step: 1,
			max: 10,
			initial: 8,
		}),
		onChange: async (newInitialSands) => {
			const currentSands = game.settings.get(`ripcrypt`, `sandsOfFate`);
			if (newInitialSands <= currentSands) {
				game.settings.set(`ripcrypt`, `sandsOfFate`, newInitialSands);
			};
		},
	});

	game.settings.register(`ripcrypt`, `onCrypticEvent`, {
		name: `RipCrypt.setting.onCrypticEvent.name`,
		hint: `RipCrypt.setting.onCrypticEvent.hint`,
		scope: `world`,
		config: true,
		requiresReload: false,
		type: new StringField({
			required: true,
			initial: `notif`,
			choices: {
				"notif": `RipCrypt.setting.onCrypticEvent.options.notif`,
				"pause": `RipCrypt.setting.onCrypticEvent.options.pause`,
				"both": `RipCrypt.setting.onCrypticEvent.options.both`,
				"nothing": `RipCrypt.setting.onCrypticEvent.options.nothing`,
			},
		}),
	});
};

export function registerUserSettings() {
	const userScope = game.release.generation >= 13 ? `user` : `client`;

	game.settings.register(`ripcrypt`, `abbrAccess`, {
		name: `RipCrypt.setting.abbrAccess.name`,
		hint: `RipCrypt.setting.abbrAccess.hint`,
		scope: userScope,
		type: Boolean,
		config: true,
		default: false,
		requiresReload: false,
	});

	game.settings.register(`ripcrypt`, `condensedRange`, {
		name: `RipCrypt.setting.condensedRange.name`,
		hint: `RipCrypt.setting.condensedRange.hint`,
		scope: userScope,
		type: Boolean,
		config: true,
		default: true,
		requiresReload: false,
	});
};

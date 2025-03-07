import { gameTerms } from "../gameTerms.mjs";

const { StringField } = foundry.data.fields;
const { FatePath } = gameTerms;

export function registerMetaSettings() {
	game.settings.register(`ripcrypt`, `dc`, {
		scope: `world`,
		type: Number,
		config: false,
		requiresReload: false,
		onChange: () => {
			ui.delveDice.render({ parts: [`difficulty`] });
		},
	});

	game.settings.register(`ripcrypt`, `sandsOfFate`, {
		scope: `world`,
		type: Number,
		initial: 8,
		config: false,
		requiresReload: false,
		onChange: async () => {
			ui.delveDice.animate({ parts: [`sandsOfFate`] });
		},
	});

	game.settings.register(`ripcrypt`, `currentFate`, {
		scope: `world`,
		type: new StringField({
			blank: false,
			nullable: false,
			initial: FatePath.NORTH,
		}),
		config: false,
		requiresReload: false,
		onChange: async () => {
			ui.delveDice.animate({ parts: [`fateCompass`] });
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

	game.settings.register(`ripcrypt`, `firstLoadFinished`, {
		scope: `world`,
		type: Boolean,
		initial: false,
		requiresReload: false,
	});
};

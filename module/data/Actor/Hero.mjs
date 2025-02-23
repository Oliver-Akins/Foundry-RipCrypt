import { gameTerms } from "../../gameTerms.mjs";
import { sumReduce } from "../../utils/sumReduce.mjs";

const { fields } = foundry.data;

export class HeroData extends foundry.abstract.TypeDataModel {

	// MARK: Token Attrs
	static get trackableAttributes() {
		return {
			bar: [
				`guts`,
			],
			value: [
				`ability.grit`,
				`ability.gait`,
				`ability.grip`,
				`ability.glim`,
				`level.glory`,
				`level.step`,
				`level.rank`,
				`coin.gold`,
				`coin.silver`,
				`coin.copper`,
			],
		};
	};

	// MARK: Schema
	static defineSchema() {
		return {
			ability: new fields.SchemaField({
				grit: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				gait: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				grip: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
				glim: new fields.NumberField({
					min: 0,
					initial: 1,
					integer: true,
					required: true,
					nullable: false,
				}),
			}),
			guts: new fields.SchemaField({
				value: new fields.NumberField({
					min: 0,
					initial: 5,
					integer: true,
					nullable: false,
				}),
			}),
			coin: new fields.SchemaField({
				gold: new fields.NumberField({
					initial: 5,
					integer: true,
					required: true,
					nullable: false,
				}),
				silver: new fields.NumberField({
					initial: 0,
					integer: true,
					required: true,
					nullable: false,
				}),
				copper: new fields.NumberField({
					initial: 0,
					integer: true,
					required: true,
					nullable: false,
				}),
			}),
			fate: new fields.StringField({
				initial: ``,
				blank: true,
				trim: true,
				nullable: false,
				choices: () => {
					return Object.values(gameTerms.FatePath).concat(``);
				},
			}),
			level: new fields.SchemaField({
				glory: new fields.NumberField({
					min: 0,
					initial: 0,
					integer: true,
					required: true,
					nullable: false,
				}),
				step: new fields.NumberField({
					min: 1,
					initial: 1,
					max: 3,
					integer: true,
					required: true,
					nullable: false,
				}),
				rank: new fields.StringField({
					initial: gameTerms.Rank.NOVICE,
					required: true,
					nullable: false,
					blank: false,
					trim: true,
					choices: Object.values(gameTerms.Rank),
				}),
			}),
		};
	};

	// MARK: Base Data
	prepareBaseData() {
		super.prepareBaseData();

		this.guts.max = 0;

		// The limitations imposed on things like inventory spaces and equipped
		// weapon count
		this.limit = {
			weapons: 4,
			equipment: 12,
			skills: 4,
		};
	};

	// MARK: Derived Data
	prepareDerivedData() {
		super.prepareDerivedData();

		this.guts.max += Object.values(this.ability).reduce(sumReduce);

		// Movement speeds
		this.speed = {
			move: this.ability.gait + 3,
			run: (this.ability.gait + 3) * 2,
		};
	};

	// #region Getters
	get equippedArmour() {
		const armours = this.parent.itemTypes.armour;
		const slots = Object.fromEntries(
			Object.values(gameTerms.Anatomy).map(v => [v, null]),
		);
		for (const armour of armours) {
			if (!armour.system.equipped) { continue };
			for (const locationTag of [...armour.system.location.values()]) {
				const location = locationTag.toLowerCase();
				slots[location] = armour;
			};
		};
		return slots;
	};

	get equippedShield() {
		const shields = this.parent.itemTypes.shield;
		return shields.find(item => item.system.equipped);
	};

	get defense() {
		const defenses = {};
		const armour = this.equippedArmour;
		for (const slot in armour) {
			defenses[slot] = armour[slot]?.system.protection ?? 0;
		};

		const shield = this.equippedShield;
		if (shield) {
			for (const location of [...shield.system.location.values()]) {
				const slot = location.toLowerCase();
				defenses[slot] += shield.system.protection;
			};
		};

		return defenses;
	};
	// #endregion
};

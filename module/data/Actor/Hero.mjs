import { gameTerms } from "../../gameTerms.mjs";
import { sumReduce } from "../../utils/sumReduce.mjs";

const { fields } = foundry.data;

export class HeroData extends foundry.abstract.TypeDataModel {

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
			],
		};
	};

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
					return gameTerms.FatePath.concat(``);
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
				rank: new fields.NumberField({
					min: 0,
					initial: 0,
					max: 3,
					integer: true,
					required: true,
					nullable: false,
				}),
			}),
		};
	};

	prepareBaseData() {
		super.prepareBaseData();

		this.guts.max = 0;

		// The limitations imposed on things like inventory spaces and equipped
		// weapon count
		this.limit = {
			weapons: 4,
			equipment: 12,
		};
	};

	prepareDerivedData() {
		super.prepareDerivedData();

		this.guts.max += Object.values(this.ability).reduce(sumReduce);

		// Movement speeds
		this.speed = {
			move: this.ability.gait + 3,
			run: (this.ability.gait + 3) * 2,
		};
	};
};

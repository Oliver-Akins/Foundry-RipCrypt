export const gameTerms = Object.preventExtensions({
	Abilities: Object.freeze({
		GRIT: `grit`,
		GRIP: `grip`,
		GAIT: `gait`,
		GLIM: `glim`,
		THINGLIM: `thin-glim`,
	}),
	Aspects: Object.freeze({
		FOCUS: `focus`,
		FLECT: `flect`,
		FRACT: `fract`,
	}),
	FatePath: Object.freeze({
		NORTH: `North`,
		EAST: `East`,
		SOUTH: `South`,
		WEST: `West`,
	}),
	Access: [
		`Common`,
		`Uncommon`,
		`Rare`,
		`Scarce`,
	],
	Rank: Object.freeze({
		NOVICE: `novice`,
		ADEPT: `adept`,
		EXPERT: `expert`,
		MASTER: `master`,
	}),
	Anatomy: Object.freeze({
		HEAD: `head`,
		BODY: `body`,
		ARMS: `arms`,
		LEGS: `legs`,
	}),
	/** The types of items that contribute to the gear limit */
	gearItemTypes: new Set([
		`armour`,
		`weapon`,
		`shield`,
		`good`,
	]),
});

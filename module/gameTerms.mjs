export const gameTerms = Object.preventExtensions({
	FatePath: [
		`North`,
		`East`,
		`South`,
		`West`,
	],
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
	]),
});

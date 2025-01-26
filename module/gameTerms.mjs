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
	Rank: {
		NOVICE: `Novice`,
		ADEPT: `Adept`,
		EXPERT: `Expert`,
		MASTER: `Master`,
	},
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

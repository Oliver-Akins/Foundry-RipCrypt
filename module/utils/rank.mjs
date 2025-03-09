import { gameTerms } from "../gameTerms.mjs";

export function rankToInteger(rankName) {
	return Object.values(gameTerms.Rank)
		.findIndex(r => r === rankName) + 1;
};

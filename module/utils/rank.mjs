import { gameTerms } from "../gameTerms.mjs";

/**
 * Converts a rank's name into an integer form for use in mathematical calculations
 * that rely on rank.
 *
 * @param {Novice|Adept|Expert|Master} rankName The rank to convert into an integer
 * @returns An integer between 1 and 4
 */
export function rankToInteger(rankName) {
	return Object.values(gameTerms.Rank)
		.findIndex(r => r === rankName) + 1;
};

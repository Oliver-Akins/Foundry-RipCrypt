import { gameTerms } from "../gameTerms.mjs";
import { Logger } from "./Logger.mjs";

const { FatePath } = gameTerms;

export function isOppositeFates(a, b) {
	return (a === FatePath.NORTH && b === FatePath.SOUTH)
		|| (a === FatePath.EAST && b === FatePath.WEST);
};

export function distanceBetweenFates(start, end) {
	if (!start || !end) {
		Logger.error(`Start and End must both have a defined value, given`, {start, end});
		return undefined;
	};

	if (isOppositeFates(start, end)) {
		return 2;
	};

	let isForward = start === FatePath.SOUTH && end === FatePath.WEST;
	isForward ||= start === FatePath.NORTH && end === FatePath.EAST;
	if (isForward) {
		return 1;
	};
	return 3;
};

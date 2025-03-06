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

	if (start === end) {
		return 0;
	};

	if (isOppositeFates(start, end) || isOppositeFates(end, start)) {
		return 2;
	};

	let isForward = start === FatePath.SOUTH && end === FatePath.WEST;
	isForward ||= start === FatePath.NORTH && end === FatePath.EAST;
	isForward ||= start === FatePath.WEST && end === FatePath.NORTH;
	isForward ||= start === FatePath.EAST && end === FatePath.SOUTH;
	if (isForward) {
		return 1;
	};
	return 3;
};

const fateOrder = [
	FatePath.WEST, // to make the .find not integer overflow
	FatePath.NORTH,
	FatePath.EAST,
	FatePath.SOUTH,
	FatePath.WEST,
];

export function nextFate(fate) {
	const fateIndex = fateOrder.findIndex(f => f === fate);
	return fateOrder[fateIndex + 1];
};

export function previousFate(fate) {
	const fateIndex = fateOrder.lastIndexOf(fate);
	return fateOrder[fateIndex - 1];
};

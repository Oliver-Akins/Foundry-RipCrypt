const { getType } = foundry.utils;

// MARK: filePath
export function filePath(path) {
	if (path.startsWith(`/`)) {
		path = path.slice(1);
	};
	return `systems/ripcrypt/${path}`;
};

// MARK: toBoolean
/**
 * Converts a value into a boolean based on the type of the value provided
 *
 * @param {any} val The value to convert
 */
export function toBoolean(val) {
	switch (getType(val)) {
		case `string`: {
			return val === `true`;
		};
		case `number`: {
			return val === 1;
		};
	};
	return Boolean(val);
};

// MARK: documentSorter
/**
 * @typedef {Object} Sortable
 * @property {integer} sort
 * @property {string} name
 */

/**
 * Compares two Sortable documents in order to determine ordering
 * @param {Sortable} a
 * @param {Sortable} b
 * @returns An integer dictating which order the two documents should be sorted in
 */
export function documentSorter(a, b) {
	if (!a && !b) {
		return 0;
	} else if (!a) {
		return 1;
	} else if (!b) {
		return -1;
	};

	const sortDelta = b.sort - a.sort;
	if (sortDelta !== 0) {
		return sortDelta;
	};
	return Math.sign(a.name.localeCompare(b.name));
};

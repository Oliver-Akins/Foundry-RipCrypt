// MARK: filePath
export function filePath(path) {
	if (path.startsWith(`/`)) {
		path = path.slice(1);
	};
	return `systems/ripcrypt/${path}`;
};

// MARK: documentSorter
export function documentSorter(a, b) {
	const sortDelta = b.sort - a.sort;
	if (sortDelta !== 0) {
		return sortDelta;
	};
	// TODO alphabetical sort
	return 0;
};

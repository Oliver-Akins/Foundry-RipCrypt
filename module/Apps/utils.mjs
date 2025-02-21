/*
This file contains utilities used by Applications in order to be DRYer
*/

/**
 * @param {HTMLElement} target The element to operate on
 */
export async function createItemFromElement(target, { parent } = {}) {
	const data = target.dataset;
	const types = data.itemTypes?.split(`,`);
	const type = data.defaultItemType;
	await Item.createDialog(
		{ type },
		{ parent },
		{
			types,
			folders: [],
		},
	);
};

/**
 * @param {HTMLElement} target The element to operate on
 */
export async function editItemFromElement(target) {
	const itemEl = target.closest(`[data-item-id]`);
	if (!itemEl) { return };
	const itemId = itemEl.dataset.itemId;
	if (!itemId) { return };
	const item = await fromUuid(itemId);
	item.sheet.render({ force: true, orBringToFront: true });
};

/**
 * @param {HTMLElement} target The element to operate on
 */
export async function deleteItemFromElement(target) {
	const itemEl = target.closest(`[data-item-id]`);
	if (!itemEl) { return };
	const itemId = itemEl.dataset.itemId;
	if (!itemId) { return };
	const item = await fromUuid(itemId);
	item.delete();
};

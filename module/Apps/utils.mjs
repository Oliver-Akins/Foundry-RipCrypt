/*
This file contains utilities used by Applications in order to be DRYer
*/

/**
 * @param {HTMLElement} target The element that gets
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
 * @param {HTMLElement} target The element that gets
 */
export async function deleteItemFromElement(target) {
	const itemEl = target.closest(`[data-item-id]`);
	if (!itemEl) { return };
	const itemId = itemEl.dataset.itemId;
	if (!itemId) { return };
	const item = await fromUuid(itemId);
	item.delete();
};

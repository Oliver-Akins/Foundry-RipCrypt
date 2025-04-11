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

/**
 * Updates a document using the UUID, expects there to be the following
 * dataset attributes:
 *   - "data-foreign-uuid" : The UUID of the document to update
 *   - "data-foreign-name" : The dot-separated path of the value to update
 *
 * @param {Event} event
 */
export async function updateForeignDocumentFromEvent(event) {
	const target = event.currentTarget;
	const data = target.dataset;
	const document = await fromUuid(data.foreignUuid);

	let value = target.value;
	switch (target.type) {
		case `checkbox`: value = target.checked; break;
	};

	await document?.update({ [data.foreignName]: value });
};

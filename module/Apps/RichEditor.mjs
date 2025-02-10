/*
This Application is used by parts of the system to enable a better experience
while editing enriched text, because a lot of the spaces for text are really
small and are better served by a bigger text editor so that the controls are
more visible and doesn't cause as much overflow chaos.
*/

import { filePath } from "../consts.mjs";

const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;
const { hasProperty, getProperty } = foundry.utils;

export class RichEditor extends HandlebarsApplicationMixin(DocumentSheetV2) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt`,
			`ripcrypt--RichEditor`,
		],
		window: {
			title: `Text Editor`,
			frame: true,
			positioned: true,
			resizable: false,
			minimizable: true,
		},
		position: {
			width: `auto`,
			height: `auto`,
		},
		actions: {},
		form: {
			submitOnChange: true,
			closeOnSubmit: false,
		},
	};

	static PARTS = {
		editor: {
			template: filePath(`templates/Apps/RichEditor/content.hbs`),
			root: true,
		},
	};
	// #endregion

	// #region Instance Data
	document;
	path;

	constructor(opts) {
		const {
			document,
			path,
			compact = false,
			collaborative = true,
		} = opts;

		if (!hasProperty(document, path)) {
			throw new Error(`Document provided to text editor must have the property specified by the path.`);
		};

		opts.sheetConfig = false;
		super(opts);

		this.compact = compact;
		this.collaborative = collaborative;
		this.document = document;
		this.path = path;
	};
	// #endregion

	// #region Lifecycle
	async _preparePartContext(partId, ctx, _opts) {
		ctx = {
			uuid: this.document.uuid,
			editable: true, // this.isEditable
			collaborative: this.collaborative,
			compact: this.compact,
			path: this.path,
		};

		console.log({
			doc: this.document,
			path: this.path,
			value: this.document.system.description,
		});
		const value = getProperty(this.document, this.path);
		ctx.enriched = await TextEditor.enrichHTML(value);
		ctx.raw = value;
		return ctx;
	};
	// #endregion
};

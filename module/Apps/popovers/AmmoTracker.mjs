import { filePath } from "../../consts.mjs";
import { GenericPopoverMixin } from "./GenericPopoverMixin.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class AmmoTracker extends GenericPopoverMixin(HandlebarsApplicationMixin(ApplicationV2)) {
	// #region Options
	static DEFAULT_OPTIONS = {
		classes: [
			`ripcrypt--AmmoTracker`,
		],
		window: {
			frame: false,
			positioned: true,
			resizable: false,
			minimizable: false,
		},
		position: {
			width: 100,
			height: 30,
		},
		actions: {},
	};

	static PARTS = {
		main: {
			template: filePath(`templates/Apps/popovers/AmmoTracker/content.hbs`),
		},
	};
	// #endregion

	// #region Instance Data
	popover = {};
	constructor({ popover, ...options}) {

		// For when the caller doesn't provide anything, we want this to behave
		// like a normal Application.
		popover.framed ??= true;
		popover.locked ??= true;

		if (popover.framed) {
			options.window.frame = true;
			options.window.minimizable = true;
		}

		super(options);

		this.popover = popover;
	};
	// #endregion

	// #region Lifecycle
	_insertElement(element) {
		// console.log(this.popover);
		const existing = document.getElementById(element.id);
		if (existing) {
			existing.replaceWith(element);
			return;
		};
		// const pos = element.getBoundingClientRect();

		// const horizontalOffset = Math.floor(pos.width / 2);
		// console.log({ x: this.popover.x, y: this.popover.y, height: pos.height, xOffset: horizontalOffset });

		element.style.position = `absolute`;
		element.style.color = `black`;
		element.style.background = `greenyellow`;
		element.style[`z-index`] = 10000;
		// element.style.left = `${this.popover.x - horizontalOffset}px`;
		// element.style.top = `${this.popover.y - pos.height}px`;
		// this.position = {
		// 	left: this.popover.x - horizontalOffset,
		// 	top: this.popover.y - pos.height,
		// };

		// standard addition
		document.body.append(element);
	};

	// _updatePosition(position) {
	// 	const pos = super._updatePosition(position);
	// 	if (this.popover.framed) { return pos };

	// 	delete pos.left;
	// 	delete pos.top;

	// 	const el = this.element;
	// 	let bounds;
	// 	let width, height;

	// 	// Implicit height
	// 	if ( true ) {
	// 		Object.assign(el.style, {width: `${width}px`, height: ""});
	// 		bounds = el.getBoundingClientRect();
	// 		height = bounds.height;
	// 	}

	// 	// Implicit width
	// 	if ( true ) {
	// 		Object.assign(el.style, {height: `${height}px`, width: ""});
	// 		bounds = el.getBoundingClientRect();
	// 		width = bounds.width;
	// 	}

	// 	// const { width, height } = this.element.getBoundingClientRect();
	// 	const horizontalOffset = Math.floor(width / 2);
	// 	pos.left = this.popover.x - horizontalOffset;
	// 	pos.top = this.popover.y - height;

	// 	console.log({ x: this.popover.x, y: this.popover.y, height, xOffset: horizontalOffset, width });

	// 	return pos;
	// }

	/**
	 * @override
	 * Custom implementation in order to make it show up approximately where I
	 * want it to when being created.
	 */
	_updatePosition(position) {
		if ( !this.element ) { return position };
		const el = this.element;
		let {width, height, left, top, scale} = position;
		scale ??= 1.0;
		const computedStyle = getComputedStyle(el);
		let minWidth = ApplicationV2.parseCSSDimension(computedStyle.minWidth, el.parentElement.offsetWidth) || 0;
		let maxWidth = ApplicationV2.parseCSSDimension(computedStyle.maxWidth, el.parentElement.offsetWidth) || Infinity;
		let minHeight = ApplicationV2.parseCSSDimension(computedStyle.minHeight, el.parentElement.offsetHeight) || 0;
		let maxHeight = ApplicationV2.parseCSSDimension(computedStyle.maxHeight, el.parentElement.offsetHeight) || Infinity;
		let bounds = el.getBoundingClientRect();
		const {clientWidth, clientHeight} = document.documentElement;

		// Explicit width
		const autoWidth = width === `auto`;
		if ( !autoWidth ) {
			const targetWidth = Number(width || bounds.width);
			minWidth = parseInt(minWidth) || 0;
			maxWidth = parseInt(maxWidth) || (clientWidth / scale);
			width = Math.clamp(targetWidth, minWidth, maxWidth);
		}

		// Explicit height
		const autoHeight = height === `auto`;
		if ( !autoHeight ) {
			const targetHeight = Number(height || bounds.height);
			minHeight = parseInt(minHeight) || 0;
			maxHeight = parseInt(maxHeight) || (clientHeight / scale);
			height = Math.clamp(targetHeight, minHeight, maxHeight);
		}

		// Implicit height
		if ( autoHeight ) {
			Object.assign(el.style, {width: `${width}px`, height: ``});
			bounds = el.getBoundingClientRect();
			height = bounds.height;
		}

		// Implicit width
		if ( autoWidth ) {
			Object.assign(el.style, {height: `${height}px`, width: ``});
			bounds = el.getBoundingClientRect();
			width = bounds.width;
		}

		// Left Offset
		const scaledWidth = width * scale;
		const targetLeft = left ?? (this.popover.x - Math.floor( scaledWidth / 2 ));
		const maxLeft = Math.max(clientWidth - scaledWidth, 0);
		left = Math.clamp(targetLeft, 0, maxLeft);

		// Top Offset
		const scaledHeight = height * scale;
		const targetTop = top ?? (this.popover.y - scaledHeight);
		const maxTop = Math.max(clientHeight - scaledHeight, 0);
		top = Math.clamp(targetTop, 0, maxTop);

		// Scale
		scale ??= 1.0;
		return {
			width: autoWidth ? `auto` : width,
			height: autoHeight ? `auto` : height,
			left,
			top,
			scale,
		};
	}

	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
	};
	// #endregion

	// #region Actions
	// #endregion
};

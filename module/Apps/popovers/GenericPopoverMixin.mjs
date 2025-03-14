const { ApplicationV2 } = foundry.applications.api;

export function GenericPopoverMixin(HandlebarsApp) {
	class GenericRipCryptPopover extends HandlebarsApp {
		static DEFAULT_OPTIONS = {
			classes: [
				`popover`,
			],
			window: {
				frame: false,
				positioned: true,
				resizable: false,
				minimizable: false,
			},
			actions: {},
		};

		popover = {};
		constructor({ popover, ...options}) {

			// For when the caller doesn't provide anything, we want this to behave
			// like a normal Application instance.
			popover.framed ??= true;
			popover.locked ??= true;

			if (popover.framed) {
				options.window.frame = true;
				options.window.minimizable = true;
			};

			super(options);

			this.popover = popover;
		};

		async close(options = {}) {
			if (!this.popover.framed) {
				options.animate ??= false;
			};
			return super.close(options);
		};

		/**
		 * @override
		 * Custom implementation in order to make it show up approximately where I
		 * want it to when being created.
		 *
		 * Most of this implementation is identical to the ApplicationV2
		 * implementation, the biggest difference is how targetLeft and targetRight
		 * are calculated.
		 */
		_updatePosition(position) {
			if (!this.element) { return position };
			if (this.popover.framed) { return position }

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
		};
	};
	return GenericRipCryptPopover;
};

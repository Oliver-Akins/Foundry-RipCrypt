import { getTooltipDelay } from "../consts.mjs";
import { Logger } from "./Logger.mjs";

export class PopoverEventManager {
	#options;

	/**
	 * @param {HTMLElement} element The element to attach the listeners to.
	 * @param {GenericPopoverMixin} popoverClass The class reference that represents the popover app
	 */
	constructor(element, popoverClass, options = {}) {
		options.locked ??= false;
		options.lockable ??= true;

		this.#options = options;
		this.#element = element;
		this.#class = popoverClass;

		element.addEventListener(`pointerenter`, this.#pointerEnterHandler.bind(this));
		element.addEventListener(`pointerout`, this.#pointerOutHandler.bind(this));
		element.addEventListener(`click`, this.#clickHandler.bind(this));

		if (options.lockable) {
			element.addEventListener(`pointerup`, this.#pointerUpHandler.bind(this));
		};
	};

	destroy() {
		this.close();
		this.#element.removeEventListener(`pointerenter`, this.#pointerEnterHandler);
		this.#element.removeEventListener(`pointerout`, this.#pointerOutHandler);
		this.#element.removeEventListener(`click`, this.#clickHandler);
		if (this.#options.lockable) {
			this.#element.removeEventListener(`pointerup`, this.#pointerUpHandler);
		};
		this.stopOpen();
		this.stopClose();
	};

	close() {
		this.#frameless?.close({ force: true });
		this.#framed?.close({ force: true });
	};

	stopOpen() {
		if (this.#openTimeout != null) {
			clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		};
	};

	stopClose() {
		if (this.#closeTimeout != null) {
			clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	};

	#element;
	#class;
	#openTimeout = null;
	#closeTimeout = null;

	#frameless;
	#framed;

	#clickHandler() {
		// Cleanup for the frameless lifecycle
		this.stopOpen();
		this.#frameless?.close({ force: true });

		if (!this.#framed) {
			const app = new this.#class({ popover: { ...this.#options, framed: true } });
			this.#framed = app;
		}
		this.#framed.render({ force: true });
	};

	#pointerEnterHandler(event) {
		this.stopClose();

		const pos = event.target.getBoundingClientRect();
		const x = pos.x + Math.floor(pos.width / 2);
		const y = pos.y;

		this.#openTimeout = setTimeout(
			() => {
				this.#openTimeout = null;

				// When we have the framed version rendered, we might as well just focus
				// it instead of rendering a new application
				if (this.#framed?.rendered) {
					this.#framed.bringToFront();
					return;
				};

				if (this.#frameless?.rendered) {
					const { width, height } = this.#frameless.position;
					this.#frameless.render({ position: { left: x - Math.floor(width / 2), top: y - height }});
					return;
				}

				this.#frameless = new this.#class({
					popover: {
						...this.#options,
						framed: false,
						x, y,
					},
				});
				this.#frameless.render({ force: true });
			},
			getTooltipDelay(),
		);
	};

	#pointerOutHandler() {
		this.stopOpen();

		this.#closeTimeout = setTimeout(
			() => {
				this.#closeTimeout = null;
				this.#frameless?.close();
			},
			getTooltipDelay(),
		);
	};

	#pointerUpHandler(event) {
		Logger.debug(event);
		if (event.button !== 1 || !this.#frameless?.rendered || Tour.tourInProgress) { return };
		event.preventDefault();
		this.#frameless.toggleLock();
	};
};

import { getTooltipDelay } from "../consts.mjs";
import { Logger } from "./Logger.mjs";

export class PopoverEventManager {
	#options;
	#id;

	get id() {
		return this.#id;
	};

	/** @type {Map<string, PopoverEventManager>} */
	static #existing = new Map();

	/**
	 * @param {HTMLElement} element The element to attach the listeners to.
	 * @param {GenericPopoverMixin} popoverClass The class reference that represents the popover app
	 */
	constructor(id, element, popoverClass, options = {}) {
		id = `${id}-${popoverClass.name}`;
		this.#id = id;

		if (PopoverEventManager.#existing.has(id)) {
			const manager = PopoverEventManager.#existing.get(id);
			manager.#addListeners(element);
			return manager;
		};

		options.managerId = id;
		options.locked ??= false;
		options.lockable ??= true;

		this.#options = options;
		this.#element = element;
		this.#class = popoverClass;

		this.#addListeners(element);
		PopoverEventManager.#existing.set(id, this);
	};

	/**
	 * @param {HTMLElement} element
	 */
	#addListeners(element) {
		element.addEventListener(`pointerenter`, this.#pointerEnterHandler.bind(this));
		element.addEventListener(`pointerout`, this.#pointerOutHandler.bind(this));
		element.addEventListener(`click`, this.#clickHandler.bind(this));

		if (this.#options.lockable) {
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
		this.#stopOpen();
		this.#stopClose();
	};

	close() {
		this.#frameless?.close({ force: true });
		this.#framed?.close({ force: true });
	};

	#stopOpen() {
		if (this.#openTimeout != null) {
			clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		};
	};

	#stopClose() {
		if (this.#closeTimeout != null) {
			clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	};

	get rendered() {
		return Boolean(this.#frameless?.rendered || this.#framed?.rendered);
	};

	render(options) {
		if (this.#framed?.rendered) {
			this.#framed.render(options);
		};
		if (this.#frameless?.rendered) {
			this.#frameless.render(options);
		};
	};

	#element;
	#class;
	#openTimeout = null;
	#closeTimeout = null;

	#frameless;
	#framed;

	#construct(options) {
		options.popover ??= {};
		options.popover.managerId = this.#id;

		return new this.#class(options);
	};

	#clickHandler() {
		Logger.debug(`click event handler`);
		// Cleanup for the frameless lifecycle
		this.#stopOpen();
		this.#stopClose();
		this.#frameless?.close({ force: true });

		if (!this.#framed) {
			this.#framed = this.#construct({ popover: { ...this.#options, framed: true } });
		}
		this.#framed?.render({ force: true });
	};

	#pointerEnterHandler(event) {
		this.#stopClose();

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

				// When the frameless is already rendered, we should just move it to the
				// new location instead of spawning a new one
				if (this.#frameless?.rendered) {
					const { width, height } = this.#frameless.element.getBoundingClientRect();
					const top = y - height;
					const left = x - Math.floor(width / 2);
					this.#frameless.setPosition({ left, top });
					return;
				}

				this.#frameless = this.#construct({
					popover: {
						...this.#options,
						framed: false,
						x, y,
					},
				});
				this.#frameless?.render({ force: true });
			},
			getTooltipDelay(),
		);
	};

	#pointerOutHandler() {
		this.#stopOpen();

		this.#closeTimeout = setTimeout(
			() => {
				this.#closeTimeout = null;
				this.#frameless?.close();
			},
			getTooltipDelay(),
		);
	};

	#pointerUpHandler(event) {
		if (event.button !== 1 || !this.#frameless?.rendered || Tour.tourInProgress) { return };
		event.preventDefault();
		this.#frameless.toggleLock();
	};
};

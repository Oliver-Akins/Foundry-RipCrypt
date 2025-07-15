import { StyledShadowElement } from "./mixins/StyledShadowElement.mjs";

/**
Attributes:
*/
export class RipCryptBorder extends StyledShadowElement(HTMLElement) {
	static elementName = `rc-border`;
	static formAssociated = false;

	/* Stuff for the mixin to use */
	static _stylePath = `css/components/rc-border.css`;
	#container;

	_mounted = false;
	async connectedCallback() {
		super.connectedCallback();
		if (this._mounted) { return };

		/*
		This converts all of the double-dash prefixed properties on the element to
		CSS variables so that they don't all need to be provided by doing style=""
		*/
		for (const attrVar of this.attributes) {
			if (attrVar.name?.startsWith(`var:`)) {
				const prop = attrVar.name.replace(`var:`, ``);
				this.style.setProperty(`--` + prop, attrVar.value);
			};
		};

		this.#container = document.createElement(`div`);
		this.#container.classList = `rc-border`;

		const titleContainer = document.createElement(`div`);
		titleContainer.classList = `title`;
		const titleSlot = document.createElement(`slot`);
		titleSlot.innerHTML = `No Title`;
		titleSlot.name = `title`;
		titleContainer.appendChild(titleSlot.cloneNode(true));
		this.#container.appendChild(titleContainer.cloneNode(true));

		const contentSlot = document.createElement(`slot`);
		contentSlot.name = `content`;
		this.#container.appendChild(contentSlot.cloneNode(true));

		this._shadow.appendChild(this.#container);

		this._mounted = true;
	};

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this._mounted) { return };
		this._mounted = false;
	};
};

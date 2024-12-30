import { Logger } from "../../utils/Logger.mjs";
import { RipCryptIcon } from "./Icon.mjs";

const components = [
	RipCryptIcon,
];

export function registerCustomComponents() {
	(CONFIG.CACHE ??= {}).componentListeners ??= [];
	for (const component of components) {
		if (!window.customElements.get(component.elementName)) {
			Logger.debug(`Registering component "${component.elementName}"`);
			window.customElements.define(
				component.elementName,
				component,
			);
			if (component.formAssociated) {
				CONFIG.CACHE.componentListeners.push(component.elementName);
			}
		};
	}
};

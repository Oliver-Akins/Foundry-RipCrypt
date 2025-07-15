import { Logger } from "../../utils/Logger.mjs";
import { RipCryptBorder } from "./RipCryptBorder.mjs";
import { RipCryptIcon } from "./Icon.mjs";
import { RipCryptSVGLoader } from "./svgLoader.mjs";

const components = [
	RipCryptIcon,
	RipCryptSVGLoader,
	RipCryptBorder,
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

import { RipCryptIcon } from "./Icon.mjs";

/**
Attributes:
@property {string} name - The name of the icon, takes precedence over the path
@property {string} path - The path of the icon file
*/
export class RipCryptSVGLoader extends RipCryptIcon {
	static elementName = `rc-svg`;
	static _stylePath = `css/components/svg-loader.css`;
};

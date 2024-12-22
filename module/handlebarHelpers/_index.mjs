import { handlebarsLocalizer, localizer } from "../utils/Localizer.mjs";
import { options } from "./options.mjs";

export default {
	// #region Complex
	"rc-i18n": handlebarsLocalizer,
	"rc-options": options,

	// #region Simple
	"rc-empty-state": (v) => v ?? localizer(`RipCrypt.common.empty`),
};

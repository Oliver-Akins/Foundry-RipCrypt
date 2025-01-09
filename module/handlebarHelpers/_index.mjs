import { handlebarsLocalizer, localizer } from "../utils/Localizer.mjs";
import { formFields } from "./inputs/formFields.mjs";
import { options } from "./options.mjs";

export default {
	// #region Complex
	"rc-formFields": formFields,
	"rc-i18n": handlebarsLocalizer,
	"rc-options": options,

	// #region Simple
	"rc-empty-state": (v) => v ?? localizer(`RipCrypt.common.empty`),
};

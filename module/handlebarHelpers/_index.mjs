import { handlebarsLocalizer, localizer } from "../utils/Localizer.mjs";
import { formFields } from "./inputs/formFields.mjs";
import { options } from "./options.mjs";
import { toAttributes } from "./toAttributes.mjs";
import { toClasses } from "./toClasses.mjs";

export default {
	// #region Complex
	"rc-formFields": formFields,
	"rc-i18n": handlebarsLocalizer,
	"rc-options": options,
	"rc-toAttributes": toAttributes,
	"rc-toClasses": toClasses,

	// #region Simple
	"rc-empty-state": (v) => v ?? localizer(`RipCrypt.common.empty`),
};

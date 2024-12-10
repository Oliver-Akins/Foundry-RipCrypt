import { Logger } from "../utils/Logger.mjs";

Hooks.once(`ready`, () => {
	Logger.log(`Ready`);
});

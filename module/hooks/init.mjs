import { Logger } from "../utils/Logger.mjs";

Hooks.once(`init`, () => {
	Logger.log(`Initializing`);
});

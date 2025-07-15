import { ArmourData } from "./Armour.mjs";
import { Logger } from "../../utils/Logger.mjs";

export class ShieldData extends ArmourData {
	_canEquip() {
		const parent = this.parent;
		if (!parent.isEmbedded || !(parent.parent instanceof Actor)) {
			Logger.error(`Unable to equip item when it's not embedded`);
			return false;
		};

		const shield = parent.parent.system.equippedShield;
		if (shield) {
			Logger.error(`Unable to equip multiple shields`);
			return false;
		};
		return true;
	};
};

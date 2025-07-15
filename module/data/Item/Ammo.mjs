import { CommonItemData } from "./Common.mjs";
import { gameTerms } from "../../gameTerms.mjs";

export class AmmoData extends CommonItemData {
	// MARK: Base Data
	prepareBaseData() {
		super.prepareBaseData();
	};

	// MARK: Derived Data
	prepareDerivedData() {
		super.prepareDerivedData();
	};

	// #region Getters
	// #endregion

	// #region Sheet Data
	getFormFields(_ctx) {
		const fields = [
			{
				id: `quantity`,
				type: `integer`,
				label: `RipCrypt.common.quantity`,
				path: `system.quantity`,
				value: this.quantity,
				min: 0,
			},
			{
				id: `access`,
				type: `dropdown`,
				label: `RipCrypt.common.access`,
				path: `system.access`,
				value: this.access,
				limited: false,
				options: [
					{
						label: `RipCrypt.common.empty`,
						value: ``,
					},
					...gameTerms.Access.map(opt => ({
						label: `RipCrypt.common.accessLevels.${opt}`,
						value: opt,
					})),
				],
			},
			{
				id: `cost`,
				type: `cost`,
				label: `RipCrypt.common.cost`,
				gold: this.cost.gold,
				silver: this.cost.silver,
				copper: this.cost.copper,
			},
		];
		return fields;
	};
	// #endregion
};

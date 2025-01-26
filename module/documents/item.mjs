export class RipCryptItem extends Item {
	get quantifiedName() {
		if (this.system.quantity != null && this.system.quantity !== 1) {
			return `${this.name} (${this.system.quantity})`;
		}
		return this.name;
	};
};

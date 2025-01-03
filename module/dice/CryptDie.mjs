const { Die } = foundry.dice.terms;

export class CryptDie extends Die {
	static get MODIFIERS() {
		return {
			...super.MODIFIERS,
			"rc": `ripOrCrypt`,
		};
	};

	ripCryptState = undefined;
	async ripOrCrypt(modifier) {

		const rgx = /rc([0-9]+)/i;
		const match = modifier.match(rgx);
		if (!match) { return false };
		let [ target ] = match.slice(1);

		/*
		Handle "Ripping" rolls, which is equivalent to re-rolling 8's and counting
		it as a success.
		*/
		await this.explode(`x=8`, { recursive: true });
		if(this.results.some(result => result.exploded)) {
			this.ripCryptState = `ripping`;
		};

		/*
		Handles "Crypting" rolls, which is a single explosion that allows
		*/
		if (!this.ripCryptState) {
			await this.explode(`xo=1`, { recursive: false });

			let almostCrypted = false;
			for (const result of this.results) {
				if (result.result !== 1) { continue };
				if (almostCrypted) {
					this.ripCryptState = `crypted`;
					break;
				} else {
					almostCrypted = true;
				}
			}
		};

		// Count successes
		await this.countSuccess(`cs>=${target}`);
	};

	get total() {
		return Math.max(super.total, 0);
	};
};

import { filePath } from "../../consts.mjs";

export class CryptRollMessage extends ChatMessage {
	static get template() {
		switch (this.type) {
			case `roll`:
				return filePath(`templates/chat/roll.hbs`);
		}
		return super.template;
	};
};

/**
 * Allows converting an object of <attribute names, value> into HTML
 * attribute-value pairs that can be inserted into the DOM
 *
 * @param {Record<string, any>} obj The object of attributes to their value
 */
export function toAttributes(obj = {}) {
	let attributes = [];
	for (const [ attr, value] of Object.entries(obj)) {
		attributes.push(`${attr}=${Handlebars.escapeExpression(value)}`);
	};
	return new Handlebars.SafeString(attributes.join(` `));
};

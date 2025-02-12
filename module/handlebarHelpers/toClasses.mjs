/**
 * Allows converting an object of <class names, boolean-likes> into an HTML-compatible class list.
 *
 * @param {Record<string, any>} obj The object of class names to boolean-like values for if that class should be included.
 */
export function toClasses(obj = {}) {
	let classes = [];
	for (const [ klass, include ] of Object.entries(obj)) {
		if (include) {
			classes.push(klass);
		};
	};
	return new Handlebars.SafeString(classes.join(` `));
};

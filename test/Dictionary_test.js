var Dictionary = require('../lib/Dictionary').Dictionary,
	dictionary = require('./dictionary.json');

module.exports.Dictionary = {
	'empty/no dictionary': function(test) {
		test.expect(1);

		var d = new Dictionary().compile();
		test.equal(JSON.stringify(d.getAll()), '{}', 'should be an empty object.');
		test.done();
	},

	'valid dictionary - single locale': function(test) {
		test.expect(3);

		var d = new Dictionary( dictionary ).compile(),
			it = d.getLocale('it').term.message,
			en = d.getLocale('en').term.message;

		test.equal(it, 'Localizzato in Italiano', 'should returns the Italian localization for `term`.' );
		test.equal(en, 'Localized in English', 'should returns the English localization for `term`.');
		test.equal(JSON.stringify(d.getLocale('uk')), '{}', 'should returns an empty object.');
		test.done();
	}
};

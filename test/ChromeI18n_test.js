var _ = require('lodash'),
	ChromeI18n = require('../lib/ChromeI18n').ChromeI18n,
	Dictionary = require('../lib/Dictionary').Dictionary,
	dictionary = require('./dictionary.json'),
	pkg = require('../package');

exports.ChromeI18n = {
	setUp: function(done) {
		this.i18n = new ChromeI18n( dictionary, './test/results', Dictionary );
		this.generateTests = {
			it: { expect: require('./expected/it_messages.json'), result: null },
			en: { expect: require('./expected/en_messages.json'), result: null }
		};
		done();
	},

	'help': function(test) {
		var banner = '\n<%= name %> - v<%= version %>\n' +
				'<%= description %>\n' +
				'Copyright (c) <%= (new Date()).getFullYear() %> ' +
				'<%= author.name %> - <%= author.url %> (<%= author.email %>)\n' +
				'Released under a MIT License\n\n' +
				'<%= name %> <path/to/dictionary.json> [path/to/_locales]\n\n' +
				'If path to `_locales` directory isn\'t specified, current directory is used by default.\n' +
				'WARNING: existent files will be overwritten!\n\n';

		test.expect(1);

		test.equal( ChromeI18n.help( pkg ), _(banner).template( pkg ), 'should be the same copyright message.' );
		test.done();
	},

	'generate single locale': function(test){
		var gt = this.generateTests;

		test.expect(2);

		this.i18n.writeLocale( 'it' );
		gt.it.result = require('./results/it/messages.json');
		this.i18n.writeLocale( 'en' );
		gt.en.result = require('./results/en/messages.json');

		test.equal( JSON.stringify( gt.it.result ), JSON.stringify( gt.it.expect ), 'should be the same content.' );
		test.equal( JSON.stringify( gt.en.result ), JSON.stringify( gt.en.expect ), 'should be the same content.' );
		test.done();
	},

	'generate complete database': function(test) {
		var gt = this.generateTests;

		test.expect(2);

		this.i18n.writeAll();
		gt.it.result = require('./results/it/messages.json');
		gt.en.result = require('./results/en/messages.json');

		test.equal( JSON.stringify( gt.it.result ), JSON.stringify( gt.it.expect ), 'should be the same content.' );
		test.equal( JSON.stringify( gt.en.result ), JSON.stringify( gt.en.expect ), 'should be the same content.' );
		test.done();
	}
};

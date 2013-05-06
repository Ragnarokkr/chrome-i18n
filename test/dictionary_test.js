'use strict';

var Dictionary = require( '../lib/Dictionary.js' ).Dictionary,
	dictionary = require( './fixtures/dictionary.json' );

exports['Dictionary Test'] = {
	setUp: function( callback ){
		this.dict = new Dictionary();
		this.dict.dictionary = dictionary;
		callback();
	},

	tearDown: function( callback ){
		this.dict = new Dictionary();
		this.dict.dictionary = dictionary;
		callback();
	},

	'test definition': function( test ){
		test.expect( 1 );
		test.strictEqual( typeof Dictionary, 'function', 'it should returns a `function`' );
		test.done();
	},

	'verify members': {
		'dictionary': function( test ){
			test.expect( 1 );
			test.strictEqual( typeof this.dict.dictionary, 'object', 'it should returns an object' );
			test.done();
		},
		'compile()': function( test ){
			test.expect( 1 );
			test.strictEqual( typeof this.dict.compile, 'function', 'it should returns a `function`' );
			test.done();
		},
		'getAll()': function( test ){
			test.expect( 1 );
			test.strictEqual( typeof this.dict.getAll, 'function', 'it should returns a `function`' );
			test.done();
		},
		'getLocale': function( test ){
			test.expect( 1 );
			test.strictEqual( typeof this.dict.getLocale, 'function', 'it should returns a `function' );
			test.done();
		}
	},

	'verify monolith mode': {
		'italian locale': function( test ){
			test.expect( 1 );

			var msg = this.dict.compile().getLocale( 'it' ).term.message,
				expected = 'Localizzato in Italiano';

			test.strictEqual( msg, expected, 'it should returns "' + expected + '"') ;
			test.done();
		},
		'english locale': function( test ){
			test.expect( 1 );

			var msg = this.dict.compile().getLocale( 'en' ).term.message,
				expected = 'Localized in English';

			test.strictEqual( msg, expected, 'it should returns "' + expected + '"' );
			test.done();
		}
	},

	'verify failures': {
		'unknown locale': function( test ){
			test.expect( 1 );

			var locale = this.dict.compile().getLocale( 'uk' ),
				expected = '{}';

			test.strictEqual( JSON.stringify( locale ), expected, 'it should returns an empty object `{}`' );
			test.done();
		}
	}
};

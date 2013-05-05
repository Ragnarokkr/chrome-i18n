// language-parser.js
// http:/github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

'use strict';

var //fs = require( 'fs' ),
	path = require( 'path' ),
	commons = require( '../lib/commons' );

function rebuildDatabase( meta, errBuf ){
	var db = {};

	// fills the `db` object with all the meta definitions
	Object.keys( meta.definitions ).forEach( function( termKey ){
		db[ termKey ] = meta.definitions[ termKey ];
		db[ termKey ].locales = {};
	});

	// completes the `db` with translations from each language file
	meta.locales.forEach( function( lang ){
		try {
			var file = require( path.join( meta.imports, lang + '.json' ) );

			Object.keys( db ).forEach( function( termKey ){
				if ( file.hasOwnProperty( termKey ) ) {
					db[ termKey ].locales[ lang ] = file[ termKey ];
				} else {
					db[ termKey ].locales[ lang ] = "!-- PLACEHOLDER ADDED BY CHROME-I18N --!";
					errBuf.push( 'Warning (locales): "' + lang + '" version of "' +
								termKey + '" is not defined' );
				} // if..else
			});
		} catch ( e ) {
			errBuf.push( 'Warning (imports): unable to load or parse "' +
						file + '"' );
		} // try..catch
	});

	return db;
} // rebuildDatabase()

function parse( source, errBuf ) {
	commons.resolveRelatives( source );
	return {
		meta: source,
		database: rebuildDatabase( source, errBuf )
	};
} // parse()

// Exposes functions
exports.parse = parse;

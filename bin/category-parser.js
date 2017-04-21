// category-parser.js
// http:/github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

'use strict';

var fs = require( 'fs' ),
	commons = require( '../lib/commons' );

function rebuildDatabase( meta, errBuf ){
	var db = {};

	meta.imports.forEach( function( partial ){
		try {
			var file = JSON.parse( fs.readFileSync( partial, 'utf8' ) );
			Object.keys( file ).forEach( function( termKey ){
				var term = file[ termKey ];
				var locales = term.locales || term;
				var appendedLocales = {};
				meta.locales.forEach( function( lang ){
					if ( !locales.hasOwnProperty( lang ) ) {
						var placeholderString = '!-- PLACEHOLDER ADDED BY CHROME-I18N --!';
						var fallback_lang = meta.fallback_locale;
						if ( !!fallback_lang && lang !== fallback_lang ) {
							if ( locales.hasOwnProperty( fallback_lang ) ) {
								appendedLocales[ lang ] = locales[ fallback_lang ];
							} else {
								appendedLocales[ lang ] = placeholderString;
								errBuf.push( 'Warning (locales): "' + lang +
									'" and fallback lang "' + fallback_lang +
									'" version for "' + termKey +
									'" is not defined' );
							}
						} else {
							appendedLocales[ lang ] = placeholderString;
							errBuf.push( 'Warning (locales): "' + lang +
								'" version for "' + termKey +
								'" is not defined' );
						}
					} // if
				});
				for (var appendedLang in appendedLocales) {
					locales[ appendedLang ] = appendedLocales[ appendedLang ];
				}
				db[ termKey ] = term;
			});
		} catch( e ) {
			errBuf.push( 'Warning (imports): unable to load or parse "' + partial + '"' );
		} // try..catch
	});

	return db;
} // rebuildDatabase()

function parse( source, errBuf, entryLocation ) {
	commons.resolveRelatives( source, entryLocation );
	return {
		meta: source,
		database: rebuildDatabase( source, errBuf )
	};
} // parse()

// Exposes functions
exports.parse = parse;

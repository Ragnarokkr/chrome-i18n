// Dictionary.js
// https://github.com/Ragnarokkr/chrome-i18n
//
// Copyright(c) 2012-2013 Marco Trulla
// Licensed under the MIT license.

/**
 * This class builds the final database starting from the passed
 * dictionary.
 *
 * @return {object} returns itself to support the chaining
 */
function Dictionary() {
	'use strict';

	// This will hold all the single generated locales
	this.locales = {};
	return this;
} // Dictionary()

Dictionary.prototype = Object.defineProperties( {},
	/** @lends Dictionary */ {
	constructor: { value: Dictionary },

	/**
	 * Sets or retrieves the dictionary to work on.
	 *
	 * @param {(string|JSON)} [dict] it will accept a stringified or raw
	 * JSON object.
	 * @return {JSON} always a valid JSON object.
	 */
	dictionary: {
		get: function(){
			'use strict';
			return this.dict;
		},
		set: function( dict ){
			'use strict';

			if ( typeof dict === 'string' ) {
				this.dict = JSON.parse( dict );
				return;
			} // if

			if ( typeof dict === 'object' ) {
				// since there's no way to easily test if an object is also a
				// valid JSON object, the value passed is stringified and
				// parsed to sanitize the object.
				var sanitized = JSON.stringify( dict );
				this.dict = JSON.parse( sanitized );
				return;
			} // if

			// any other data type will raise an exception
			throw new TypeError( 'It was expected a string or raw JSON object' );
		}
	}, // dictionary

	/**
	 * Compiles the dictionary into a new object which can be retrieved
	 * with `getAll()` and `getLocale()` methods.
	 *
	 * @return {object} a reference to itself to support chaining.
	 */
	compile: {
		value: function(){
			'use strict';

			if ( this.dict && this.dict.meta && this.dict.database ) {
				var locales = this.dict.meta.locales,
					database = this.dict.database,
					db = {};

				// this generates each sub-object which will hold the
				// related language translation.
				locales.forEach( function( lang ){
					db[ lang ] = {};
				});

				// this populates each previously generated sub-object
				Object.keys( database ).forEach( function( termKey ){
					var term = database[ termKey ];

					Object.keys( db ).forEach( function( langKey ){
						var lang = db[ langKey ],
							// this simulates a tuple
							row = lang[ termKey ] = {};

						row.message = term.locales[ langKey ];
						if ( term.hasOwnProperty( 'description' ) ) {
							row.description = term.description;
						} // if
						if ( term.hasOwnProperty( 'placeholders' ) ) {
							row.placeholders = term.placeholders;
						} // if
					});
				});

				this.locales = db;
			} // if

			return this;
		} // compile()
	},

	/**
	 * Retrieves all the generated locales as a big unique object.
	 *
	 * @return {object} the generated object containing all the locales.
	 */
	getAll: {
		value: function(){
			'use strict';
			return this.locales;
		}
	}, // getAll()

	/**
	 * Retrieves the required locale or an empty object.
	 *
	 * @param {string} locale the required locale as specified into the
	 * database.
	 *
	 * @return {object} the object with the locale's definitions or an
	 * empty object.
	 */
	getLocale: {
		value: function( locale ){
			'use strict';

			if ( typeof locale === 'string' && this.locales.hasOwnProperty( locale ) ) {
				return this.locales[ locale ];
			} // if

			// it never returns a null value. when no locale is present just
			// returns an emoty object.
			return {};
		}
	} // getLocale()
});

exports.Dictionary = Dictionary;

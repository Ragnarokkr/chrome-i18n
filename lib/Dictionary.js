/*jshint globalstrict:true */
/*global exports:true, require:true */

/*
 * Dictionary.js
 * https://github.com/Ragnarokkr/chrome-i18n
 *
 * Copyright (c) 2012 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

/**
 * Dictionary class
 *
 * @class Return a Dictionary object with all the methods required to
 *        manage and compile a JSON dictionary.
 * @param {JSON} [dict] the dictionary in JSON format
 * @return {Dictionary} the object itself for chaining.
 */
function Dictionary( JSONDict ){
  this.dict = JSONDict || {};
  this.locales = {};
  return this;
}

Dictionary.prototype = Object.defineProperties({}, {
  constructor: { value: Dictionary },

  // Set or get the dictionary to work on.
  // It's possibile to assign either a stringified or raw JSON object.
  dictionary: {
    get: function(){ return this.dict; },
    set: function( dict ){
      if ( _(dict).isString() ) {
        this.dict = JSON.parse( dict );
      } else if ( _(dict).isObject() ) {
        this.dict = dict;
      }
    }
  },

  // Compiles the dictionary into a hash of locales which they can be
  // retrieved via `getAll()` and `getLocale()` methods.
  // This method always returns the Dictionary object for chaining.
  compile: {
    value: function(){
      if ( !_(this.dict).isEmpty() ) {
        this.locales = compileDictionary( this.dict );
      }
      return this;
    }
  },

  // Returns all the generated locales as a hash of locales.
  getAll: { value: function(){ return this.locales; } },

  // Returns the required locale (if present) or an empty object.
  getLocale: {
    value: function( locale ){
      if ( _(locale).isString && _(this.locales).has( locale ) ) {
        return this.locales[locale];
      }
      // Never returns a null value. If no locale is present, just returns
      // an empty object.
      return {};
    }
  },

  toJSON: { value: function(){ return this.locales; } }
});

// Compiles the dictionary into a hash of locales.
// See docs for further informations about the dictionary structure.
function compileDictionary( dict ){
  var database = {};

  dict.meta.locales.forEach( function( element ){
    database[ element ] = {};
  });

  _(dict.database).forEach( function( term, termKey ){
    _(database).forEach( function( lang, langKey ){
      // simulates a temporary database record by using `row` variable
      var row = lang[termKey] = {};
      row.message = term.locales[ langKey ];
      if ( _(term).has( 'description' ) ) {
        row.description = term.description;
      } // if
      if ( _(term).has( 'placeholders' ) ) {
        row.placeholders = term.placeholders;
      } // if
    });
  });

  return database;
} // compileDictionary()

exports.Dictionary = Dictionary;
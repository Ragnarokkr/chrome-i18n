/*jshint globalstrict:true */
/*global exports:true, require:true */

/*
 * ChromeI18n.js
 * https://github.com/Ragnarokkr/chrome-i18n
 *
 * Copyright (c) 2012 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    pd = require('pretty-data').pd,
    _ = require('lodash');

/**
 * Main class
 * @class The main class used by the command line tool
 * @param {string|JSON} inDict  JSON dictionary
 * @param {string} outLocales destination path
 */
function ChromeI18n( inDict, outLocales, Dictionary ){
  // if a string is passed, it will be parsed by JSON;
  // if a JSON object is passed, no processing is performed.
  if ( _(inDict).isString() ) {
    this.input = JSON.parse( inDict );
  } else if ( _(inDict).isObject() ) {
    this.input = inDict;
  } // if

  // the path is normalized before to be used by the methods
  this.output = _(outLocales).isString() ? path.normalize( outLocales ) : '.';

  this.dict = new Dictionary( this.input ).compile();

  return this;
} // ChromeI18n()

ChromeI18n.prototype = Object.defineProperties({}, {
  constructor: { value: ChromeI18n },

  // Creates the directory and writes the `messages.json` file for a specific
  // language.
  writeLocale: {
    value: function( localeID ){
      var locale = this.dict.getLocale( localeID );

      // if the locale is available
      if ( !_(locale).isEmpty() ) {
        var localePath = path.join( this.output, localeID );
        // checks whether the directory exists or creates it
        if ( !fs.existsSync( localePath ) ) {
          fs.mkdirSync( localePath );
        } // if
        // then writes data
        fs.writeFileSync( path.join( localePath, 'messages.json' ), pd.json( locale ) );
      } // if

      return this;
    }
  },

  // Creates the whole locales database by generating every single `messages.json`
  // file for each supported language.
  writeAll: {
    value: function(){
      var locales = _(this.dict.getAll()).keys();
      _(locales).forEach( function( locale ){
        this.writeLocale( locale );
      }, this);

      return this;
    }
  }
});

/**
 * This static method returns the help text from a parsed template.
 * @static
 * @param  {object} bannerParams object with the banner's parameters
 * @return {string}              the processed banner string
 */
ChromeI18n.help = function( bannerParams ){
  var banner = '\n<%= name %> - v<%= version %>\n' +
        '<%= description %>\n' +
        'Copyright (c) <%= (new Date()).getFullYear() %> ' +
        '<%= author.name %> - <%= author.url %> (<%= author.email %>)\n' +
        'Released under a MIT License\n\n' +
        '<%= name %> <path/to/dictionary.json> [path/to/_locales]\n\n' +
        'If path to `_locales` directory isn\'t specified, current directory is used by default.\n' +
        'WARNING: existent files will be overwritten!\n\n';
  return _(banner).template( bannerParams );
};

exports.ChromeI18n = ChromeI18n;
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

  meta.imports.forEach( function( imported ){
    imported.forEach( function( partial ){
      try {
        var file = JSON.parse( fs.readFileSync( partial, 'utf8' ) );
        Object.keys( file ).forEach( function( termKey ){
          var term = file[ termKey ];
          meta.locales.forEach( function( lang ){
            if ( !term.locales.hasOwnProperty( lang ) ) {
              term.locales[ lang ] = '!-- PLACEHOLDER ADDED BY CHROME-I18N --!';
              errBuf.push( 'Warning (locales): "' + lang +
                          '" version for "' + termKey +
                          '" is not defined' );
            } // if
          });
          db[ termKey ] = term;
        });
      } catch( e ) {
        errBuf.push( 'Warning (imports): unable to load or parse "' +
                    partial + '"' );
      } // try..catch
    });
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

// commons.js
// http:/github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

// Provides commons functions used by project's modules.

'use strict';

var // Load required modules
    path = require( 'path' ),
    glob = require( 'glob' );

/**
 * Checks the integrity of the META descriptor.
 *
 * The locales codes are compared to those supported by the Chrome
 * Store (https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable),
 * so any unsupported locale code will invalidate the field.
 *
 * @param {object} meta a valid JSON object
 * @param {array} errBuf buffer for generated errors
 * @return {boolean} `true` if members are available
 */
function validateMeta( meta, errBuf ) {
  var supportedLocales =
        'ar,am,bg,bn,ca,cs,da,de,el,en,en_GB,en_US,es,es_419,et,' +
        'fa,fi,fil,fr,gu,he,hi,hr,hu,id,it,ja,kn,ko,lt,lv,ml,mr,' +
        'ms,nl,no,pl,pt_BR,pt_PT,ro,ru,sk,sl,sr,sv,sw,ta,te,th,' +
        'tr,uk,vi,zh_CN,zh_TW'.split(','),
      isFormatValid = true,
      isImportsValid = true,
      isDestValid = true,
      isLocalesValid = true,
      isDefintionsValid = true;

  // `format` MUST BE a string of value: monolith|category|language
  if ( typeof meta.format !== 'string' ) {
    errBuf.push(
      'Error (META): `format` field is not defined or in wrong format'
    );
    isFormatValid = false;
  } else {
    if ( !/^(monolith|category|language)$/.test( meta.format ) ) {
      errBuf.push(
        'Error (META): "' + meta.format +
        '" value in `format` field not supported'
      );
      isFormatValid = false;
    } // if
  } // if..else

  // `imports` MUST BE defined if `format` is != monolith
  if ( isFormatValid ) {
    if ( meta.format === 'category' ) {
      if ( typeof meta.imports !== 'string' && !Array.isArray( meta.imports ) ) {
        errBuf.push(
          'Error (META): when in "category" mode, `imports` field can' +
          ' be either a string or an array'
        );
        isImportsValid = false;
      } // if
    } else {
      if ( meta.format === 'language' ) {
        if ( typeof meta.imports !== 'string' ) {
          errBuf.push(
            'Error (META): when in "language" mode, `imports` field' +
            ' can be only a string pointing to a directory'
          );
          isImportsValid = false;
        } else {
          if ( meta.imports.lastIndexOf( path.sep ) !== meta.imports.length-1 ) {
            errBuf.push( 'Error: (META): `imports` field is not a directory' );
            isImportsValid = false;
          } // if
        } // if
      } // if
    } // if..else
  } // if

  // `dest` MUST BE ALWAYS defined as string pointing to a directory
  if ( typeof meta.dest !== 'string' ) {
    errBuf.push( 'Error (META): `dest` field MUST be a string' );
    isDestValid = false;
  } else {
    if ( meta.dest.lastIndexOf( path.sep ) !== meta.dest.length-1 ) {
      errBuf.push( 'Error (META): `dest` is not a directory' );
      isDestValid = false;
    } // if
  } // if..else

  // `locales` MUST BE ALWAYS defined as array with a minimum of one
  // country code
  if ( !Array.isArray( meta.locales ) ) {
    errBuf.push( 'Error (META): `locales` field MUST be an array' );
    isLocalesValid = false;
  } else {
    meta.locales.forEach( function( locale ){
      if ( !~supportedLocales.indexOf( locale ) ) {
        errBuf.push(
          'Error (META): `locales` field\'s country-code "' +
          locale + '" is not supported'
        );
      } // if
    });
  } // if..else

  // `definitions` MUST BE ALWAYS defined as literal object when in
  // `language` mode.
  if ( meta.format === 'language' ) {
    if ( typeof meta.definitions !== 'object' ) {
      errBuf.push( 'Error (definitions): in `language` mode, ' +
                  '`definitions` field MUST be an object' );
      isDefintionsValid = false;
    } // if
  } // if

  return isFormatValid && isImportsValid && isDestValid &&
          isLocalesValid && isDefintionsValid;
} // validateMeta()

/**
 * Resolves the path or the paths specified in `imports` and `dest`
 * fields.
 *
 * @param {object} meta the META object descriptor for the project
 */
function resolveRelatives( meta ) {
  var solvers = {
        string: function( relPath ){
          // strings are always converted to array internally
          if ( /[!*?]/.test( relPath ) ) {
            // resolves for globs
            return glob.sync( path.resolve( relPath ) );
          } else {
            if ( relPath.lastIndexOf( path.sep ) === relPath.length-1 ) {
              // resolves for a path
              return glob.sync( path.resolve( relPath + '*.json' ) );
            } else {
              // resolves for a filename
              if ( path.extname( relPath ) ) {
                return glob.sync( path.resolve( relPath ) );
              } else {
                return glob.sync( path.resolve( relPath + '.json' ) );
              } // if..else
            } // if..else
          } // if..else
        },
        array: function( paths ){
          return paths.map( function( relPath ){
            return solvers.string( relPath );
          });
        }
      },
      importsType = typeof meta.imports === 'string' ? 'string' : 'array';

  if ( meta.format === 'category' ) {
    meta.imports = solvers[ importsType ]( meta.imports );
  } else {
    if ( meta.format === 'language' ) {
      meta.imports = path.resolve( meta.imports );
    } // if
  } // if..else
  meta.dest = path.resolve( meta.dest );
} // resolveRelatives()

/**
 * Outputs error messages using the specified output function.
 *
 * @param {Array.<string>} errors the buffer for error messages
 * @param {function} fnOut the output function
 */
function outputErrors( errors, fnOut ) {
  if ( Array.isArray( errors ) && typeof fnOut === 'function' ) {
    errors.forEach( function( error ){
      fnOut( error );
    });
  } // if
} // outputErrors()

// Exposes the functions
exports.validateMeta = validateMeta;
exports.resolveRelatives = resolveRelatives;
exports.outputErrors = outputErrors;

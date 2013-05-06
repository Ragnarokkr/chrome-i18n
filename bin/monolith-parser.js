// monolith-parser.js
// http:/github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

'use strict';

var commons = require( '../lib/commons' );

function parse( source ) {
	commons.resolveRelatives( source.meta );
	return source;
} // parse()

// Exposes functions
exports.parse = parse;

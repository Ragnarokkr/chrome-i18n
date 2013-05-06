#!/usr/bin/env node

/*jshint globalstrict:true */
/*global exports:false, require:false, process:false, console:false */

/*
 * chrome-i18n.js
 * https://github.com/Ragnarokkr/chrome-i18n
 *
 * Copyright (c) 2012 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
	_ = require('lodash'),
	pkg = require('../package'),

	Dictionary = require('../lib/Dictionary').Dictionary,
	ChromeI18n = require('../lib/ChromeI18n').ChromeI18n,

	args = process.argv.splice(2),
	input, output, i18n;

// Checks the parameters and find out which paths have been passed
if ( _(args).isEmpty() ) {
	console.info( ChromeI18n.help( pkg ) );
	process.exit(0);
} else if ( args.length < 2 ) {
	input = args[0];
	output = '.';
} else {
	input = args[0];
	output = args[1];
} // if

// then, builds the database
fs.exists( input, function( exists ){
	if ( exists ){
		i18n = new ChromeI18n( fs.readFileSync( input, 'utf8' ), output, Dictionary );
		i18n.writeAll();
		console.info( 'Locales database generated.' );
		process.exit(0);
	} else {
		var error = '<%= name %>: the specified dictionary "<%= dictName %>" doesn\'t exists.';
		console.error( _(error).template({ name: pkg.name, dictName: args[0] }) );
		process.exit(1);
	} // if
});

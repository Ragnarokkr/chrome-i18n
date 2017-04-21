#!/usr/bin/env node

// chrome-i18n-cli.js
// https://github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

'use strict';

var // Load required modules
	fs = require( 'fs' ),
	path = require( 'path' ),
	mkdirp = require( 'mkdirp' ),
	ArgumentParser = require( 'argparse' ).ArgumentParser,
	Dictionary = require( '../lib/Dictionary' ).Dictionary,
	commons = require( '../lib/commons' ),

	// Load external data
	pkg = require( '../package.json' ),

	// Defines commons
	argv = new ArgumentParser({
		prog: pkg.name,
		version: pkg.version,
		description: pkg.description,
		epilog: 'By default, the source file is "./dictionary.json"'
	}),
	errBuf = [];

////////////////////////////////////////////////////////////////////////

// --entry: the dictionary or meta JSON file. It must be a valid JSON
//			file (not a JS object). Since only JSON is supported, the
//			file suffix may be omitted.

argv.addArgument(
	[ '-e', '--entry' ],
	{
		defaultValue: './dictionary.json',
		type: 'string',
		help: 'Dictionary or meta file. It MUST be in valid JSON format. Suffix may be omitted.'
	}
);

argv.addArgument(
	[ '-d', '--dest' ],
	{
		type: 'string',
		help: 'The target directory for the _locales directory. ' +
			'The path must end with a trailing path separator or the field will be invalid. ' +
			'Takes precedence over dest defined in dictionary or meta file.'
	}
);

argv.addArgument(
	[ '-f', '--force' ],
	{
		action: 'storeTrue',
		help: 'Forces writing dictionary even if locales already exist in destination path.'
	}
);

////////////////////////////////////////////////////////////////////////

function parseSource( errBuf ) {
	var parsers = {
			monolith: function(){
				return require( './monolith-parser.js' );
			},
			category: function(){
				return require( './category-parser.js' );
			},
			language: function(){
				return require( './language-parser.js' );
			}
		},
		args = argv.parseArgs(),
		file = path.resolve( path.extname( args.entry ) ? args.entry : args.entry + '.json' ),
		source;

	if ( fs.existsSync( file ) ) {
		try {
			source = JSON.parse( fs.readFileSync( file, 'utf8' ) );
		} catch (e) {
			errBuf.push( 'Error (source): wrong format for "' + file + '"' );
			return false;
		} // try..catch

		// arguments dest takes precedence
		if (args.dest) {
			(source.meta || source).dest = args.dest;
		}

		if ( commons.validateMeta( source.meta || source, errBuf ) ) {
			return parsers[ (source.meta || source).format ]().parse( source, errBuf, path.dirname(file) );
		} // if
	} else {
		errBuf.push( 'Error (source): unable to open "' + file + '"' );
		return false;
	} // if..else
} // parseSource()

////////////////////////////////////////////////////////////////////////

function writeDictionary( dictionary, errBuf ) {
	var writeSuccess = true,
		args = argv.parseArgs(),
		dict = new Dictionary();

	dict.dictionary = dictionary;
	dict.compile();

	Object.keys( dict.getAll() ).forEach( function( localeID ){
		var locale = dict.getLocale( localeID ),
			localePath = path.join( dictionary.meta.dest, localeID );

		if ( !fs.existsSync( localePath ) || args.force ) {
			mkdirp.sync( localePath );
			fs.writeFileSync(
				path.join( localePath, 'messages.json' ),
				JSON.stringify( locale, null, 2 )
			);
		} else {
			errBuf.push( 'Error (dest): directory "' + localePath + '" is not empty!' );
			writeSuccess = false;
		} // if..else
	});

	return writeSuccess;
} // writeDictionary()

////////////////////////////////////////////////////////////////////////

function main() {
	var project = parseSource( errBuf );

	if ( project && writeDictionary( project, errBuf ) ) {
		console.log( 'localization database correctly built' );
	} // if

	if ( errBuf.length ) {
		commons.outputErrors( errBuf, console.error );
		process.exit( 1 );
	} // if

	process.exit( 0 );
} // main()

////////////////////////////////////////////////////////////////////////

main();

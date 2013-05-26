// chrome-i18n-cli.js
// https://github.com/Ragnarokkr/chrome-i18n
//
// Copyright (c) 2012-2013 Marco Trulla <marco@marcotrulla.it>
// Licensed under the MIT license.

'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Meta
		pkg: grunt.file.readJSON( 'package.json' ),
		meta: {
			src: {
				doc: './src-doc',
				mandoc: './src-doc/mandoc'
			},
			dest: {
				doc: './doc',
				mandoc: './man'
			},
			test: './test'
		},

		// Before deploying, bump the version number.
		bump: {
			options: {
				part: 'patch',
				hardTab: true
			},
			files: [ 'package.json' ]
		},

		// Remove all test and temporaneous files.
		clean: {
			doc: [
				'<%= meta.dest.mandoc %>',
				'<%= meta.dest.doc %>'
			]
		},

		// Compile all the docuemntation.
		sildoc: {
			options: {
				meta: '<%= pkg %>',
				index: 'gfm'
			},
			readme: {
				options: {
					data: grunt.file.readJSON( '.sildocrc' ),
					template: '<%= meta.src.doc %>/readme/readme.md.jst'
				},
				src: '<%= meta.src.doc %>/readme/_*.md.jst',
				dest: './README.md'
			},
			monolith: {
				options: {
					template: '<%= meta.src.doc %>/modes/monolith/monolith.md.jst'
				},
				src: [
					'<%= meta.src.doc %>/modes/monolith/_*.md.jst',
					'<%= meta.src.doc %>/modes/_*.md.jst'
				],
				dest: '<%= meta.dest.doc %>/monolith.md'
			},
			category: {
				options: {
					template: '<%= meta.src.doc %>/modes/category/category.md.jst'
				},
				src: [
					'<%= meta.src.doc %>/modes/category/_*.md.jst',
					'<%= meta.src.doc %>/modes/_*.md.jst'
				],
				dest: '<%= meta.dest.doc %>/category.md'
			},
			language: {
				options: {
					template: '<%= meta.src.doc %>/modes/language/language.md.jst'
				},
				src: [
					'<%= meta.src.doc %>/modes/language/_*.md.jst',
					'<%= meta.src.doc %>/modes/_*.md.jst'
				],
				dest: '<%= meta.dest.doc %>/language.md'
			},
			mandoc: {
				options: {
					index: 'none',
					template: '<%= meta.src.mandoc %>/mandoc.roff.jst'
				},
				src: '<%= meta.src.mandoc %>/_*.roff.jst',
				dest: '<%= meta.dest.mandoc %>/chrome-i18n.1'
			}
		},

		// Check for the sources correctness.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			bin: {
				src: ['bin/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},

		// Test the code for errors.
		nodeunit: {
			files: ['<%= meta.test %>/**/*_test.js'],
		},

		// Start to watch for changes in files
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			bin: {
				files: '<%= jshint.bin.src %>',
				tasks: ['jshint:bin', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			},
			doc: {
				files: [
					'<%= sildoc.readme.src %>',
					'<%= sildoc.monolith.src %>',
					'<%= sildoc.language.src %>',
					'<%= sildoc.category.src %>',
					'<%= sildoc.mandoc.src %>'
				],
				tasks: ['sildoc']
			}
		},
	});

	// Grunt-Contrib Tasks
	Object.keys( grunt.config('pkg').devDependencies ).forEach( function( dep ){
		if ( /^grunt\-/i.test( dep ) ) {
			grunt.loadNpmTasks( dep );
		} // if
	});

	// Default task.
	grunt.registerTask('default', ['jshint', 'nodeunit']);

	// Documentation generator task.
	grunt.registerTask('doc', ['clean', 'sildoc']);

};

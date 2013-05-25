'use strict';

module.exports = function( grunt ) {

	var path = require( 'path' ),
		_ = grunt.util._;

	// Project configuration.
	grunt.initConfig({
		// Package configuration
		pkg: grunt.file.readJSON( 'package.json' ),
		// Meta configuration
		meta: {
			src: {
				doc: './src-doc',
				mandoc: './src-doc/mandoc'
			},
			dest: {
				doc: './doc',
				mandoc: './man',
				markdown: './md'
			},
			test: './test'
		},
		// Tasks configuration
		bump: {
			options: {
				part: 'patch',
				hardTab: true
			},
			files: [ 'package.json' ]
		},
		clean: {
			markdown: [
				'<%= meta.dest.markdown %>',
				'<%= meta.dest.mandoc %>',
				'<%= meta.dest.doc %>'
			]
		},
		compdoc: {
			options: {
				compdocrc: '.compdoc',
				index: true
			},
			readme: {
				options: {
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
					index: false,
					template: '<%= meta.src.mandoc %>/mandoc.roff.jst'
				},
				src: '<%= meta.src.mandoc %>/_*.roff.jst',
				dest: '<%= meta.dest.mandoc %>/chrome-i18n.1'
			}
		},
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
		markdown: {
			options: {
				gfm: true,
				highlight: 'manual'
			},
			info: {
				template: '<%= meta.src.doc %>/md-gfm-test.html.jst',
				dest: '<%= meta.dest.markdown %>/',
				files: [ './*.md' ]
			},
			doc: {
				template: '<%= meta.src.doc %>/md-gfm-test.html.jst',
				dest: '<%= meta.dest.markdown %>/',
				files: [ '<%= meta.dest.doc %>/*.md' ]
			}
		},
		nodeunit: {
			files: ['<%= meta.test %>/**/*_test.js'],
		},
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
			markdown: {
				files: ['<%= markdown.info.files %>','<%= markdown.doc.files %>'],
				tasks: ['markdown']
			}
		},
	});

	// Grunt-Contrib Tasks
	Object.keys( grunt.config('pkg').devDependencies ).forEach( function(dep){
		if (/^grunt\-/i.test(dep)) {
			grunt.loadNpmTasks( dep );
		} // if
	});

	// Default task.
	grunt.registerTask('default', ['jshint', 'nodeunit']);
	grunt.registerTask('doc', ['clean', 'compdoc', 'markdown']);


	grunt.registerMultiTask('compdoc', 'Compile documents from partials', function() {
		var options = this.options({
				index: false
			}),
			heading = '^(#{2,}) (.+)$',
			rePartial = /^_+([^.]+)(?:\..+)*$/i,
			reHeadings = new RegExp( heading, 'igm' ),
			reHeading = new RegExp( heading, 'i' ),
			rcfile = null,
			template = '',
			processed = '',
			data = {};

		// Read the global configuration file (if was set).
		if ( options.compdocrc ) {
			rcfile = grunt.file.readJSON( options.compdocrc );
		} // if

		// Read the template (if was set).
		if ( options.template ) {
			if ( ! grunt.file.exists ) {
				grunt.log.warn( 'Template file "' + options.template + '" not found.' );
			} else {
				template = grunt.file.read( options.template );
			} // if..else
		} // if

		// Iterate over all src-dest file pairs.
		this.files.forEach( function( f ) {
			var partials = {}, headings, toc = '';

			// Read and store all the partials
			f.src.filter( function( filepath ) {
				// Warn on and remove invalid source files.
				if ( ! grunt.file.exists( filepath ) ) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} // if

				if ( ! rePartial.test( path.basename( filepath ) ) ) {
					grunt.log.warn('Source file "' + filepath + '" is not a partial.');
					return false;
				} // if

				return true;
			}).forEach( function( filepath ) {
				// Store all the partials
				var	src = grunt.file.read( filepath ),
					key = path.basename( filepath ).match( rePartial )[1];

				partials[ key ] = grunt.util.normalizelf( src );
			});

			// Process the template / concatenate and process partials
			_(data).extend( grunt.config( 'pkg' ), options, rcfile );

			if ( template ) {
				// Include partials for indexing and processing
				_(data).extend( partials );

				if ( options.index ) {
					// Temporarly hide index tag from processing
					template = template.replace( '<%= index %>', '{{ index }}' );
					// Intermediate processing
					processed = grunt.template.process( template, { data: data } );
					// Build TOC
					headings = processed.match( reHeadings );
					headings.forEach( function( heading ) {
						var chapter = heading.match( reHeading );
						toc += grunt.util.repeat( ( chapter[1].length - 2 ) * 4, ' ' ) +
							'* [' + _(chapter[2]).humanize() + '](' +
							'#' + _(chapter[2]).slugify() + ')\n';
					});
					data.index = toc;
					// Re-enable index tag
					template = template.replace( '{{ index }}', '<%= index %>' );
				} // if

				processed = grunt.template.process( template, { data: data } );
			} else {
				// Concatenate and process all partials
				template = _(partials).map( function( partial ) {
					return partial;
				}).join( grunt.util.linefeed );
				processed = grunt.template.process( template, { data: data } );

				if ( options.index ) {
					// Build TOC
					headings = processed.match( reHeadings );
					headings.forEach( function( heading ) {
						var chapter = heading.match( reHeading );
						toc += grunt.util.repeat( ( chapter[1].length - 2 ) * 4, ' ' ) +
							'* [' + _(chapter[2]).humanize() + '](' +
							'#' + _(chapter[2]).slugify() + ')\n';
					});

					processed = toc + processed;
				} // if
			} // if..else

			// Write the destination file.
			grunt.file.write( f.dest, processed );

			// Print a success message.
			grunt.log.writeln( 'File "' + f.dest + '" created.' );
		});

	});
};

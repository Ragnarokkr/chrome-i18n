'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			markdown: ['./md']
		},
		bump: {
			options: {
				part: 'patch',
				hardTab: true
			},
			files: [ 'package.json' ]
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
			info: {
				options: {
					gfm: true,
					highlight: 'manual'
				},
				files: [ './*.md' ],
				dest: './md/',
				template: './doc/template.jst'
			},
			doc: {
				options: {
					gfm: true,
					highlight: 'manual'
				},
				files: [ './doc/*.md' ],
				dest: './md/',
				template: './doc/template.jst'
			}
		},
		nodeunit: {
			files: ['test/**/*_test.js'],
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
				tasks: ['clean:markdown', 'markdown']
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

};

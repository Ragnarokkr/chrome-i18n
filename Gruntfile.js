'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			markdown: ['./md']
		},
		nodeunit: {
			files: ['test/**/*_test.js'],
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
				dest: './md/'
			},
			files: [ './*.md', './doc/*.md' ]
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
				files: '<%= markdown.files %>',
				tasks: ['clean:markdown', 'markdown']
			}
		},
	});

	// Grunt-Contrib Tasks
	Object.keys(grunt.config('pkg').devDependencies).forEach(function(dep){
		if (/^grunt\-/i.test(dep)) {
			grunt.loadNpmTasks( dep );
		} // if
	});

	// Custom tasks
	grunt.loadTasks( 'tasks' );

	// Default task.
	grunt.registerTask('default', ['jshint', 'nodeunit']);

};

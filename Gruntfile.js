
module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    clean: {
      test: ['test/results/**']
    },
    test: {
      files: ['test/**/*_test.js'],
      tasks: ['clean:test']
    },
    lint: {
      files: ['Gruntfile.js', 'package.json', 'bin/**/*.js',
              'lib/**/*.js', 'test/**/*_test.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: ['default']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        globalstrict: true
      },
      globals: {
        exports: true,
        require: true,
        process: true,
        console: true
      }
    }
  });

  // Tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

};
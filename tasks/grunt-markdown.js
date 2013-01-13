/* grunt-markdown */

module.exports = function( grunt ){
'use strict';
  grunt.registerMultiTask('markdown', 'Generate documentation from Markdown files', function(){
    var path = require('path'),
        marked = require('marked'),
        files = grunt.file.expand( this.data ),
        options = this.options(),
        template = options.template || '<!doctype html><html><head>' +
          '<link rel="stylesheet" href="http://github.github.com/github-flavored-markdown/shared/css/documentation.css">' +
          '</head><body><div id="wrapper" class="content"><%= markdown %></div></body></html>';

    files.forEach( function( file ){
      var inp = grunt.file.read( file, { encoding: 'utf8' } ),
          out = grunt.template.process( template, {data: {markdown: marked( inp )}} ),
          dest = path.join( options.dest || '.', path.basename(file, '.md') + '.html' );

      grunt.file.write( dest, out, { encoding: 'utf8' } );
    });
  });
};

/* grunt-bump */

module.exports = function( grunt ){
'use strict';
	grunt.registerTask( 'bump', 'Bump the version number', function( release ){
		var semver = require('semver'),
			pkg = grunt.config( 'pkg' ),
			oldVersion = pkg.version,
			newVersion;

		if ( arguments.length && /^major|minor|patch|build$/.test( release ) ) {
			newVersion = semver.inc( oldVersion, release );
			if ( newVersion ) {
				pkg.version = newVersion;
				grunt.file.write( './package.json', JSON.stringify( pkg, null, 2 ) );
				grunt.log.writeln( this.name + ': version bumped to ' + newVersion +
					' (it was ' + oldVersion + ')' );
				return true;
			} // if
		}

		// executed ONLY if no argument is passed
		grunt.fail.warn( this.name +
			': please specify what release to bump: major, minor, patch, or build' );
		return false;
	});
};

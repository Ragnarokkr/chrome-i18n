'use strict';

var commons = require( '../lib/commons' );

exports['Commons Test'] = {
  'members': {
    'validateMeta()': function( test ){
      test.expect( 1 );
      test.strictEqual( typeof commons.validateMeta, 'function',
                        'it should return a `function`' );
      test.done();
    },
    'resolveRelatives()': function( test ){
      test.expect( 1 );
      test.strictEqual( typeof commons.resolveRelatives, 'function',
                        'it should return a `function`' );
      test.done();
    },
    'outputErrors()': function( test ){
      test.expect( 1 );
      test.strictEqual( typeof commons.outputErrors, 'function',
                        'it should return a `function`' );
      test.done();
    }
  },

  'validation': {
    'valid monolith mode': function( test ){
      test.expect( 2 );

      var meta = {
            format: 'monolith',
            dest: './_locales/',
            locales: [ 'it', 'en' ]
          },
          errors = [];

      test.ok( commons.validateMeta( meta, errors ),
              'it should pass the validation' );
      test.ok( !errors.length, 'it should not return errors' );
      test.done();
    },
    'valid category mode': function( test ){
      test.expect( 2 );

      var meta = {
            format: 'category',
            imports: [
              '_partial1.json',
              '_partial2.json'
            ],
            dest: './_locales/',
            locales: [ 'it', 'en' ]
          },
          errors = [];

      test.ok( commons.validateMeta( meta, errors ),
              'it should pass the validation' );
      test.ok( !errors.length, 'it should not return errors' );
      test.done();
    },
    'valid language mode': function( test ){
      test.expect( 2 );

      var meta = {
            format: 'language',
            imports: './',
            dest: './_locales/',
            locales: [ 'it', 'en' ],
            definitions: {
              'term1': {
                description: 'term number 1',
              },
              'term2': {
                description: 'term number 2',
                placeholders: {
                  'marker': {
                    content: '$1',
                    example: 'this is the $1 example'
                  }
                }
              }
            }
          },
          errors = [];

      test.ok( commons.validateMeta( meta, errors ),
              'it should pass the validation' );
      test.ok( !errors.length, 'it should not return errors' );
      test.done();
    },
    'invalid META': function( test ){
      test.expect( 2 );

      var meta = {
            format: 1,
            locales: 'it'
          },
          errors = [],
          expected = [
            'Error (META): `format` field is not defined or in wrong format',
            'Error (META): `dest` field MUST be a string',
            'Error (META): `locales` field MUST be an array'
          ].toString();

      test.ok( !commons.validateMeta( meta, errors ),
              'it should not pass the validation' );
      test.strictEqual( errors.toString(), expected,
                        'it should return the same errors' );
      test.done();
    }
  } // validation
};

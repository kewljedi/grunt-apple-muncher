/*
 * grunt-apple-muncher
 * https://github.com/kewljedi/grunt-apple-muncher
 *
 * Copyright (c) 2013 Donald Perry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: 'checkstyle',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['dest'],
      copy: ['apple-touch-icon.png']
    },
    copy: {
      main: {
        files:[
          { src:'test/fixtures/apple-touch-icon.png', dest:'apple-touch-icon.png'}
        ]
      }
    },
    // Configuration to be run (and then tested).
    munch_webclip_icons: {
      default_options: {
        options: {
        }
      },
      custom_options: {
        options: {
          src:'test/fixtures/apple-touch-icon.png',
          precomposed:true
        }
      }
    },

    munch_apple_touch_startup_image: {
      custom_options: {
        options: {
          partial: 'dest/partials/startupimage.html',
          dest: 'dest/'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'munch_webclip_icons','munch_apple_touch_startup_image', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

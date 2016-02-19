/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'phantomjs/*.js',
        'libs/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    connect: {
      qunit: {
        options: {
          port: 7000,
          base: '.',
        }
      }
    },

    clean: {
      tests: ['.tmp']
    },

    qunit: {
      individual_tests: {
        options: {
          screenshotPath: '.tmp/original_screenshots'
        },
        files: [
          {src: 'test/qunit_test_01.html'},
          {src: 'test/qunit_test_02.html'},
          {src: 'test/qunit_test_03.html'}
        ]
      },
      urls_with_options: {
        options: {
          urls: [
            'http://localhost:7000/test/qunit_test_01.html',
            'http://localhost:7000/test/qunit_test_02.html',
            'http://localhost:7000/test/qunit_test_03_diff.html'
          ],
          screenshotPath: '.tmp/screenshots',
          originalScreenshotPath: '.tmp/original_screenshots',
          diffScreenshotPath: '.tmp/diff_screenshots',
          resemble: {
            errorType: 'movement'
          }
        }
      }
    },

    nodeunit: {
      tests: ['test/nodeunit/*.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-phantomjs-basil');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint', 'clean', 'connect', 'qunit', 'nodeunit']);

  grunt.registerTask('default', ['test']);

};

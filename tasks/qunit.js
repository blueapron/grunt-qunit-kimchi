/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Some code copied and inspired from
 * https://github.com/gruntjs/grunt-lib-phantomjs
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

'use strict';

module.exports = function(grunt) {
  var options, resembleOptions, urls, testUrl = '';

  // Nodejs libs.
  var path = require('path');
  var url  = require('url');
  var sys  = require('sys');
  var exec = require('child_process').exec;

  // Phantomjs Hooks
  var phantomjsHooks = require('../phantomjs/hooks.js');
  var phantomjs      = phantomjsHooks.init(grunt);

  // Get an asset file, local to the root of the project.
  var asset = path.join.bind(null, __dirname, '..');

  // Utils module
  var utils = require('../libs/utils.js').init(grunt);

  // Resemble Task
  var resemble = require('./resemble.js')(grunt);

  grunt.registerMultiTask('qunit', 'Run QUnit unit tests in a headless PhantomJS instance.', function() {
    // asynchronous
    var done = this.async();

    options = this.options({
      // Default PhantomJS timeout.
      timeout: 5000,
      // QUnit-PhantomJS bridge file to be injected.
      inject: asset('phantomjs/bridge.js'),
      // Explicit non-file URLs to test.
      urls: [],
      // Do not use an HTTP base by default
      httpBase: false
    });

    // default screenshotPath
    if(!options.screenshotPath) {
      options.screenshotPath = 'screenshot';
    }

    if(options.httpBase) {
      //If URLs are explicitly referenced, use them still
      urls = options.urls;
      // Then create URLs for the src files
      this.filesSrc.forEach(function(testFile) {
        urls.push(options.httpBase + '/' + testFile);
      });
    } else {
      // Combine any specified URLs with src files.
      urls = options.urls.concat(this.filesSrc);
    }

    if(options.noGlobals) {
      // Append a noglobal query string param to all urls
      var parsed;
      urls = urls.map(function(testUrl) {
        parsed = url.parse(testUrl, true);
        parsed.query.noglobals = "";
        delete parsed.search;
        return url.format(parsed);
      });
    }

    // Clear terminal
    exec('clear', function(err, stdout, stderr) {
      sys.print(stdout);
      grunt.log.subhead('Running Test: ' + testUrl);
    });

    // Process each filepath in-order.
    grunt.util.async.forEachSeries(urls,
      function(url, callback) {
        testUrl = url;

        grunt.event.emit('qunit.spawn', url);
        // Launch PhantomJS.
        phantomjs.spawn(url, {
          // Additional PhantomJS options.
          options: options,
          // Do stuff when done.
          done: function(err) {
            if(err) { done(); }
            else { callback(); }
          },
        });
      },
      // All tests have been run.
      function() {
        // Log results.
        if (utils.status.failed > 0 || utils.status.total === 0) {
          grunt.log.writeln();
          grunt.log.writeln('Failed Assertions:');
          // Log failed assertions
          utils.logFailedAssertions(phantomjsHooks.failedAssertions);
          // Warn unless force option is passed
          utils.warnUnlessForced(options.force);
        }
        else {
          grunt.log.writeln();
          grunt.log.ok(utils.status.total.toString().green + ' assertions passed');
          grunt.log.ok('duration: ' + utils.status.duration + 'ms');
        }

        // If resemble is on
        if(options.resemble && options.originalScreenshotPath) {
         resembleOptions = typeof options.resemble === 'object' ? options.resemble : {};

          grunt.config.merge({
            'qunit-resemble': {
              qunit: {
                options: {
                  screenshotPath: options.screenshotPath,
                  originalScreenshotPath: options.originalScreenshotPath,
                  diffScreenshotPath: options.diffScreenshotPath,
                  errorDiffPath: options.errorDiffPath,
                  errorColor: resembleOptions.errorColor,
                  errorType: resembleOptions.errorType,
                  transparency: resembleOptions.transparency
                }
              }
            }
          });

          grunt.task.run('qunit-resemble:qunit');
        }

        done(utils.status.failed === 0);
      });
  });
};

/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Resemble.js Task to compare original screenshots to current screenshots
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

'use strict';

module.exports = function(grunt) {
  var options, qunitResemble, rootDir, screenshotPath, originalScreenshotPath,
      diffScreenshotPath, done;

  var asyncParallel = [],
      screenshots = {},
      originalScreenshots = {},
      mismatch = [];

  // Node Modules
  var fs       = require('fs');
  var resemble = require('node-resemble-js');

  // Qunit Resemble
  qunitResemble = {
    resemble: function(key, callback) {
      // Resemble module to compare two screenshots
      resemble(originalScreenshots[key])
      .compareTo(screenshots[key])
      .ignoreAntialiasing() // ignore anti aliasing
      .onComplete(function(data) {
        var misMatchPercentage = Number(data.misMatchPercentage);

        if(misMatchPercentage > 0.0) {
          var imgStream = fs.createWriteStream(diffScreenshotPath + '/' + key +'-diff.png');
          // callback on image creation
          imgStream.on('close', function() {
            callback();
          });

          // save mismatch screenshot info
          mismatch.push({
            name: key,
            percentage: String(data.misMatchPercentage) + '%',
            error: screenshots[key].indexOf(options.errorDiffPath) !== -1
          });

          // Save diff image
          data.getDiffImage().pack().pipe(imgStream);
        }
        else {
          callback();
        }
      });
    },
    compare: function(key, callback) {
      var originalScreenshotFile, screenshotFile;

      // only compare with original when screenshot exists
      // in the newly generated screenshot folder
      if(screenshots[key]) {

        originalScreenshotFile = grunt.file.read(originalScreenshots[key], {
          encoding: 'base64'
        });

        screenshotFile = grunt.file.read(screenshots[key], {
          encoding: 'base64'
        });

        qunitResemble.resemble(key, callback);
      }
      else {
        callback();
      }
    },
    done: function() {
      var throwError = false;
      if(mismatch.length > 0) {
        grunt.log.writeln();
        grunt.log.warn('Screenshot Resemble Failed:'.bold);

        // Log mismatch screenshots
        // But only throw error for screenshots part of errorScreenshotPath
        mismatch.forEach(function(obj) {
          if(obj.error) {
            throwError = true;
            grunt.log.error('  '.red + obj.name + ': ' + obj.percentage.red + ' different'.red);
          }
          else {
            grunt.log.writeln('     '.red + obj.name + ': ' + obj.percentage.red + ' different'.red);
          }
        });

        grunt.log.writeln();
      }
      else {
        grunt.log.ok('Style Regression Check Passed');
      }

      done(!throwError);
    }
  };

  grunt.registerMultiTask('qunit-resemble', 'Compare image of the same name between two folders', function() {
    options = this.options();

    rootDir = process.cwd();
    screenshotPath = rootDir + '/' + options.screenshotPath;
    originalScreenshotPath = rootDir + '/' + options.originalScreenshotPath;
    diffScreenshotPath = rootDir + '/' + options.diffScreenshotPath;

    // asynchronous
    done = this.async();

    // Resemble configuration
    resemble.outputSettings({
      errorColor: options.errorColor || {
        red: 255,
        green: 0,
        blue: 255
      },
      errorType: options.errorType || 'flat',
      transparency: options.transparency || 1
    });

    // Create diff screenshot path
    if(!grunt.file.isDir(diffScreenshotPath)) {
      grunt.file.mkdir(diffScreenshotPath);
    }

    // Hashed screenshots { filename: path }
    if(grunt.file.isDir(screenshotPath)) {
      grunt.file.recurse(screenshotPath, function(abspath, rootdir, subdir, filename) {
        // Resemble node module only accepts .png type
        if(filename.match('.png')) {
          screenshots[filename] = abspath;
        }
      });
    }

    // Hashed originalScreenshots { filename: path }
    if(grunt.file.isDir(originalScreenshotPath)) {
      grunt.file.recurse(originalScreenshotPath, function(abspath, rootdir, subdir, filename) {
        // Resemble node module only accepts .png type
        if(filename.match('.png')) {
          originalScreenshots[filename] = abspath;
        }
      });
    }

    // Run async series for screenshot comparison
    // only if both screenshots and originalScreenshots are present
    if(Object.keys(screenshots).length && Object.keys(originalScreenshots).length) {
      grunt.util.async.forEachSeries(Object.keys(originalScreenshots),
        qunitResemble.compare,
        qunitResemble.done);
    }
    else {
      grunt.log.writeln('either screenshotPath or originalScreenshotPath has no screenshot files'.yellow);
      done(true);
    }
  });
};

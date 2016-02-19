/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Resemble.js Task to compare original screenshots to current screenshots
 *
 * Copyright (c) 2016 Blue Apron
 * Licensed under the MIT license
 */

'use strict';

var fs = require('fs');
// Resemble node module
var resemble = require('node-resemble-js');

module.exports = function(grunt) {

  grunt.registerMultiTask('qunit-resemble', 'Compare image of the same name between two folders', function() {
    var options = this.options(),
        rootDir = process.cwd(),
        screenshotPath = rootDir + '/' + options.screenshotPath,
        originalScreenshotPath = rootDir + '/' + options.originalScreenshotPath,
        diffScreenshotPath = rootDir + '/' + options.diffScreenshotPath;

    var asyncParallel = [],
        screenshots = {},
        originalScreenshots = {},
        mismatch = [],
        self = this;

    // asynchronous
    var done = this.async();

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

    // Hashed screenshots and originalScreenshots
    grunt.file.recurse(screenshotPath, function(abspath, rootdir, subdir, filename) {
      if(filename.indexOf('.png') !== -1) {
        screenshots[filename] = abspath;
      }
    });

    grunt.file.recurse(originalScreenshotPath, function(abspath, rootdir, subdir, filename) {
      if(filename.indexOf('.png') !== -1) {
        originalScreenshots[filename] = abspath;
      }
    });

    grunt.util.async.forEachSeries(Object.keys(originalScreenshots), function(key, callback) {
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

        // Resemble module to compare two screenshots
        resemble(originalScreenshots[key]) // original screenshot
          .compareTo(screenshots[key]) // newly generated screenshot
          .ignoreAntialiasing() // ignore anti aliasing
          .onComplete(function(data) {
            var misMatchPercentage = Number(data.misMatchPercentage);

            // mismatch
            if(misMatchPercentage > 0.0) {
              var imgStream = fs.createWriteStream(diffScreenshotPath + '/' + key +'-diff.png');
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
              data.getDiffImage()
                .pack()
                .pipe(imgStream);
            }
            else {
              callback();
            }
        });
      }
    },
    // Diff screenshots saved
    function() {
      if(mismatch.length > 0) {
        var throwError = false;

        grunt.log.writeln();
        grunt.log.warn('Screenshot Resemble Failed:'.bold);
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

      done(!throwError);
    });
  });
}

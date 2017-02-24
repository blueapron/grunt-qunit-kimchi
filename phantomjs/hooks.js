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

var grunt, failedAssertions = [], currentModule = '', currentTest = '', failedTests = [];

/**
 * module.exports
 * @param  {grunt object} grunt
 * @return {phantomjs object}
 */

exports.init = function(grunt) {
  var phantomjs = require('grunt-phantomjs-basil').init(grunt);
  var utils     = require('../libs/utils.js').init(grunt);

  // QUnit Hooks
  phantomjs.on('qunit.log', function(obj, source) {
    if(obj.result) {
      grunt.log.write('✓'.green);
    }
    else {
      obj.moduleTestName = currentModule + ' - ' + currentTest;
      // push failed object to array
      failedAssertions.push(obj);
      grunt.log.write('✗'.red);
      grunt.log.writeln(obj.message);
      grunt.log.writeln(obj.source);
    }
  });

  phantomjs.on('qunit.moduleStart', function(name) {
    currentModule = name;
    grunt.log.write(currentModule + ': ');
  });

  phantomjs.on('qunit.moduleDone', function(obj) {
    currentModule = '';
    grunt.log.writeln(' ');
  });

  phantomjs.on('qunit.testStart', function(name) {
    currentTest = name;
  });

  phantomjs.on('qunit.testDone', function(obj) {
    if (obj.failed > 0) {
      failedTests.push(obj.testId);
    }
  });

  phantomjs.on('qunit.begin', function(title) {
    grunt.log.writeln('');
    grunt.log.writeln(title.bold.underline);
  });

  phantomjs.on('qunit.done', function(obj) {
    utils.status.passed += obj.passed;
    utils.status.failed += obj.failed;
    utils.status.total += obj.total;
    utils.status.duration += obj.runtime;

    phantomjs.halt();
  });

  phantomjs.on('onConsoleMessage', function(msg) {
    grunt.log.writeln();
    grunt.log.writeln('Console: '+msg);
  });

  return phantomjs;
};

exports.updateFailedAssertions = function(failed) {
  failedAssertions = failed;
}

exports.failedAssertions = failedAssertions;
exports.failedTests = failedTests;

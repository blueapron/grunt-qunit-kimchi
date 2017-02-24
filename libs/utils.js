/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

var grunt;

if(!global.qunitStatus) {
  global.qunitStatus = {
    failedTests: [],
    failed: 0,
    passed: 0,
    total: 0,
    duration: 0
  };
}

exports.init = function(g) {
  grunt = g;
  return exports;
};

exports.status = global.qunitStatus;

exports.warnUnlessForced = function(force) {
  var msg = '';

  grunt.log.writeln('');

  if(global.qunitStatus.failed > 0) {
    msg = global.qunitStatus.failed + '/' +
          global.qunitStatus.total +
          ' assertions failed - duration: ' +
          global.qunitStatus.duration +
          'ms';
  }

  if(global.qunitStatus.total === 0) {
    msg =  '0/0 assertions ran';
  }

  if(force) {
    return grunt.log.error(msg.bold.red);
  }

  grunt.log.warn(msg.bold.red);
  grunt.log.writeln();
};

exports.logFailedAssertions = function(failedAssertions) {
  failedAssertions.forEach(function(fail) {
    grunt.log.writeln('');
    grunt.log.error(fail.moduleTestName.bold.red);
    grunt.log.error('   Message: '.bold + fail.message.red);
    grunt.log.error('  Expected: '.bold + fail.expected.green);
    grunt.log.error('    Actual: '.bold + String(fail.actual).red);

    // Javascript Stack
    if(fail.source) {
      var source = fail.source.split('\n');

      source.forEach(function(a, i) {
        if(i === 0) {
          return source[i] = 'at ' + a;
        }
        return source[i] = '            at ' + a;
      });

      grunt.log.error('    Source: '.bold + source.join('\n'));
    }
  });
};

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

/* global QUnit:true, window:true, document:true, define:true */

(function(factory) {
  if(typeof define === 'function' && define.amd) {
    require(['qunit'], factory);
  }
  else {
    factory(QUnit);
  }
})(function(QUnit) {
  'use strict';

  // Seding callback to phantomjs webpage
  function sendMessage() {
    var args = Array.apply(null, arguments);
    window.callPhantom(args);
  }

  // Screenshot Helper
  window.PhantomScreenshot = function(name, options) {
    options = options || {};

    sendMessage('screenshot', {
      name: name,
      path: options.path,
      rect: options.rect
    });
  };

  // Callbacks for QUnit
  QUnit.log(function(obj) {
    var actual, expected, dump;
    if (!obj.result) {
      // jsDump deprecation fallback
      dump = QUnit.dump || QUnit.jsDump;


      actual = dump.parse(obj.actual);
      expected = dump.parse(obj.expected);
    }

    // Send it.
    sendMessage('qunit.log', {
      result: obj.result,
      actual: actual,
      expected: expected,
      message: obj.message,
      source: obj.source
    });
  });

  QUnit.moduleStart(function(obj) {
    sendMessage('qunit.moduleStart', obj.name);
  });

  QUnit.moduleDone(function(obj) {
    sendMessage('qunit.moduleDone', {
      name: obj.name,
      failed: obj.failed,
      passed: obj.passed,
      total: obj.total
    });
  });

  QUnit.testStart(function(obj) {
    sendMessage('qunit.testStart', obj.name);
  });

  QUnit.testDone(function(obj) {
    sendMessage('qunit.testDone', {
      name: obj.name,
      failed: obj.failed,
      passed: obj.passed,
      total: obj.total,
      duration: obj.duration
    });
  });

  QUnit.begin(function() {
    sendMessage('qunit.begin', document.title);
  });

  QUnit.done(function(obj) {
    sendMessage('qunit.done', {
      failed: obj.failed,
      passed: obj.passed,
      total: obj.total,
      runtime: obj.runtime
    });
  });

});

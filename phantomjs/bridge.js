/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * Some code copied and inspired from
 * https://github.com/gruntjs/grunt-lib-phantomjs
 *
 * Copyright (c) 2016 Blue Apron
 * Licensed under the MIT license
 */

/* global QUnit:true */

(function(factory) {
  if(typeof define === 'function' && define.amd) {
    require(['qunit'], factory);
  }
  else {
    factory(QUnit);
  }
})(function(QUnit) {
  'use strict';

  // // No need to reorder tests
  // QUnit.config.reorder = false;
  // // Don't auto start QUnit tests
  // QUnit.config.autorun = false;

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
  }

  $('#backbone-testing-container').css({
    width: '100%',
    height: '100%',
    border: 'none',
    top: 0,
    left: 0,
  });

  $('#backbone-testing-container #header-main').css({
    position: 'fixed',
  });

  $('#body-wrap').css({
    zoom: '100%'
  });

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

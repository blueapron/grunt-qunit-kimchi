/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * QUnit.screenshot helper to take screenshot in phantomjs
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

(function(factory) {
  if(typeof define === 'function' && define.amd) {
    require(['qunit'], factory);
  }
  else {
    factory(QUnit);
  }
})(function(QUnit) {
  'use strict';

  QUnit.extend(QUnit, {
    screenshot: function(name, options) {
      var done, rect, domElement, clientRect;
      var assert = QUnit.config.current.assert,
          options = options || {},
          selector = options.selector,
          path = options.path;

      // Check if in phantomjs browser and PhantomScreenshot exists
      if(window.callPhantom && window.PhantomScreenshot) {
        // pause test for 300ms
        done = assert.async();

        window.setTimeout(function() {
          // selector is passed need to get the position of the dom element
          if(selector && (domElement = document.querySelector(selector))) {
            clientRect = domElement.getClientRects()[0];
            rect = {
              top: clientRect.top,
              left: clientRect.left,
              width: clientRect.width,
              height: clientRect.height
            }
          }

          // Hide dom element specified by each item in exclude array
          if(Array.isArray(exclude)) {
            exclude.forEach(function(dom) {
              var elem = document.querySelector(dom);
              if(elem) {
                elem.style.visibility = 'hidden';
              }
            });
          }

          // bubbling to phantomjs to trigger screenshot event
          window.PhantomScreenshot(name, {
            path: path,
            rect: rect
          });
          done();
        }, 300);
      }
    }
  });
});

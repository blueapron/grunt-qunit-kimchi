/**
 * grunt-qunit-kimchi
 * https://www.blueapron.com
 *
 * QUnit.screenshot helper to take screenshot in phantomjs
 *
 * Copyright (c) 2016 Blue Apron Engineering
 * Licensed under the MIT license
 */

var PhantomScreenshot;

(function(factory) {
  if(typeof define === 'function' && define.amd) {
    require(['qunit'], factory);
  }
  else if(QUnit) {
    factory(QUnit);
  }
  else {
    throw new Error('QUnit is not loaded');
  }
})(function(QUnit) {
  'use strict';

  /**
   * PhantomScreenshot Object to allow default selector, path, and exclude
   * @param {[type]} options [description]
   *
   * var screenshot = new PhantomScreenshot({
   *   selector: '#content',
   *   path: 'account',
   *   exclude: ['.some-class']
   * });
   *
   * screenshot('screenshot-name');
   *
   * will save screenshot-name.jpg to root_path/screenshot_path/account
   */

  PhantomScreenshot = function(options) {
    var options  = options || {},
        selector = options.selector,
        path     = options.path || '',
        exclude  = options.exclude || [];

    /**
     * Get offset information with native methods
     * Because not everyone uses jQuery and QUnit does not depend on jQuery
     * @param  {String} selector (.test, #test)
     * @return {Object} position of the selector dom
     */
    function getOffset(selector) {
      var rect, doc, docElem;
      var elem = document.querySelector(selector);

      if(!elem) { return false; }
      if(!elem.getClientRects().length) {
        return { top: 0, left: 0, width: 0, height: 0};
      }

      rect = elem.getBoundingClientRect();

      if(rect.width || rect.height) {
        doc = elem.ownerDocument;
        docElem = doc.documentElement;
      }

      return {
        top: rect.top + window.pageYOffset - docElem.clientTop,
        left: rect.left + window.pageXOffset - docElem.clientLeft,
        width: elem.offsetWidth,
        height: elem.offsetHeight
      }
    }

    /**
     * Loop through the exlude array and
     * find the dom of the selector and hide it
     *
     * @param  {Array} exclude - each item in the array should contain selector string
     */
    function excludeElements(exclude) {
      return Array.isArray(exclude) ? exclude.forEach(function(selector) {
        // Use querySelectorAll to hide all dom element with the specified selector
        var selectorAll = document.querySelectorAll(selector);

        if(selectorAll.length) {
          // Interate through NodeList
          for(var i = 0; i < selectorAll.length; i++) {
            selectorAll.item(i).style.visibility = 'hidden';
          }
        }
      }) : false;
    }

    /**
     * Calculate offset of selector (if exists),
     * Hide any dom element that is included in the exclude array
     * Calls PhantomScreenshot with passed options
     *
     * @param {String} name - name of the screenshot image
     */
    function asyncScreenshot(name, path) {
      var rect, offset, clientRect;
      var assert = QUnit.config.current.assert,
          done   = assert.async();

      // pause test for 300ms for rendering purposes
      window.setTimeout(function() {
        // Hide dom element specified by each item in exclude array
        excludeElements(exclude);

        // bubbling to phantomjs to trigger screenshot event
        window.PhantomScreenshot(name, {
          path: path,
          rect: getOffset(selector)
        });

        // Let QUnit know it's done
        done();
      }, 300);
    }

    /**
     * Helper function to take screenshot if in phantomjs environment
     *
     * @param  {String} name    - Name of the image to be saved
     * @param  {Object} options - selector[String], path[String], exclude[Array]
     */
    function screenshot(name, options) {
      var options  = options || {};
      var newPath = path;

      // options to override
      if(options.selector) { selector = options.selector; }
      if(options.path) { newPath = path + '/' + options.path; }
      if(Array.isArray(options.exclude)) { exclude = exclude.concat(options.exclude); }

      // Check if in phantomjs browser and PhantomScreenshot exists
      if(window.callPhantom && window.PhantomScreenshot) {
        asyncScreenshot(name, newPath);
      }
    }

    return screenshot;
  };

  // Extend screenshot with new PhantomScreenshot object
  QUnit.extend(QUnit, {
    screenshot: new PhantomScreenshot()
  });
});

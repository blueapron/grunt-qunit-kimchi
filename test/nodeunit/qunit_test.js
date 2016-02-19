'use strict';

var grunt = require('grunt');


exports.qunitTest = {
  resemble: function(test) {
    test.ok(grunt.file.isDir('.tmp'), 'should create .tmp folder');
    test.ok(grunt.file.isDir('.tmp/screenshots'), 'should create .tmp/screenshots folder');
    test.ok(grunt.file.isDir('.tmp/original_screenshots'), 'should create .tmp/original_screenshots folder');
    test.ok(grunt.file.isDir('.tmp/diff_screenshots'), 'should create .tmp/diff_screenshots folder');

    test.ok(grunt.file.exists('.tmp/diff_screenshots/qunit-test-03.png-diff.png'), 'qunit-test-03.png-diff.png should exist');

    test.ok(grunt.file.exists('.tmp/original_screenshots/qunit-test-01.png'), 'original_screenshots/qunit-test-01.png should exist');
    test.ok(grunt.file.exists('.tmp/original_screenshots/qunit-test-02.png'), 'original_screenshots/qunit-test-02.png should exist');
    test.ok(grunt.file.exists('.tmp/original_screenshots/qunit-test-03.png'), 'original_screenshots/qunit-test-03.png should exist');

    test.ok(grunt.file.exists('.tmp/screenshots/qunit-test-01.png'), 'original_screenshots/qunit-test-01.png should exist');
    test.ok(grunt.file.exists('.tmp/screenshots/qunit-test-02.png'), 'original_screenshots/qunit-test-01.png should exist');
    test.ok(grunt.file.exists('.tmp/screenshots/qunit-test-03.png'), 'original_screenshots/qunit-test-01.png should exist');

    test.done();
  }
}

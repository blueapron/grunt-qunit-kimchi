module('QUnit Kimchi Test 01');

test('Does window exist?', function(assert) {
  assert.ok(window, 'window object?');
});

test('QUnit screenshot method', function(assert) {
  assert.ok(QUnit.screenshot, 'should exist');
  QUnit.screenshot('qunit-test-01');
});

module('QUnit Kimchi Test 02');

test('Does document exist?', function(assert) {
  assert.ok(document, 'window object?');
});

test('QUnit screenshot method', function(assert) {
  assert.ok(QUnit.screenshot, 'should exist');
  QUnit.screenshot('qunit-test-02');
});

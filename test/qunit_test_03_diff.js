module('QUnit Kimchi Test 03 Diff');

test('Dom test Different', function(assert) {
  assert.ok(document.querySelector('#qunit'), '#qunit dom exists');
});

test('QUnit screenshot method', function(assert) {
  assert.ok(QUnit.screenshot, 'should exist');
  QUnit.screenshot('qunit-test-03');
});

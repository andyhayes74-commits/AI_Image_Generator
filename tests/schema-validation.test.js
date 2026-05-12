const assert = require('node:assert/strict');
const test = require('node:test');
const { fixtureContracts, validateFixtures } = require('../scripts/validate-fixtures');

test('all schema fixtures match their expected validation result', () => {
  const results = validateFixtures({ log: false });
  const failures = results.filter((result) => !result.passed);

  assert.deepEqual(failures, []);
});

test('the ImageManager invalid decision fixture is an expected validation failure', () => {
  const results = validateFixtures({ log: false });
  const invalidDecision = results.find(
    (result) => result.fixtureFile === 'imagemanager_decision.invalid_decision.invalid.json'
  );

  assert.ok(invalidDecision, 'Invalid ImageManager fixture should be registered.');
  assert.equal(invalidDecision.expectedValid, false);
  assert.equal(invalidDecision.actualValid, false);
  assert.equal(invalidDecision.passed, true);
});

test('fixture contract list includes both valid and expected-invalid examples', () => {
  const expectedValidityValues = new Set(fixtureContracts.map(([, , expectedValid]) => expectedValid));

  assert.deepEqual(expectedValidityValues, new Set([true, false]));
});

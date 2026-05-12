import assert from "node:assert/strict";
import test from "node:test";
import { validateAll } from "../scripts/validate-fixtures.js";

test("schema fixtures match their expected valid or invalid outcome", () => {
  const outcome = validateAll({ quiet: true });

  assert.equal(outcome.schemaCount, 9);
  assert.ok(outcome.fixtureCount >= 11);
  assert.deepEqual(outcome.failures, []);
});

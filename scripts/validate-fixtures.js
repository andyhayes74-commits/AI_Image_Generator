import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const schemaDir = path.join(repoRoot, "schemas");
const fixtureDir = path.join(repoRoot, "n8n", "test-fixtures");

const schemaByFixturePrefix = [
  ["client-submission", "client_submission.schema.json"],
  ["client-question", "client_question.schema.json"],
  ["client-answer", "client_answer.schema.json"],
  ["validation-result", "validation_result.schema.json"],
  ["stage-result", "stage_result.schema.json"],
  ["imagemanager-decision", "imagemanager_decision.schema.json"],
  ["rework-request", "rework_request.schema.json"],
  ["final-result", "final_result.schema.json"],
  ["job-state", "job_state.schema.json"]
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => path.join(dir, fileName));
}

function schemaForFixture(fileName) {
  const match = schemaByFixturePrefix.find(([prefix]) => fileName.startsWith(prefix));
  if (!match) {
    throw new Error(`No schema mapping exists for fixture ${fileName}`);
  }
  return `https://ai-image-generator.local/schemas/${match[1]}`;
}

function createAjv() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false
  });
  addFormats(ajv);

  for (const schemaPath of listJsonFiles(schemaDir)) {
    ajv.addSchema(readJson(schemaPath));
  }

  return ajv;
}

export function validateAll({ quiet = false } = {}) {
  const ajv = createAjv();
  const schemaFiles = listJsonFiles(schemaDir);
  const fixtureFiles = listJsonFiles(fixtureDir);
  const results = [];

  for (const schemaPath of schemaFiles) {
    readJson(schemaPath);
  }

  for (const fixturePath of fixtureFiles) {
    const fileName = path.basename(fixturePath);
    const fixture = readJson(fixturePath);
    const expectedValid = fileName.endsWith(".valid.json");
    const expectedInvalid = fileName.endsWith(".invalid.json");

    if (!expectedValid && !expectedInvalid) {
      throw new Error(`Fixture name must end with .valid.json or .invalid.json: ${fileName}`);
    }

    const validate = ajv.getSchema(schemaForFixture(fileName));
    if (!validate) {
      throw new Error(`Compiled schema not found for ${fileName}`);
    }

    const actualValid = validate(fixture);
    const passedExpectation = expectedValid ? actualValid : !actualValid;
    const errors = validate.errors ?? [];

    results.push({
      fileName,
      expectedValid,
      actualValid,
      passedExpectation,
      errors
    });
  }

  const failures = results.filter((result) => !result.passedExpectation);

  if (!quiet) {
    for (const result of results) {
      const expected = result.expectedValid ? "valid" : "invalid";
      const actual = result.actualValid ? "valid" : "invalid";
      const marker = result.passedExpectation ? "PASS" : "FAIL";
      console.log(`${marker} ${result.fileName} expected ${expected}, got ${actual}`);
      if (!result.passedExpectation && result.errors.length > 0) {
        console.log(ajv.errorsText(result.errors, { separator: "\n" }));
      }
    }
    console.log(`Checked ${schemaFiles.length} schemas and ${fixtureFiles.length} fixtures.`);
  }

  return {
    schemaCount: schemaFiles.length,
    fixtureCount: fixtureFiles.length,
    results,
    failures
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outcome = validateAll();
  if (outcome.failures.length > 0) {
    process.exitCode = 1;
  }
}

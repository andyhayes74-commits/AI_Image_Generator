#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const schemasDir = path.join(rootDir, 'schemas');
const fixturesDir = path.join(rootDir, 'n8n', 'test-fixtures');

const fixtureContracts = [
  ['client_submission.valid.json', 'client_submission.schema.json', true],
  ['job_state.valid.json', 'job_state.schema.json', true],
  ['stage_result.valid.json', 'stage_result.schema.json', true],
  ['validation_result.failed.valid.json', 'validation_result.schema.json', true],
  ['imagemanager_decision.continue.valid.json', 'imagemanager_decision.schema.json', true],
  ['imagemanager_decision.ask_client.valid.json', 'imagemanager_decision.schema.json', true],
  ['imagemanager_decision.invalid_decision.invalid.json', 'imagemanager_decision.schema.json', false],
  ['client_question.valid.json', 'client_question.schema.json', true],
  ['client_answer.valid.json', 'client_answer.schema.json', true],
  ['rework_request.visual_polish.valid.json', 'rework_request.schema.json', true],
  ['final_result.valid.json', 'final_result.schema.json', true]
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function typeMatches(value, expectedType) {
  if (expectedType === 'array') return Array.isArray(value);
  if (expectedType === 'integer') return Number.isInteger(value);
  if (expectedType === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (expectedType === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === expectedType;
}

function validateFormat(value, format) {
  if (format === 'date-time') return !Number.isNaN(Date.parse(value));
  if (format === 'uri') {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

function getPropertySchema(schema, key) {
  return schema.properties && Object.prototype.hasOwnProperty.call(schema.properties, key)
    ? schema.properties[key]
    : undefined;
}

function validateCondition(condition, data) {
  return validateSchema(condition, data, '$', { collectAll: true }).valid;
}

function validateSchema(schema, data, location = '$', options = {}) {
  const errors = [];
  const collectAll = options.collectAll ?? false;
  const addError = (message) => {
    errors.push(`${location}: ${message}`);
    return collectAll;
  };

  if (schema.type && !typeMatches(data, schema.type)) {
    if (!addError(`expected type ${schema.type}`)) return { valid: false, errors };
  }

  if (Object.prototype.hasOwnProperty.call(schema, 'const') && data !== schema.const) {
    if (!addError(`expected const ${JSON.stringify(schema.const)}`)) return { valid: false, errors };
  }

  if (schema.enum && !schema.enum.includes(data)) {
    if (!addError(`expected one of ${schema.enum.join(', ')}`)) return { valid: false, errors };
  }

  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      if (!addError(`expected minimum length ${schema.minLength}`)) return { valid: false, errors };
    }
    if (schema.maxLength !== undefined && data.length > schema.maxLength) {
      if (!addError(`expected maximum length ${schema.maxLength}`)) return { valid: false, errors };
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
      if (!addError(`expected to match pattern ${schema.pattern}`)) return { valid: false, errors };
    }
    if (schema.format && !validateFormat(data, schema.format)) {
      if (!addError(`expected format ${schema.format}`)) return { valid: false, errors };
    }
  }

  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      if (!addError(`expected minimum ${schema.minimum}`)) return { valid: false, errors };
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      if (!addError(`expected maximum ${schema.maximum}`)) return { valid: false, errors };
    }
  }

  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      if (!addError(`expected at least ${schema.minItems} item(s)`)) return { valid: false, errors };
    }
    if (schema.items) {
      data.forEach((item, index) => {
        const result = validateSchema(schema.items, item, `${location}[${index}]`, { collectAll: true });
        errors.push(...result.errors);
      });
    }
  }

  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    for (const requiredKey of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(data, requiredKey)) {
        if (!addError(`missing required property ${requiredKey}`)) return { valid: false, errors };
      }
    }

    if (schema.additionalProperties === false && schema.properties) {
      for (const key of Object.keys(data)) {
        if (!getPropertySchema(schema, key)) {
          if (!addError(`unexpected property ${key}`)) return { valid: false, errors };
        }
      }
    }

    if (schema.properties) {
      for (const [key, propertySchema] of Object.entries(schema.properties)) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const result = validateSchema(propertySchema, data[key], `${location}.${key}`, { collectAll: true });
          errors.push(...result.errors);
        }
      }
    }

    if (schema.additionalProperties && typeof schema.additionalProperties === 'object' && schema.properties) {
      for (const [key, value] of Object.entries(data)) {
        if (!getPropertySchema(schema, key)) {
          const result = validateSchema(schema.additionalProperties, value, `${location}.${key}`, { collectAll: true });
          errors.push(...result.errors);
        }
      }
    }
  }

  for (const compoundSchema of schema.allOf || []) {
    if (compoundSchema.if && compoundSchema.then && validateCondition(compoundSchema.if, data)) {
      const result = validateSchema(compoundSchema.then, data, location, { collectAll: true });
      errors.push(...result.errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateFixtures({ log = true } = {}) {
  const results = fixtureContracts.map(([fixtureFile, schemaFile, expectedValid]) => {
    const schema = readJson(path.join(schemasDir, schemaFile));
    const fixture = readJson(path.join(fixturesDir, fixtureFile));
    const validation = validateSchema(schema, fixture, '$', { collectAll: true });
    const passed = validation.valid === expectedValid;

    return {
      fixtureFile,
      schemaFile,
      expectedValid,
      actualValid: validation.valid,
      passed,
      errors: validation.errors
    };
  });

  if (log) {
    for (const result of results) {
      const expectation = result.expectedValid ? 'valid' : 'invalid';
      if (result.passed) {
        console.log(`PASS ${result.fixtureFile} (${expectation} as expected)`);
      } else {
        console.error(`FAIL ${result.fixtureFile} (expected ${expectation}, got ${result.actualValid ? 'valid' : 'invalid'})`);
        if (result.errors.length > 0) {
          console.error(result.errors.map((error) => `  - ${error}`).join('\n'));
        }
      }
    }
  }

  return results;
}

if (require.main === module) {
  const results = validateFixtures();
  const failures = results.filter((result) => !result.passed);

  if (failures.length > 0) {
    console.error(`\n${failures.length} fixture validation expectation(s) failed.`);
    process.exit(1);
  }

  console.log(`\n${results.length} fixture validation expectation(s) passed.`);
}

module.exports = {
  fixtureContracts,
  validateFixtures,
  validateSchema
};

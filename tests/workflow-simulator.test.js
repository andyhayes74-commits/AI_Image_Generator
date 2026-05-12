import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { classifyInputFiles, classifyRework, decideWithImageManager, researchObject, runMockWorkflow } from "../scripts/workflow-simulator.js";
import { validateAll } from "../scripts/validate-fixtures.js";

const submission = JSON.parse(fs.readFileSync(path.resolve("n8n/test-fixtures/client-submission.valid.json"), "utf8"));

test("mock workflow reaches final approval from valid submission", () => {
  const result = runMockWorkflow(submission);

  assert.equal(result.input.status, "passed");
  assert.equal(result.planning.placement.status, "passed");
  assert.equal(result.generation.validation.passed, true);
  assert.equal(result.decision.decision, "approve_final");
  assert.equal(result.finalResult.status, "approved");
});

test("poor object references trigger client clarification", () => {
  const poorSubmission = structuredClone(submission);
  poorSubmission.assets[1].notes = "poor blurry low quality reference";

  const input = classifyInputFiles(poorSubmission);
  const decision = decideWithImageManager({ latestStageResult: input });

  assert.equal(input.status, "needs_client");
  assert.equal(decision.decision, "ask_client");
  assert.equal(decision.next_status, "awaiting_client_answer");
  assert.ok(decision.client_question);
});

test("visual-only rework skips research and preserves prior planning", () => {
  const reworkRequest = {
    rework_id: "rw-0001",
    job_id: submission.job_id,
    source: "client",
    requested_change: "Make the scene brighter.",
    impact: classifyRework("Make the scene brighter."),
    preserve: ["placement"],
    created_at: "2026-05-12T18:45:00Z"
  };

  const research = researchObject(submission, { reworkRequest });
  const result = runMockWorkflow(submission, { reworkRequest });

  assert.equal(research.skipped, true);
  assert.equal(result.decision.decision, "start_targeted_rework");
  assert.equal(result.decision.target_stage, "visual_rework");
  assert.equal(result.decision.reuse_previous_data.research, true);
  assert.equal(result.decision.reuse_previous_data.placement_plan, true);
});

test("placement and object reworks rerun the affected planning slices", () => {
  const placement = runMockWorkflow(submission, {
    reworkRequest: {
      rework_id: "rw-0002",
      job_id: submission.job_id,
      source: "client",
      requested_change: "Move the blender to the other wall.",
      impact: "placement_change",
      preserve: [],
      created_at: "2026-05-12T18:46:00Z"
    }
  });

  const object = runMockWorkflow(submission, {
    reworkRequest: {
      rework_id: "rw-0003",
      job_id: submission.job_id,
      source: "client",
      requested_change: "Use a different blender model.",
      impact: "object_change",
      preserve: [],
      created_at: "2026-05-12T18:47:00Z"
    }
  });

  assert.equal(placement.decision.target_stage, "placement_planning");
  assert.equal(placement.decision.reuse_previous_data.placement_plan, false);
  assert.equal(object.decision.target_stage, "object_reconstruction");
  assert.equal(object.decision.reuse_previous_data.object_analysis, false);
});

test("fixtures and ImageManager decisions stay schema-valid", () => {
  const outcome = validateAll({ quiet: true });
  assert.deepEqual(outcome.failures, []);
});

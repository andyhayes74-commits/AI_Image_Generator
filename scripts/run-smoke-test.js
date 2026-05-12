import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateAll } from "./validate-fixtures.js";
import { runMockWorkflow } from "./workflow-simulator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const submission = JSON.parse(fs.readFileSync(path.join(repoRoot, "n8n/test-fixtures/client-submission.valid.json"), "utf8"));

const validation = validateAll({ quiet: true });
if (validation.failures.length > 0) {
  throw new Error("Fixture validation failed.");
}

const workflow = runMockWorkflow(submission);
if (workflow.decision.decision !== "approve_final") {
  throw new Error(`Expected approve_final, got ${workflow.decision.decision}`);
}
if (!workflow.finalResult) {
  throw new Error("Expected a mock final result.");
}

const visualRework = {
  rework_id: "rw-0001",
  job_id: submission.job_id,
  source: "client",
  requested_change: "Make the scene brighter.",
  impact: "visual_polish",
  preserve: ["placement"],
  created_at: "2026-05-12T18:45:00Z"
};
const reworkWorkflow = runMockWorkflow(submission, { reworkRequest: visualRework });
if (reworkWorkflow.decision.reuse_previous_data.research !== true) {
  throw new Error("Expected visual rework to reuse research.");
}

console.log("Smoke test passed: contracts, mock workflow, final result, and visual rework route are working.");

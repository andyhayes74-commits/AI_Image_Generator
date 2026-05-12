# Codex Build Queue

This document is the Codex-oriented build plan for the complete system.

Codex should build the project in small verified slices. Each slice should produce something testable before moving on.

---

## Build Philosophy

The system should be built:

- Contract-first.
- Mock-first.
- Test-first where practical.
- Workflow-by-workflow.
- Loop-safe.
- Schema-validated.
- Documentation-updated after every behavioural change.
- Deployment-aware for n8n workflow exports.

Codex should not attempt to build the full system in one giant pass.

---

## Non-Negotiable Codex Rules

- Do not commit secrets, API keys, `.env` files, n8n credentials, or private webhook secrets.
- Do not create product placeholders without clearly marking them as intentional scaffold code.
- Do not introduce live provider calls before mock mode and contracts exist.
- Do not change schemas without updating docs and tests.
- Do not mix unrelated work into a task.
- Do not start image generation before the WordPress-to-n8n contract is stable.
- Do not add live n8n deployment before workflow validation, dry-run support, and a deployment build plan exist.
- Run available tests after each slice.
- Fix failing tests before expanding scope.
- Update `docs/BUILD_QUEUE.md` and `docs/BUILD_PLANS.md` as work progresses.
- Follow `docs/N8N_DEPLOYMENT.md` when creating workflow exports, workflow validators, deployment scripts, or GitHub Actions.

---

## Recommended Future Repo Additions

These folders should be added by a planned build when needed:

```text
schemas/                    # JSON schemas for workflow contracts
tests/                      # Contract, fixture, plugin, and workflow tests
scripts/                    # Validation scripts, workflow simulators, and future deploy helpers
n8n/prompts/                # ImageManager and specialist worker prompts
n8n/test-fixtures/          # Safe fake packets for mock mode
n8n/deploy/                 # Future safe deployment mapping examples
.github/workflows/          # Future manual GitHub Actions, including n8n deployment
```

Do not add empty placeholder folders unless the build plan explicitly says to.

---

## Contract Files To Create

The following schemas should be created before real implementation:

```text
schemas/job_state.schema.json
schemas/client_submission.schema.json
schemas/stage_result.schema.json
schemas/validation_result.schema.json
schemas/imagemanager_decision.schema.json
schemas/client_question.schema.json
schemas/client_answer.schema.json
schemas/rework_request.schema.json
schemas/final_result.schema.json
```

---

## n8n Deployment Requirements For Future Builds

Future n8n workflow builds must keep deployment in mind from the first workflow export.

Workflow export work should ensure:

- JSON files live in `n8n/workflows/`.
- Workflow exports contain no real credentials or secrets.
- Workflow exports are valid JSON.
- Workflow exports are designed to be validated before deployment.
- Runtime/read-only fields are stripped or ignored before update calls.
- Workflow IDs are resolved through GitHub secrets or environment variables, not committed mappings.
- Deployment remains manual and dry-run capable until production use is explicitly approved.

Future deployment work may add:

```text
.github/workflows/deploy-n8n.yml
scripts/validate-n8n-workflows.js
scripts/deploy-n8n-workflow.mjs
n8n/deploy/workflow-map.example.json
n8n/deploy/README.md
```

These files should only be added by a dedicated deployment build plan. See `docs/N8N_DEPLOYMENT.md`.

---

## Codex Task List

### TASK-0001 — Lock documentation architecture

Goal:

- Update README and docs to reflect the scene-aware object integration system.

Acceptance criteria:

- README states the correct project objective.
- Architecture doc exists.
- Workflow overview exists.
- ImageManager design exists.
- Codex build queue exists.
- n8n deployment plan exists.
- No product code added.

Status: `In Progress`

---

### TASK-0002 — Create schema foundation

Goal:

- Create formal JSON schemas for the major workflow packets.

Expected files:

- `schemas/job_state.schema.json`
- `schemas/client_submission.schema.json`
- `schemas/stage_result.schema.json`
- `schemas/validation_result.schema.json`
- `schemas/imagemanager_decision.schema.json`
- `schemas/client_question.schema.json`
- `schemas/client_answer.schema.json`
- `schemas/rework_request.schema.json`
- `schemas/final_result.schema.json`

Acceptance criteria:

- Schemas exist.
- Schemas are valid JSON.
- README/docs reference schema purpose.
- No live integrations added.

Status: `Todo`

---

### TASK-0003 — Add fixture and contract validation scripts

Goal:

- Add safe fake fixtures and scripts to validate them.

Expected files:

- `n8n/test-fixtures/*.json`
- `scripts/validate-fixtures.js` or equivalent.
- `tests/schema-validation.test.js` or equivalent.

Acceptance criteria:

- Fixtures validate against schemas.
- Invalid fixture examples fail as expected.
- Test command documented.

Status: `Todo`

---

### TASK-0004 — Build WordPress plugin shell

Goal:

- Create plugin shell without full production features.

Expected features:

- Plugin activation without fatal error.
- Admin settings page.
- n8n webhook URL setting.
- API secret setting placeholder stored safely by WordPress.
- Basic job storage structure.
- No real provider keys.

Acceptance criteria:

- Plugin can be installed in WordPress plugin folder.
- Main plugin file exists.
- PHP lint passes where available.
- Settings page loads.

Status: `Todo`

---

### TASK-0005 — Build client submission form and REST endpoints

Goal:

- Allow a client/admin to submit a job from WordPress.

Expected features:

- Upload scene image.
- Upload object/reference files.
- Add written brief.
- Add constraints.
- Create job record.
- Send job packet to mock n8n endpoint or return mock status.

Acceptance criteria:

- Form renders.
- Inputs are sanitised.
- Uploads are handled safely.
- Job status is stored.
- Contract fixture matches `client_submission.schema.json`.

Status: `Todo`

---

### TASK-0006 — Build n8n master workflow skeleton

Goal:

- Add first exported n8n workflow JSON for the master controller.

Expected files:

- `n8n/workflows/01-master-job-controller.json`
- Supporting notes in `n8n/notes/`.

Acceptance criteria:

- Workflow JSON is valid.
- Webhook input shape matches schema.
- Workflow has mock-mode branch.
- No credentials included.
- Export follows `docs/N8N_DEPLOYMENT.md` deploy-safe rules.

Status: `Todo`

---

### TASK-0007 — Add n8n workflow validation

Goal:

- Add validation checks for committed n8n workflow JSON before deployment exists.

Expected files:

- `scripts/validate-n8n-workflows.js` or equivalent.
- Test fixtures or docs for valid/invalid workflow exports.

Acceptance criteria:

- Workflow JSON files are valid JSON.
- Required workflow fields are checked.
- Known read-only/runtime fields are reported or stripped in dry-run validation.
- No credentials/secrets are detected in committed exports.

Status: `Todo`

---

### TASK-0008 — Build client question/resume loop

Goal:

- Allow n8n to ask the client a question through WordPress and resume after the answer.

Expected features:

- `client_question` packet.
- WordPress stores and displays question.
- Client answer endpoint.
- n8n receives answer/resume packet.

Acceptance criteria:

- `awaiting_client_answer` status works.
- Client answer validates against schema.
- Workflow can resume with answer attached to job state.

Status: `Todo`

---

### TASK-0009 — Build ImageManager MVP

Goal:

- Add ImageManager prompt, schema validation, fixtures, and basic routing.

Expected files:

- `n8n/prompts/imagemanager.system.md`
- `n8n/prompts/imagemanager.input-template.md`
- Decision fixtures.
- Tests for valid/invalid decisions.

Acceptance criteria:

- ImageManager only returns allowed decisions.
- Invalid decisions are rejected.
- n8n routes based on decision output.
- Max loop rules exist.

Status: `Todo`

---

### TASK-0010 — Build input file analysis mock workflow

Goal:

- Classify uploaded files in mock mode.

Expected features:

- Scene photo detection fixture.
- Object reference fixture.
- Placement sketch fixture.
- Object sketch fixture.
- Poor-quality input issue fixture.

Acceptance criteria:

- Stage output validates as `stage_result`.
- ImageManager can decide continue or ask client based on fixture.

Status: `Todo`

---

### TASK-0011 — Build research mock workflow

Goal:

- Add research stage using mock data first, then prepare for Perplexity integration.

Expected features:

- Mock object dimension findings.
- Functional requirement findings.
- Source/evidence fields.
- Uncertainty fields.

Acceptance criteria:

- Research output validates.
- Rework layer can skip research when safe.
- No live Perplexity call yet unless explicitly planned.

Status: `Todo`

---

### TASK-0012 — Build planning and validation mocks

Goal:

- Add placement, scale, collision, functional-use, and environmental-effect mock outputs.

Acceptance criteria:

- Valid placement passes.
- Collision failure loops to repair.
- TV-on lighting failure routes to environmental consequence repair.
- Blender worktop collision routes to scene reengineering.

Status: `Todo`

---

### TASK-0013 — Build first image generation mock loop

Goal:

- Simulate image generation and final validation before live provider integration.

Acceptance criteria:

- Generation attempt is recorded.
- Final validation can pass or fail.
- Failed validation produces targeted repair.
- Final result packet returns to WordPress.

Status: `Todo`

---

### TASK-0014 — Build targeted rework layer

Goal:

- Support rework without restarting the full job.

Acceptance criteria:

- Visual-only rework skips research and placement.
- Placement rework reruns required stages.
- Object-change rework reruns object analysis/research as needed.
- Version history is preserved.

Status: `Todo`

---

### TASK-0015 — Add manual n8n deployment action

Goal:

- Add controlled GitHub Actions deployment for n8n workflows after workflow validation is proven.

Expected files:

- `.github/workflows/deploy-n8n.yml`
- `scripts/deploy-n8n-workflow.mjs`
- `n8n/deploy/workflow-map.example.json`
- `n8n/deploy/README.md`

Acceptance criteria:

- Manual `workflow_dispatch` only.
- Dry-run mode exists and is default.
- Required secrets are documented but not committed.
- Active state is preserved by default.
- Read-only/runtime fields are removed from update payloads.
- Deployment logs redact secrets.

Status: `Todo`

---

### TASK-0016 — Add live provider integrations

Goal:

- Replace selected mocks with live provider calls only after contracts and mock tests pass.

Expected integrations:

- Perplexity research.
- Vision model for image analysis/validation.
- Image generation/editing provider.

Acceptance criteria:

- Mock mode remains available.
- API errors are handled safely.
- No secrets committed.
- Provider outputs are converted into existing schemas.

Status: `Todo`

---

## First Build Recommendation

The immediate next Codex build should complete TASK-0001 if not already complete, then move to TASK-0002.

Do not start plugin, n8n implementation, live deployment, or provider integration until schemas and fixture validation exist.

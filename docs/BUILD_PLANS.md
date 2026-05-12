# Build Plans

This file stores detailed build plans before implementation starts.

A build plan should exist before each version or major feature branch is coded.

---

## Build Plan Template

```md
## vX.Y.Z — Build Name

Status: `Draft | Approved | In Progress | Complete`
Branch: `feature/example-branch`
Date Created: `YYYY-MM-DD`

### Goal

What this build is trying to achieve.

### Scope

Included:

- Item one.
- Item two.

Out of scope:

- Item one.
- Item two.

### Files Expected To Change

Plugin:

- `plugin/...`

n8n:

- `n8n/workflows/...`
- `n8n/notes/...`

Docs:

- `docs/...`

### Implementation Steps

1. Step one.
2. Step two.
3. Step three.

### Acceptance Criteria

- [ ] Criterion one.
- [ ] Criterion two.

### Test Plan

- [ ] Test one.
- [ ] Test two.

### Risks / Notes

- Risk or note.
```

---

## v0.1.0 — Repository Foundation & Architecture Lock

Status: `In Progress`
Branch: `feature/v0.1.0`
Date Created: `2026-05-11`

### Goal

Set up the repository as a shared home for the WordPress plugin, n8n workflow exports, and project documentation, then correct the project definition around the real system design.

The project is a scene-aware AI object integration system where WordPress handles client intake and n8n handles research, planning, validation, image generation, rework, and client questions.

### Scope

Included:

- Create `plugin/` folder scaffold.
- Create `n8n/workflows/` folder scaffold.
- Create `n8n/notes/` folder scaffold.
- Add shared documentation structure.
- Define the initial repo rules for AI coding agents.
- Update README with the real system objectives.
- Add architecture draft.
- Add workflow overview draft.
- Add ImageManager draft design.
- Add Codex build queue.
- Update roadmap and build queue to reflect the scene integration architecture.

Out of scope:

- Building the plugin features.
- Building the n8n workflow.
- Connecting the plugin to n8n.
- Creating schemas or fixtures.
- Adding test scripts.
- Adding real API keys, credentials, or webhook secrets.
- Adding live provider calls.
- Adding product placeholders beyond documented folder markers.

### Files Expected To Change

Plugin:

- `plugin/.gitkeep`

n8n:

- `n8n/workflows/.gitkeep`
- `n8n/notes/README.md`

Docs:

- `README.md`
- `AGENTS.md`
- `docs/ROADMAP.md`
- `docs/BUGS.md`
- `docs/BUILD_QUEUE.md`
- `docs/BUILD_PLANS.md`
- `docs/ARCHITECTURE.md`
- `docs/WORKFLOW_OVERVIEW.md`
- `docs/IMAGE_MANAGER.md`
- `docs/CODEX_BUILD_QUEUE.md`

### Implementation Steps

1. Create a feature branch.
2. Create plugin and n8n folder markers.
3. Add base documentation files.
4. Update README to define the correct project purpose and folder structure.
5. Add architecture, workflow, ImageManager, and Codex build docs.
6. Update roadmap and queue to reflect the new design.
7. Update agent rules.
8. Compare branch against main.
9. Open a pull request for review when ready.

### Acceptance Criteria

- [ ] Repo clearly separates plugin and n8n workflow areas.
- [ ] README describes the scene-aware object integration system.
- [ ] Docs clearly describe the shared repo approach.
- [ ] Architecture doc captures input intelligence, research, reconstruction, collision, functional use, environmental effects, looping, rework, and ImageManager.
- [ ] Workflow overview defines the planned 12-workflow system and MVP path.
- [ ] ImageManager design defines bounded n8n decision-node behaviour.
- [ ] Codex build queue defines contract-first, mock-first implementation.
- [ ] Build queue and bug tracker exist.
- [ ] Agent rules exist and match the new architecture.
- [ ] No product feature code has been started accidentally.
- [ ] No secrets or credentials have been committed.

### Test Plan

- [ ] Confirm files exist in the expected folders.
- [ ] Confirm README references the correct folder structure and objectives.
- [ ] Confirm docs do not claim live implementation exists.
- [ ] Confirm no secrets or credentials have been committed.
- [ ] Confirm no product code or workflow JSON was added beyond folder markers.

### Risks / Notes

- Empty folders require `.gitkeep` files so GitHub keeps them.
- n8n credentials must never be exported into repo workflow JSON.
- The architecture is intentionally ambitious; Codex should implement it in small verified slices.
- The next build should focus on schemas, fixtures, and validation before plugin/n8n feature code.

---

## v0.2.0 — Contract & Schema Foundation

Status: `Review`
Branch: `current branch`
Date Created: `2026-05-12`

### Goal

Create the formal, provider-neutral contract foundation shared by WordPress, n8n, ImageManager, validation stages, rework, and final delivery before any product feature code or workflow JSON is built.

### Scope

Included:

- Add JSON Schema contracts for client submission, job state, stage result, validation result, ImageManager decision, client question, client answer, rework request, and final result packets.
- Add safe fake n8n test fixtures covering the primary contracts.
- Add one intentionally invalid ImageManager decision fixture to prove unsupported routing decisions are rejected.
- Add simple Node validation tooling for the schema subset used by these contracts.
- Add npm scripts for test and fixture validation.
- Document the contract-first validation commands.

Out of scope:

- WordPress plugin feature code.
- WordPress UI.
- n8n workflow JSON exports.
- Live provider calls.
- Image generation.
- Real client data, production URLs, secrets, credentials, webhook secrets, or provider tokens.

### Files Expected To Change

Schemas:

- `schemas/job_state.schema.json`
- `schemas/client_submission.schema.json`
- `schemas/stage_result.schema.json`
- `schemas/validation_result.schema.json`
- `schemas/imagemanager_decision.schema.json`
- `schemas/client_question.schema.json`
- `schemas/client_answer.schema.json`
- `schemas/rework_request.schema.json`
- `schemas/final_result.schema.json`

n8n:

- `n8n/test-fixtures/*.json`

Tests and scripts:

- `package.json`
- `package-lock.json`
- `scripts/validate-fixtures.js`
- `tests/schema-validation.test.js`

Docs:

- `README.md`
- `docs/BUILD_QUEUE.md`
- `docs/BUILD_PLANS.md`

### Implementation Steps

1. Create contract, fixture, script, and test folders.
2. Define readable v0.2.0 JSON schemas with required `schema_version` fields and bounded enum values where routing or status values matter.
3. Add safe fake fixtures using project-relevant examples such as a blender on a kitchen worktop and a wall-mounted TV.
4. Add an expected-invalid ImageManager decision fixture.
5. Add a Node fixture validator that reports expected pass/fail outcomes clearly.
6. Add Node test coverage for the fixture validation matrix.
7. Update docs and queue status for the contract-first build.

### Acceptance Criteria

- [x] `npm install` works.
- [x] `npm test` works.
- [x] `npm run validate:fixtures` works.
- [x] Valid fixtures pass validation.
- [x] The intentionally invalid ImageManager decision fails validation as expected.
- [x] No plugin feature code is added.
- [x] No n8n workflow JSON is added.
- [x] No provider calls are added.
- [x] No secrets are committed.
- [x] Documentation explains the contract-first approach.

### Test Plan

- [x] Run `npm install` to verify the Node package lock and local script setup.
- [x] Run `npm test` to verify fixture validation expectations through the Node test runner.
- [x] Run `npm run validate:fixtures` to validate fixtures directly and show readable pass/fail reporting.
- [x] Inspect changed files for secrets and prohibited plugin/n8n workflow feature code.

### Risks / Notes

- The schemas are intentionally provider-neutral and focus on contracts rather than final internal implementation details.
- Future builds may add stricter cross-file `$ref` relationships or workflow-specific schemas after the plugin and n8n handoff contracts are exercised in mock mode.
- Fixture URLs use `https://example.invalid/...` and do not point to real client or provider assets.

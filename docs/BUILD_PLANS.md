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

Status: `Complete`
Branch: `feature/v0.1.0`
Date Created: `2026-05-11`
Date Completed: `2026-05-12`

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

- [x] Repo clearly separates plugin and n8n workflow areas.
- [x] README describes the scene-aware object integration system.
- [x] Docs clearly describe the shared repo approach.
- [x] Architecture doc captures input intelligence, research, reconstruction, collision, functional use, environmental effects, looping, rework, and ImageManager.
- [x] Workflow overview defines the planned 12-workflow system and MVP path.
- [x] ImageManager design defines bounded n8n decision-node behaviour.
- [x] Codex build queue defines contract-first, mock-first implementation.
- [x] Build queue and bug tracker exist.
- [x] Agent rules exist and match the new architecture.
- [x] No product feature code has been started accidentally.
- [x] No secrets or credentials have been committed.

### Test Plan

- [x] Confirm files exist in the expected folders.
- [x] Confirm README references the correct folder structure and objectives.
- [x] Confirm docs do not claim live implementation exists.
- [x] Confirm no secrets or credentials have been committed.
- [x] Confirm no product code or workflow JSON was added beyond folder markers.

### Risks / Notes

- Empty folders require `.gitkeep` files so GitHub keeps them.
- n8n credentials must never be exported into repo workflow JSON.
- The architecture is intentionally ambitious; Codex should implement it in small verified slices.
- The next build should focus on schemas, fixtures, and validation before plugin/n8n feature code.

---

## v0.2.0 — Contract & Mock Foundation

Status: `Complete`
Branch: `feature/v0.2.0-contract-foundation`
Date Created: `2026-05-12`
Date Completed: `2026-05-12`

### Goal

Create the first buildable contract layer for the AI Image Generator system so WordPress, n8n, ImageManager, fixtures, and future provider integrations can all share predictable packet shapes.

This build should make the project testable without live AI calls, live n8n credentials, or WordPress feature code. It is the bridge between the documentation-only foundation and the first working mock loop.

### Scope

Included:

- Create JSON schemas for the major workflow packets.
- Create safe mock fixtures for valid and invalid packet examples.
- Add a local validation script that checks fixtures against schemas.
- Document the schema purpose and mock-mode contract rules.
- Keep the build provider-free, credential-free, and implementation-light.

Out of scope:

- WordPress plugin UI or job submission features.
- Live n8n workflow exports.
- Live Perplexity, vision, or image generation provider calls.
- ImageManager prompt implementation beyond schema support.
- Client question UI.
- Image output generation.

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

Fixtures:

- `n8n/test-fixtures/client-submission.valid.json`
- `n8n/test-fixtures/job-state.valid.json`
- `n8n/test-fixtures/stage-result.input-analysis.valid.json`
- `n8n/test-fixtures/validation-result.valid.json`
- `n8n/test-fixtures/imagemanager-decision.continue.valid.json`
- `n8n/test-fixtures/imagemanager-decision.ask-client.valid.json`
- `n8n/test-fixtures/imagemanager-decision.invalid-decision.invalid.json`
- `n8n/test-fixtures/rework-request.visual.valid.json`
- `n8n/test-fixtures/final-result.valid.json`

Scripts and tests:

- `scripts/validate-fixtures.js`
- `tests/schema-validation.test.js` or equivalent lightweight test harness
- `package.json` only if needed to run schema validation consistently

Docs:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/WORKFLOW_OVERVIEW.md`
- `docs/IMAGE_MANAGER.md`
- `docs/CODEX_BUILD_QUEUE.md`
- `docs/BUILD_QUEUE.md`
- `docs/BUILD_PLANS.md`

### Implementation Steps

1. Create the `feature/v0.2.0-contract-foundation` branch from `main`.
2. Add the `schemas/`, `scripts/`, `tests/`, and `n8n/test-fixtures/` folders as intentional build outputs.
3. Define shared schema conventions: IDs, timestamps, status enums, stage names, evidence fields, validation severity, and reusable definitions.
4. Implement `client_submission.schema.json` for WordPress-to-n8n intake packets.
5. Implement `job_state.schema.json` as the central state object used by the Master Job Controller.
6. Implement `stage_result.schema.json` and `validation_result.schema.json` for specialist workflow outputs and validation reports.
7. Implement `imagemanager_decision.schema.json` with strict allowed decisions and conditional rules for `ask_client`, retry, repair, rework, and approval.
8. Implement `client_question.schema.json` and `client_answer.schema.json` for the pause/resume loop.
9. Implement `rework_request.schema.json` and `final_result.schema.json` for later rework and completion flows.
10. Add valid fixtures that represent the happy-path mock workflow.
11. Add invalid fixtures for the highest-risk routing failures, especially unknown ImageManager decisions and missing client questions.
12. Add a validation script that loads every fixture, selects the matching schema, and verifies expected pass/fail behavior.
13. Add a test command and document how to run it.
14. Update docs to explain that schemas are the source of truth for the next plugin and n8n builds.
15. Run validation locally and fix any schema or fixture mismatch.

### Acceptance Criteria

- [x] All planned schema files exist.
- [x] All schema files are valid JSON.
- [x] Schema validation supports draft 2020-12 or another documented JSON Schema version.
- [x] Valid fixtures pass validation.
- [x] Invalid fixtures fail validation for the expected reason.
- [x] ImageManager decisions are restricted to the approved decision names.
- [x] `ask_client` decisions require a client question.
- [x] Retry, repair, and targeted rework decisions require a target stage and repair instructions where appropriate.
- [x] `approve_final` cannot pass without final validation evidence.
- [x] Job state includes loop counters and preserves validation, generation, question, rework, and final output history.
- [x] Docs identify the schemas as the contract source of truth.
- [x] No provider calls, credentials, webhook secrets, or production payloads are added.

### Test Plan

- [x] Run JSON syntax validation across `schemas/**/*.json` and `n8n/test-fixtures/**/*.json`.
- [x] Run fixture validation script.
- [x] Confirm every `.valid.json` fixture passes.
- [x] Confirm every `.invalid.json` fixture fails.
- [x] Manually inspect ImageManager schema conditionals for routing safety.
- [x] Confirm no secrets or credential-like values were committed.
- [x] Confirm no plugin feature code or live n8n workflow JSON was added.

### Risks / Notes

- The schemas should be strict enough to protect workflow routing but not so rigid that future planning stages become painful to extend.
- Prefer reusable schema definitions for common fields such as evidence, assets, statuses, stage names, and validation issues.
- Keep fixture data fake and safe; do not use real client images, real private URLs, or production webhook payloads.
- If adding `package.json`, keep it minimal and only include tooling needed for schema validation.
- This build should finish before the WordPress intake shell or n8n skeleton begins.

---

## v0.3.0 through v1.0.0 — Stable Mock-First MVP

Status: `Complete`
Branch: `feature/v1.0.0-mock-mvp`
Date Created: `2026-05-12`
Date Completed: `2026-05-12`

### Goal

Build the remaining roadmap as a stable mock-first MVP without adding production credentials or live provider calls.

### Scope

Included:

- WordPress intake shell.
- n8n mock master workflow export.
- ImageManager prompt files and decision routing.
- Client question and answer packet flow.
- Mock research, input intelligence, planning, generation, validation, and rework layers.
- Automated schema, workflow, plugin-shell, simulator, and smoke checks.
- Documentation, limitations, and security review pass.

Out of scope:

- Live Perplexity calls.
- Live image generation provider calls.
- Production n8n credentials.
- Full WordPress runtime verification in this container.

### Acceptance Criteria

- [x] WordPress shell exposes settings, intake, status, client answer, and rework surfaces.
- [x] n8n workflow JSON is valid and contains no credentials.
- [x] ImageManager decisions validate against the approved schema.
- [x] Poor-quality input can route to client clarification.
- [x] Mock research has evidence and can be skipped for visual-only rework.
- [x] Planning can pass or fail and produce repair instructions.
- [x] Mock image generation records attempts and final validation.
- [x] Targeted rework routes visual, placement, object, and function changes differently.
- [x] Known limitations are documented.
- [x] Security review notes are documented.
- [x] Smoke test passes.

### Test Plan

- [x] `npm run validate:fixtures`
- [x] `npm run validate:workflow`
- [x] `npm test`
- [x] `npm run smoke`
- [x] `git diff --check`
- [x] Static secret scan excluding `node_modules/`

### Risks / Notes

- PHP is unavailable in this container, so WordPress activation needs to be verified in a real WordPress environment.
- The MVP is deliberately mock-first. Live providers should be added through adapters that preserve the v0.2 schema contracts.

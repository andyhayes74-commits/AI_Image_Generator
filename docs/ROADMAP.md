# Project Roadmap

This roadmap defines planned versions and major development direction for AI Image Generator.

The project is a universal WordPress + n8n system for AI-assisted scene integration. It is not a simple one-shot image generator.

The roadmap is the strategic map. The build queue is the active task list.

---

## Version Status Key

| Status | Meaning |
|---|---|
| Planned | Not started yet |
| Active | Currently being built |
| Testing | Code complete, under review/testing |
| Complete | Built, merged, and accepted |
| Deferred | Moved to a later version |
| Cancelled | No longer planned |

---

## Current Version

Current active version: `v1.0.0`

Status: `Complete`

---

## v0.1.0 — Foundation & Architecture Lock

Status: `Complete`

### Goal

Create the first stable project foundation and lock the real system objective: a scene-aware, validation-driven object integration workflow using WordPress, n8n, ImageManager, specialist AI systems, iterative loops, and targeted rework.

### Included

- [x] Shared repo structure for plugin, n8n, and docs.
- [x] README updated with correct objectives.
- [x] Architecture draft.
- [x] Workflow overview draft.
- [x] ImageManager draft design.
- [x] Codex build queue.
- [x] Bug tracker and build tracking docs.

### Out of Scope

- Product feature code.
- Live n8n workflow JSON.
- Live AI provider integration.
- Image generation implementation.
- WordPress plugin implementation beyond folder scaffold.
- Schemas and automated tests unless covered by a later build.

### Acceptance Criteria

- [x] Repo clearly separates plugin and n8n workflow areas.
- [x] README states the project is a scene-aware object integration system.
- [x] Architecture docs describe input analysis, research, placement, collision, functional use, environmental effects, looping, rework, and ImageManager.
- [x] Codex has a clear build queue.
- [x] No secrets or credentials are committed.
- [x] No product feature code has been started accidentally.

---

## v0.2.0 — Contract & Schema Foundation

Status: `Complete`

### Goal

Create the formal data contracts that allow Codex, WordPress, and n8n to build safely against predictable packet shapes.

### Included

- [x] `schemas/job_state.schema.json`.
- [x] `schemas/client_submission.schema.json`.
- [x] `schemas/stage_result.schema.json`.
- [x] `schemas/validation_result.schema.json`.
- [x] `schemas/imagemanager_decision.schema.json`.
- [x] `schemas/client_question.schema.json`.
- [x] `schemas/client_answer.schema.json`.
- [x] `schemas/rework_request.schema.json`.
- [x] `schemas/final_result.schema.json`.
- [x] Safe fixture examples.
- [x] Basic schema validation script/test.

### Out of Scope

- Live provider calls.
- Full plugin UI.
- Full n8n implementation.
- Image generation.

### Acceptance Criteria

- [x] Schemas exist and are valid JSON.
- [x] Fixtures validate against schemas.
- [x] Invalid fixture examples fail where expected.
- [x] Docs explain each contract.
- [x] Mock mode is documented.

---

## v0.3.0 — WordPress Intake Shell

Status: `Complete`

### Goal

Build the first WordPress plugin shell that can collect client information and prepare a structured job packet.

### Included

- [x] Main plugin file.
- [x] Admin settings page.
- [x] n8n webhook URL setting.
- [x] Secret/token setting handled safely.
- [x] Basic job storage.
- [x] Client/admin submission form.
- [x] Upload support for scene images, object references, sketches, annotations, and manuals.
- [x] Basic job status display.

### Out of Scope

- Live image generation.
- Advanced client accounts.
- Payment systems.
- Full design polish.

### Acceptance Criteria

- [x] Plugin activates without fatal errors.
- [x] Settings page loads.
- [x] Job form renders.
- [x] Submitted data is sanitised.
- [x] Job packet matches schema.
- [x] No private prompts or provider secrets are exposed to the front end.

---

## v0.4.0 — n8n Skeleton & Mock Loop

Status: `Complete`

### Goal

Create the first n8n workflow skeleton that receives a WordPress job and runs a mock end-to-end loop.

### Included

- [x] Master Job Controller workflow export.
- [x] Mock input analysis.
- [x] Mock research/planning.
- [x] Mock validation.
- [x] Mock final result response.
- [x] Safe test payloads.

### Out of Scope

- Live provider calls.
- Real image generation.
- Complex sub-workflow split.

### Acceptance Criteria

- [x] n8n workflow JSON imports cleanly.
- [x] Webhook accepts schema-shaped job packet.
- [x] Workflow can return mock status/result to WordPress.
- [x] No credentials are included in workflow exports.

---

## v0.5.0 — Client Question Loop & ImageManager MVP

Status: `Complete`

### Goal

Add the bounded ImageManager decision node and the ability for n8n to ask the client a question through WordPress.

### Included

- [x] ImageManager prompt draft in repo.
- [x] ImageManager decision schema validation.
- [x] Allowed decision routing.
- [x] Client question packet.
- [x] WordPress question display.
- [x] Client answer endpoint.
- [x] Resume workflow after answer.

### Out of Scope

- Complex autonomous multi-agent system.
- External ImageManager service.
- Direct ImageManager provider/tool access.

### Acceptance Criteria

- [x] ImageManager only returns allowed decision names.
- [x] Invalid decisions are rejected.
- [x] n8n can set job status to `awaiting_client_answer`.
- [x] Client answer resumes the job.
- [x] Loop limits exist.

---

## v0.6.0 — Research & Input Intelligence

Status: `Complete`

### Goal

Add real or mockable research and input-file classification layers.

### Included

- [x] Input file analysis for scene images, object references, sketches, annotations, manuals, and unknowns.
- [x] Research worker prepared for Perplexity integration.
- [x] Source/evidence fields.
- [x] Missing-information detection.
- [x] Client clarification routing where needed.

### Acceptance Criteria

- [x] Poor-quality object references are detected.
- [x] Placement sketches are interpreted as intent.
- [x] Research output has confidence and source fields.
- [x] Research can be skipped on visual-only rework.

---

## v0.7.0 — Planning, Collision, Functional Use & Environmental Effects

Status: `Complete`

### Goal

Create the planning layers that make the system physically and visually plausible.

### Included

- [x] Placement candidate generation.
- [x] Scale estimation.
- [x] Perspective planning.
- [x] Collision validation.
- [x] Scene reengineering plan.
- [x] Functional use planning.
- [x] Environmental consequence planning.
- [x] Composition blueprint output.

### Acceptance Criteria

- [x] Object placement can pass/fail validation.
- [x] Collision failures produce repair instructions.
- [x] Functional requirements such as cables, tubes, mounting, and screens are represented.
- [x] Environmental effects such as TV glow or lamp light are planned.

---

## v0.8.0 — Image Generation & Final Validation Loop

Status: `Complete`

### Goal

Connect the validated composition blueprint to an image generation/editing provider and validate the result.

### Included

- [x] Image generation/editing integration.
- [x] Generation attempt records.
- [x] Final image validation.
- [x] Targeted repair loop.
- [x] Final image return to WordPress.

### Acceptance Criteria

- [x] First mock generated image can be produced from a validated blueprint.
- [x] Final validation can pass/fail.
- [x] Failures route to targeted repair rather than full restart.
- [x] Final image is visible in WordPress packet/status surfaces.

---

## v0.9.0 — Targeted Rework Layer

Status: `Complete`

### Goal

Allow client/admin rework requests to reuse validated work and rerun only affected stages.

### Included

- [x] Rework request intake.
- [x] Rework classification.
- [x] Dependency checker.
- [x] Version history.
- [x] Targeted visual rework.
- [x] Placement/object/function rework routing.

### Acceptance Criteria

- [x] “Make the scene brighter” does not rerun research.
- [x] Placement rework reruns placement/collision/perspective.
- [x] Object-change rework reruns object analysis/research as needed.
- [x] Previous image versions are preserved.

---

## v1.0.0 — Stable MVP Release

Status: `Complete`

### Goal

Prepare a stable portfolio-ready MVP of the scene integration system.

### Included

- [x] Stable WordPress intake and result portal.
- [x] Stable n8n mock workflow path.
- [x] ImageManager decision layer.
- [x] Client question loop.
- [x] Research and validation layers.
- [x] Image generation and final QA.
- [x] Rework support.
- [x] Documentation pass.
- [x] Security and secrets review.

### Acceptance Criteria

- [x] All critical bugs closed.
- [x] Manual smoke test completed.
- [x] Known limitations listed.
- [x] Docs complete enough for Codex and a human maintainer.
- [x] No secrets exposed in repo or logs.

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

Current active version: `v0.1.0`

Status: `Planning`

---

## v0.1.0 — Foundation & Architecture Lock

Status: `Active`

### Goal

Create the first stable project foundation and lock the real system objective: a scene-aware, validation-driven object integration workflow using WordPress, n8n, ImageManager, specialist AI systems, iterative loops, and targeted rework.

### Included

- [ ] Shared repo structure for plugin, n8n, and docs.
- [ ] README updated with correct objectives.
- [ ] Architecture draft.
- [ ] Workflow overview draft.
- [ ] ImageManager draft design.
- [ ] Codex build queue.
- [ ] Bug tracker and build tracking docs.

### Out of Scope

- Product feature code.
- Live n8n workflow JSON.
- Live AI provider integration.
- Image generation implementation.
- WordPress plugin implementation beyond folder scaffold.
- Schemas and automated tests unless covered by a later build.

### Acceptance Criteria

- [ ] Repo clearly separates plugin and n8n workflow areas.
- [ ] README states the project is a scene-aware object integration system.
- [ ] Architecture docs describe input analysis, research, placement, collision, functional use, environmental effects, looping, rework, and ImageManager.
- [ ] Codex has a clear build queue.
- [ ] No secrets or credentials are committed.
- [ ] No product feature code has been started accidentally.

---

## v0.2.0 — Contract & Schema Foundation

Status: `Planned`

### Goal

Create the formal data contracts that allow Codex, WordPress, and n8n to build safely against predictable packet shapes.

### Included

- [ ] `schemas/job_state.schema.json`.
- [ ] `schemas/client_submission.schema.json`.
- [ ] `schemas/stage_result.schema.json`.
- [ ] `schemas/validation_result.schema.json`.
- [ ] `schemas/imagemanager_decision.schema.json`.
- [ ] `schemas/client_question.schema.json`.
- [ ] `schemas/client_answer.schema.json`.
- [ ] `schemas/rework_request.schema.json`.
- [ ] `schemas/final_result.schema.json`.
- [ ] Safe fixture examples.
- [ ] Basic schema validation script/test.

### Out of Scope

- Live provider calls.
- Full plugin UI.
- Full n8n implementation.
- Image generation.

### Acceptance Criteria

- [ ] Schemas exist and are valid JSON.
- [ ] Fixtures validate against schemas.
- [ ] Invalid fixture examples fail where expected.
- [ ] Docs explain each contract.
- [ ] Mock mode is documented.

---

## v0.3.0 — WordPress Intake Shell

Status: `Planned`

### Goal

Build the first WordPress plugin shell that can collect client information and prepare a structured job packet.

### Included

- [ ] Main plugin file.
- [ ] Admin settings page.
- [ ] n8n webhook URL setting.
- [ ] Secret/token setting handled safely.
- [ ] Basic job storage.
- [ ] Client/admin submission form.
- [ ] Upload support for scene images, object references, sketches, annotations, and manuals.
- [ ] Basic job status display.

### Out of Scope

- Live image generation.
- Advanced client accounts.
- Payment systems.
- Full design polish.

### Acceptance Criteria

- [ ] Plugin activates without fatal errors.
- [ ] Settings page loads.
- [ ] Job form renders.
- [ ] Submitted data is sanitised.
- [ ] Job packet matches schema.
- [ ] No private prompts or provider secrets are exposed to the front end.

---

## v0.4.0 — n8n Skeleton & Mock Loop

Status: `Planned`

### Goal

Create the first n8n workflow skeleton that receives a WordPress job and runs a mock end-to-end loop.

### Included

- [ ] Master Job Controller workflow export.
- [ ] Mock input analysis.
- [ ] Mock research/planning.
- [ ] Mock validation.
- [ ] Mock final result response.
- [ ] Safe test payloads.

### Out of Scope

- Live provider calls.
- Real image generation.
- Complex sub-workflow split.

### Acceptance Criteria

- [ ] n8n workflow JSON imports cleanly.
- [ ] Webhook accepts schema-shaped job packet.
- [ ] Workflow can return mock status/result to WordPress.
- [ ] No credentials are included in workflow exports.

---

## v0.5.0 — Client Question Loop & ImageManager MVP

Status: `Planned`

### Goal

Add the bounded ImageManager decision node and the ability for n8n to ask the client a question through WordPress.

### Included

- [ ] ImageManager prompt draft in repo.
- [ ] ImageManager decision schema validation.
- [ ] Allowed decision routing.
- [ ] Client question packet.
- [ ] WordPress question display.
- [ ] Client answer endpoint.
- [ ] Resume workflow after answer.

### Out of Scope

- Complex autonomous multi-agent system.
- External ImageManager service.
- Direct ImageManager provider/tool access.

### Acceptance Criteria

- [ ] ImageManager only returns allowed decision names.
- [ ] Invalid decisions are rejected.
- [ ] n8n can set job status to `awaiting_client_answer`.
- [ ] Client answer resumes the job.
- [ ] Loop limits exist.

---

## v0.6.0 — Research & Input Intelligence

Status: `Planned`

### Goal

Add real or mockable research and input-file classification layers.

### Included

- [ ] Input file analysis for scene images, object references, sketches, annotations, manuals, and unknowns.
- [ ] Research worker prepared for Perplexity integration.
- [ ] Source/evidence fields.
- [ ] Missing-information detection.
- [ ] Client clarification routing where needed.

### Acceptance Criteria

- [ ] Poor-quality object references are detected.
- [ ] Placement sketches are interpreted as intent.
- [ ] Research output has confidence and source fields.
- [ ] Research can be skipped on visual-only rework.

---

## v0.7.0 — Planning, Collision, Functional Use & Environmental Effects

Status: `Planned`

### Goal

Create the planning layers that make the system physically and visually plausible.

### Included

- [ ] Placement candidate generation.
- [ ] Scale estimation.
- [ ] Perspective planning.
- [ ] Collision validation.
- [ ] Scene reengineering plan.
- [ ] Functional use planning.
- [ ] Environmental consequence planning.
- [ ] Composition blueprint output.

### Acceptance Criteria

- [ ] Object placement can pass/fail validation.
- [ ] Collision failures produce repair instructions.
- [ ] Functional requirements such as cables, tubes, mounting, and screens are represented.
- [ ] Environmental effects such as TV glow or lamp light are planned.

---

## v0.8.0 — Image Generation & Final Validation Loop

Status: `Planned`

### Goal

Connect the validated composition blueprint to an image generation/editing provider and validate the result.

### Included

- [ ] Image generation/editing integration.
- [ ] Generation attempt records.
- [ ] Final image validation.
- [ ] Targeted repair loop.
- [ ] Final image return to WordPress.

### Acceptance Criteria

- [ ] First real generated image can be produced from a validated blueprint.
- [ ] Final validation can pass/fail.
- [ ] Failures route to targeted repair rather than full restart.
- [ ] Final image is visible in WordPress.

---

## v0.9.0 — Targeted Rework Layer

Status: `Planned`

### Goal

Allow client/admin rework requests to reuse validated work and rerun only affected stages.

### Included

- [ ] Rework request intake.
- [ ] Rework classification.
- [ ] Dependency checker.
- [ ] Version history.
- [ ] Targeted visual rework.
- [ ] Placement/object/function rework routing.

### Acceptance Criteria

- [ ] “Make the scene brighter” does not rerun research.
- [ ] Placement rework reruns placement/collision/perspective.
- [ ] Object-change rework reruns object analysis/research as needed.
- [ ] Previous image versions are preserved.

---

## v1.0.0 — Stable MVP Release

Status: `Planned`

### Goal

Prepare a stable portfolio-ready MVP of the scene integration system.

### Included

- [ ] Stable WordPress intake and result portal.
- [ ] Stable n8n mock/live workflow path.
- [ ] ImageManager decision layer.
- [ ] Client question loop.
- [ ] Research and validation layers.
- [ ] Image generation and final QA.
- [ ] Rework support.
- [ ] Documentation pass.
- [ ] Security and secrets review.

### Acceptance Criteria

- [ ] All critical bugs closed.
- [ ] Manual smoke test completed.
- [ ] Known limitations listed.
- [ ] Docs complete enough for Codex and a human maintainer.
- [ ] No secrets exposed in repo or logs.

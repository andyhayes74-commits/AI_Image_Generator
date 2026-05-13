# Live v1 Roadmap

This roadmap starts from the current `v1.0.0` branch and defines the work required to bring AI Image Generator in line with the original v1.0 system intention:

> A working WordPress + n8n scene-aware object integration MVP with schema-shaped packets, bounded ImageManager routing, client questions, research/planning/validation loops, image generation, final QA, and targeted rework.

The current `v1.0.0` branch is a stable mock-first MVP. It is useful, but it is not yet the live-intent v1.0 described by the architecture docs.

---

## Version Status Key

| Status | Meaning |
|---|---|
| Planned | Not started yet |
| Active | Currently being built |
| Testing | Code complete, under review/testing |
| Complete | Built, verified, and accepted |
| Deferred | Intentionally moved later |
| Blocked | Cannot proceed without an external dependency |

---

## v1.0.0 — Mock-First Baseline Audit

Status: `Complete`

### Goal

Lock the current state as the baseline for live v1 work.

### Baseline Truth

- Schemas, fixtures, mock simulator, prompt files, and static tests exist.
- WordPress plugin shell exists but has not been activated in a real WordPress environment.
- n8n workflow export is a mock skeleton and does not yet route through ImageManager.
- Final result packets in the n8n mock workflow do not yet fully match `final_result.schema.json`.
- Live Perplexity, vision, and image generation providers are not connected.

### Acceptance Criteria

- [x] Audit findings are documented.
- [x] Known limitations are acknowledged.
- [x] New live-intent roadmap exists.

---

## v1.0.1 — Documentation Truth Pass

Status: `Complete`

### Goal

Correct over-claimed completion language so docs distinguish between the mock-first MVP and the live-intent MVP.

### Included

- Reclassify current `v1.0.0` as `Stable Mock-First Baseline`.
- Update `docs/ROADMAP.md` to point to this live roadmap for productionisation.
- Add audit findings to `docs/BUGS.md` or a dedicated audit log.
- Mark live-provider and real runtime acceptance criteria as planned, not complete.

### Acceptance Criteria

- [x] No roadmap item claims real WordPress/n8n/provider behavior unless verified.
- [x] Mock-first accomplishments remain credited.
- [x] Missing live-intent pieces are tracked as concrete work.

---

## v1.1.0 — WordPress Runtime & Contract Hardening

Status: `Complete`

### Goal

Turn the plugin shell into a verified WordPress intake and result portal that produces schema-valid packets and handles media safely.

### Included

- Run plugin in a real WordPress test environment.
- Add PHP lint and WordPress activation checks.
- Replace filename-only upload representation with WordPress media handling.
- Store uploaded scene, object, sketch, annotation, and manual files as media/attachments.
- Validate generated client submission packets against `client_submission.schema.json`.
- Add nonce and capability checks for admin and client flows.
- Add job detail screen with packet, status, questions, answers, rework requests, and final outputs.
- Add final image/version display from `final_result` packets.

### Acceptance Criteria

- [x] Plugin activates without fatal errors in WordPress.
- [x] Settings page, job form, job list, and job detail views render.
- [x] Submitted job packets validate against schema.
- [x] Uploaded assets are stored and referenced safely through WordPress media APIs.
- [x] Client answer and rework endpoints are permission-checked.
- [x] No private prompts, provider secrets, or webhook secrets are exposed to the front end.

### Validation

- `npm run lint:php`
- `npm run smoke:wordpress`
- WordPress plugin activation in `/tmp/aiig-wp`
- `npm test`

---

## v1.2.0 — n8n Contract-True Mock Workflow

Status: `Complete`

### Goal

Replace the placeholder n8n mock skeleton with an importable workflow that returns schema-valid stage, validation, decision, question, and final-result packets.

### Included

- Master Job Controller workflow with explicit stages.
- Schema-shaped input analysis result.
- Schema-shaped research/planning result.
- Schema-shaped generation attempt and final result.
- Client question branch.
- Rework branch.
- Status callbacks to WordPress.
- Workflow JSON validation beyond parse-only checks.

### Acceptance Criteria

- [x] n8n workflow imports cleanly.
- [x] Webhook accepts a `client_submission` fixture in the mock contract path.
- [x] Every stage result validates against `stage_result.schema.json`.
- [x] Final result validates against `final_result.schema.json`.
- [x] Workflow can return `awaiting_client_answer` and resume with `client_answer` in the simulator path.
- [x] No credentials or production webhook URLs exist in workflow exports.

### Validation

- `npm run validate:workflow`
- `npm run validate:n8n-import`
- `npm run validate:fixtures`
- `npm test`

---

## v1.3.0 — ImageManager Node & Routing

Status: `Complete`

### Goal

Implement ImageManager as the bounded decision layer inside n8n rather than only as prompts and simulator logic.

### Included

- ImageManager input packet builder.
- AI node or mock node using `n8n/prompts/imagemanager.system.md`.
- JSON parsing and schema validation of ImageManager output.
- Router/switch node for allowed decisions.
- Loop counters and max-attempt escalation.
- Fixtures for continue, ask_client, repair_stage, request_admin_review, approve_final, and targeted rework.

### Acceptance Criteria

- [x] Unknown decision names are rejected.
- [x] `ask_client` requires a schema-valid client question.
- [x] Retry/repair/rework decisions require target stage and repair instructions.
- [x] `approve_final` requires passing final validation evidence.
- [x] Max loop limits escalate instead of retrying forever.
- [x] ImageManager has no direct WordPress, file, credential, Perplexity, or image model access.

### Validation

- `npm run validate:workflow`
- `npm run validate:n8n-import`
- `npm test`

---

## v1.4.0 — Input Intelligence & Research Workers

Status: `Blocked`

### Goal

Implement real or provider-backed input analysis and research workers behind the existing contracts.

### Blocker

The mock input intelligence and research contracts are already covered by fixtures and simulator tests, but the live-intent version requires a configured research/vision provider. No provider credential or provider choice is available in the repo, and the documentation explicitly forbids committing secrets.

### Included

- File role classification for scene, object reference, object sketch, placement sketch, annotation, manual, style reference, and unknown.
- Quality detection for poor/blurry/missing references.
- Placement sketches treated as intent, not proof.
- Research provider adapter for product dimensions and usage requirements.
- Source/evidence fields with confidence.
- Client clarification routing for missing or ambiguous inputs.

### Acceptance Criteria

- [ ] Poor-quality object references trigger `ask_client` or reconstruction permission.
- [ ] Manuals/specs can contribute evidence.
- [ ] Research output has source, confidence, and uncertainty fields.
- [ ] Visual-only rework can skip research.
- [ ] Provider failures return schema-shaped errors without breaking the workflow.

---

## v1.5.0 — Scene/Object Planning & Composition Blueprint

Status: `Planned`

### Goal

Build the real planning layers that make object insertion physically plausible and controlled before generation.

### Included

- Scene analysis: surfaces, planes, perspective, lighting, sockets, clutter, protected elements.
- Object analysis and reconstruction plan.
- Placement candidate generation.
- Scale and perspective estimation.
- Collision and clearance validation.
- Scene reengineering plan for movable clutter/obstacles.
- Functional use plan for cables, tubes, mounts, active screens, controls.
- Environmental consequence plan for light, shadows, reflections, dirt, wear.
- Composition blueprint output.

### Acceptance Criteria

- [ ] Object placement can pass and fail validation with repair instructions.
- [ ] Client placement sketches are treated as intent.
- [ ] Protected scene elements are preserved unless client/admin allows changes.
- [ ] Functional requirements are represented in the blueprint.
- [ ] Environmental effects are represented in the blueprint.
- [ ] Blueprint is schema-shaped and generation-ready.

---

## v1.6.0 — Image Generation & Final Validation

Status: `Planned`

### Goal

Connect a real image generation/editing provider to the validated composition blueprint and validate the output.

### Included

- Provider adapter for image generation/editing.
- Mock mode retained.
- Generation attempt records.
- Final image asset storage and WordPress return packet.
- Vision/model-backed final validation.
- Targeted repair loop for failed generation or validation.
- Provider error handling.

### Acceptance Criteria

- [ ] First real generated image can be produced from a validated blueprint.
- [ ] Final result validates against `final_result.schema.json`.
- [ ] Final validation can pass/fail with issues and repair instructions.
- [ ] Failed validation routes to targeted repair, not full restart by default.
- [ ] Final image is visible in WordPress.
- [ ] Provider secrets remain outside the repo.

---

## v1.7.0 — Client Question & Resume Loop

Status: `Planned`

### Goal

Make the pause/resume loop operational across WordPress and n8n.

### Included

- n8n sends `client_question` packet to WordPress.
- WordPress stores and displays open questions.
- Client submits schema-valid answer.
- n8n receives `client_answer` and resumes the correct job.
- Question/answer history remains attached to job state.

### Acceptance Criteria

- [ ] Job status changes to `awaiting_client_answer`.
- [ ] Client can answer from WordPress.
- [ ] n8n resumes the same job with answer attached.
- [ ] Answered questions are not asked repeatedly.
- [ ] Admin can see question and answer history.

---

## v1.8.0 — Targeted Rework & Version History

Status: `Planned`

### Goal

Make client/admin rework operational without restarting the whole workflow unnecessarily.

### Included

- Rework request intake in WordPress.
- Rework classification in n8n/ImageManager.
- Dependency checker for previous stage reuse.
- Version history for generated outputs.
- Visual-only, placement, object, and function rework routes.

### Acceptance Criteria

- [ ] “Make the scene brighter” does not rerun research or placement.
- [ ] Placement rework reruns placement, collision, perspective, functional use, environmental effects, generation, and validation.
- [ ] Object-change rework reruns object analysis and research where needed.
- [ ] Previous image versions are preserved and visible.
- [ ] Rework output validates as a new final result version.

---

## v1.9.0 — Security, Operations & Cost Controls

Status: `Planned`

### Goal

Prepare the live MVP for safe portfolio/demo operation.

### Included

- Webhook HMAC verification with timestamp/replay protection.
- Rate limits/spam protection.
- Admin-only provider settings.
- Secrets stored outside repo.
- Provider timeout/retry policies.
- Cost controls and usage logging.
- Error handling and admin review paths.
- Redacted logs.

### Acceptance Criteria

- [ ] No secrets appear in repo, workflow exports, logs, or front-end output.
- [ ] Webhook requests are authenticated.
- [ ] Provider failures are visible to admins and safe for clients.
- [ ] Cost limits prevent runaway loops.
- [ ] Admin review path catches blocked jobs.

---

## v2.0.0 — Live-Intent MVP Release

Status: `Planned`

### Goal

Release the first live system that matches the original v1.0 intention from the documentation.

### Included

- Verified WordPress intake and result portal.
- Importable n8n workflow with schema-shaped routing.
- Bounded ImageManager decision node.
- Client question/resume loop.
- Real input intelligence and research adapters.
- Real planning and validation layers.
- Real image generation/editing provider adapter.
- Final QA and targeted repair loop.
- Targeted rework with version history.
- Security and operations pass.

### Acceptance Criteria

- [ ] End-to-end live smoke test completed from WordPress submission to final image display.
- [ ] Mock mode still passes all regression tests.
- [ ] All schema fixtures pass.
- [ ] n8n workflow exports contain no credentials.
- [ ] Known limitations are updated.
- [ ] Critical bugs are closed or explicitly deferred.
- [ ] Human maintainer can run, verify, and extend the system from docs.

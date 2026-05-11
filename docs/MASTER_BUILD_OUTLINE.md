# Master Build Outline

Status: `Draft`
Purpose: Documentation-only master outline for the full project build.

This document is a planning reference, not an implementation artifact. It does not create product code, workflow JSON, schemas, fixtures, prompts, or executable tests.

---

## 1. Project Summary

AI Image Generator is a universal WordPress + n8n AI scene integration engine.

The system is intended to let clients submit a real scene, target objects, references, sketches, annotations, written constraints, documents, and rework requests through WordPress. n8n then orchestrates the analysis, research, planning, validation, generation, repair loops, and final return of image versions.

This is not a simple one-shot image generator. The project goal is not just to make a visually plausible picture from a prompt. The goal is to integrate requested objects into real scenes in a way that is physically plausible, correctly scaled, perspective-matched, collision-free, functionally usable, environmentally coherent, and faithful to the client brief.

Core principle:

> Design first, generate second.

The workflow should understand the scene, the object, the client's intent, real-world constraints, and missing facts before image generation is attempted.

---

## 2. System Objectives

The complete system should support the following objectives:

- **WordPress client intake**: collect scene images, object references, sketches, annotations, documents, instructions, constraints, and rework requests through a safe client/admin interface.
- **n8n orchestration**: coordinate the full workflow state, route stages, manage retries, pause for client questions, and return final outputs.
- **ImageManager validation/routing**: use a bounded decision node to inspect structured job state, validation results, and available actions before choosing the next safe route.
- **Research layer**: investigate missing or uncertain object, environment, dimension, installation, usage, and compatibility facts before guessing.
- **Input file intelligence**: classify uploaded files, detect poor inputs, interpret labels, distinguish evidence from intent, and identify missing information.
- **Object reconstruction**: turn imperfect object photos, sketches, partial references, manuals, and written descriptions into a usable object plan.
- **Placement, scale, perspective, and collision**: determine where the object can physically fit, how large it should be, how it aligns to the scene perspective, and whether it collides with existing objects.
- **Functional use**: ensure the inserted object can work in the chosen position, including clearance, access, mounting, controls, screens, doors, cables, hoses, vents, tubes, plugs, brackets, or other functional requirements.
- **Environmental consequences**: plan realistic lighting, shadow, reflections, occlusion, contact points, dirt, wear, surface changes, screen glow, wall repair, or other scene responses caused by the inserted object.
- **Iterative validation loops**: validate each major stage and route failed stages back with targeted repair instructions.
- **Client question loop**: pause when the workflow would otherwise guess and ask the client for clarifying information.
- **Targeted rework layer**: handle post-result change requests by rerunning the smallest safe part of the workflow while preserving validated data and previous versions.
- **Final image return to WordPress**: deliver final image versions, status, metadata, and review/rework options back to the WordPress layer.

---

## 3. Repository Structure

### Existing Folders

```text
/
├── README.md
├── AGENTS.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BUGS.md
│   ├── BUILD_PLANS.md
│   ├── BUILD_QUEUE.md
│   ├── CODEX_BUILD_QUEUE.md
│   ├── IMAGE_MANAGER.md
│   ├── MASTER_BUILD_OUTLINE.md
│   ├── ROADMAP.md
│   └── WORKFLOW_OVERVIEW.md
├── n8n/
│   ├── notes/
│   └── workflows/
└── plugin/
```

Current repository areas:

- `plugin/` — planned WordPress plugin source area.
- `n8n/` — planned n8n workflow exports, notes, prompts, fixtures, and workflow documentation area.
- `n8n/workflows/` — planned location for exported workflow JSON once an approved build creates workflows.
- `n8n/notes/` — workflow notes and contracts.
- `docs/` — project control room for architecture, build plans, roadmap, queues, and design decisions.

### Future Folders To Add Later

The following folders are expected later, but should only be added by planned implementation tasks with clear scope and acceptance criteria:

```text
schemas/                 # Future JSON schemas for contracts and validation.
tests/                   # Future automated test suite.
scripts/                 # Future validation/import/smoke-test helpers.
n8n/prompts/             # Future approved prompt assets for n8n stages.
n8n/test-fixtures/       # Future safe fake n8n payloads and workflow fixtures.
plugin/tests/            # Future plugin-specific tests if needed.
```

These future folders should not be created as accidental placeholders. Add them only when a build plan explicitly authorises the relevant implementation slice.

---

## 4. Full Workflow Architecture

The planned full system contains 12 workflow areas:

1. **Master Job Controller** — receives jobs, creates/loads job state, calls ImageManager, routes stages, tracks loop counts, updates WordPress, and returns final outputs.
2. **Client Question / Resume Workflow** — asks the client for clarification, pauses the job, receives answers, attaches answers to job state, and resumes orchestration.
3. **Rework Request Workflow** — receives client/admin rework requests, classifies the request, preserves valid prior data, and routes targeted rework.
4. **Input File Analysis Workflow** — classifies uploaded files, checks quality, detects label mismatches, interprets sketches/annotations, and flags missing information.
5. **Research Workflow** — gathers missing or verifying object/environment facts, source-backed dimensions, installation requirements, usage constraints, and uncertainty markers.
6. **Scene Analysis Workflow** — analyses the source scene, including room type, surfaces, perspective, lighting, fixtures, obstacles, access, and environmental style.
7. **Object Analysis & Reconstruction Workflow** — analyses object references and reconstructs usable object identity, shape, dimensions, visible features, function, and unknowns.
8. **Placement / Scale / Collision Workflow** — proposes physical placements, checks scale and perspective, detects collisions, validates clearances, and recommends scene reengineering if needed.
9. **Scene Reengineering Workflow** — plans allowed scene changes, object moves/removals, background repair, protected constraints, and realism-preserving adjustments.
10. **Functional Use & Environmental Effects Workflow** — plans correct operation plus scene consequences such as cables, hoses, vents, mounting, shadows, reflections, glow, dirt, and wear.
11. **Image Generation Workflow** — builds the validated generation/edit package, calls the selected image provider in approved live mode, stores versions, and returns generation metadata.
12. **Final Validation / QA Workflow** — checks the generated output against the brief, object identity, placement, scale, perspective, collision, function, environment, artifacts, and unwanted scene drift.

### MVP Workflow Set

The first working system should be smaller than the full architecture. The MVP workflow set should prove the end-to-end loop before specialist workflows are split out:

1. Master Job Controller.
2. Input File Analysis.
3. Client Question / Resume.
4. Research + Planning.
5. Image Generation + Validation.

The MVP should prove this path:

```text
Submit job
→ analyse inputs
→ ask client if needed
→ research/plan
→ generate or mock-generate
→ validate
→ return result
```

### ImageManager Starting Position

ImageManager should start as a bounded n8n decision node inside the Master Job Controller.

It should read structured packets, choose from an allowed action list, return schema-validated JSON, and never directly access WordPress, files, credentials, research providers, or image generation providers. n8n remains the execution gatekeeper.

---

## 5. Data Contracts Required

Formal schemas should be introduced before plugin or n8n feature implementation. At minimum, the system needs contracts for:

- **`job_state`**: canonical workflow state, current status, stage history, loop counters, file references, validated data, generated versions, and blocking issues.
- **`client_submission`**: initial WordPress submission payload containing client instructions, uploaded file references, constraints, requested object details, and consent/metadata fields.
- **`stage_result`**: standard output envelope for any workflow stage, including status, findings, artifacts, uncertainty, validation needs, and recommended next steps.
- **`validation_result`**: validation report for a stage or final output, including pass/fail status, severity, checks run, issues found, and repair recommendations.
- **`imagemanager_decision`**: bounded decision response from ImageManager, including allowed decision name, target stage, reason, repair instructions, client-question fields, reuse flags, and next status.
- **`client_question`**: packet sent from n8n to WordPress when clarification is required, including question ID, text, answer type, allowed options, context, and due/status fields.
- **`client_answer`**: response packet from WordPress to n8n, including answer ID, question ID, answer content, uploaded follow-up files if any, and client/admin metadata.
- **`rework_request`**: client/admin change request after a draft or final result, including target version, requested changes, protected elements, urgency, and classification fields.
- **`final_result`**: final output packet returned to WordPress, including image versions, status, validation summary, metadata, warnings, and rework/approval availability.

---

## 6. Build Phases

### Phase 0: Docs and Architecture Lock

- Lock repository purpose and folder boundaries.
- Maintain architecture, workflow, ImageManager, roadmap, build queue, and master outline docs.
- Confirm no product code, schemas, workflow JSON, or provider calls are introduced accidentally.

### Phase 1: Schemas and Fixtures

- Create formal data contracts for the core payloads.
- Add safe fake fixtures for typical jobs, poor-quality inputs, missing information, client questions, validation failures, and rework requests.
- Add validation scripts or test commands that can run without providers.

### Phase 2: Plugin Shell

- Add the WordPress plugin skeleton.
- Create admin/client intake surfaces only after contracts exist.
- Implement sanitisation, nonce, permission, upload, and safe handoff foundations.
- Keep provider secrets and workflow internals out of front-end JavaScript.

### Phase 3: n8n Skeleton and Mock Loop

- Create importable n8n workflow skeletons once planned.
- Use mock mode and fixtures before live provider calls.
- Prove job receipt, state creation, stage routing, validation envelope handling, and return-to-WordPress flow.

### Phase 4: Client Question Loop

- Implement question creation, WordPress display, answer submission, n8n resume, and state update.
- Ensure the workflow pauses instead of guessing when key information is missing.

### Phase 5: ImageManager MVP

- Add bounded ImageManager decision behaviour.
- Validate ImageManager outputs against schema before routing.
- Enforce allowed decisions, loop counts, target stages, and escalation rules.

### Phase 6: Input Intelligence and Research

- Add file classification, evidence extraction, input quality checks, and missing-information detection.
- Add the first approved research provider integration in controlled mode.
- Require uncertainty and source markers where applicable.

### Phase 7: Planning and Validation Layers

- Build scene analysis, object reconstruction, placement, scale, perspective, collision, functional-use, and environmental consequence planning.
- Add validation gates after each major planning stage.
- Route failed checks to targeted repairs.

### Phase 8: Image Generation and Final Validation

- Add image generation/editing provider integration after mock-mode confidence.
- Build prompt/edit packages from validated composition blueprints.
- Validate generated results for brief match, physical plausibility, identity, placement, scale, perspective, collisions, function, environment, artifacts, and scene drift.

### Phase 9: Targeted Rework

- Add rework request intake and classification.
- Preserve validated data where safe.
- Rerun only the smallest safe stage subset.
- Keep previous versions available for comparison and rollback.

### Phase 10: Live Provider Integrations and Hardening

- Harden provider credential handling, rate limits, cost controls, retry policies, logging, and monitoring.
- Add production-safe storage, status, admin approval, and delivery behaviour.
- Expand automated and manual regression checks.

---

## 7. Testing Strategy

The project should become testable in layers before live providers are used:

- **Schema validation**: validate every core contract and reject malformed packets before routing.
- **Fixture validation**: run safe fake payloads through schemas and expected decision paths.
- **Plugin smoke tests**: check plugin activation, admin page loading, permissions, nonces, upload handling, sanitisation, and contract-shaped outbound payloads.
- **n8n import validation**: confirm workflow exports can be imported without credentials or production secrets.
- **Mock-mode workflow tests**: run fixture-based n8n paths without live research or image generation providers.
- **ImageManager decision tests**: verify allowed decisions, required fields, target stages, loop limits, client-question requirements, final-approval gating, and unavailable-action rejection.
- **Manual end-to-end checks**: submit representative jobs through WordPress, inspect n8n routing, confirm status updates, review generated/mock outputs, test client questions, and test targeted rework.

---

## 8. Guardrails

The following guardrails apply throughout the build:

- No secrets, API keys, credential exports, `.env` files, production webhook secrets, or private provider tokens in the repository.
- No live provider calls before mock mode and schema validation are working.
- No broad autonomous ImageManager access; ImageManager remains bounded, schema-driven, and routed by n8n.
- No unvalidated stage outputs should drive downstream workflow decisions.
- No infinite loops; every retry/repair path needs loop counters, maximum attempts, and escalation behaviour.
- No full restart for simple reworks; preserve validated data and rerun the smallest safe part of the workflow.
- No accidental placeholders; any scaffold must be explicitly approved and clearly marked as intentional.

---

## 9. Open Questions

These questions should be resolved through future build plans or decision records:

- Which image generation/editing provider will be used first?
- Where will final images and intermediate versions be stored?
- Will WordPress store canonical job state, or will n8n/database storage be the source of truth?
- How should client authentication and access to job pages work?
- Is admin approval required before final or draft images are delivered to the client?
- Which live research provider should be integrated first?

---

## 10. Next Recommended Build

Recommended next build: **v0.2.0 — Contract & Schema Foundation**.

Schemas and fixtures should come before plugin or n8n feature code because they define the payloads every later component must share. Without contracts, the WordPress plugin, n8n workflows, ImageManager decisions, validation reports, client question loop, rework layer, and final result handoff can drift into incompatible shapes.

The v0.2.0 build should focus on:

- Defining the first formal JSON schemas for required data contracts.
- Creating safe fake fixtures for common job and failure paths.
- Adding validation scripts or checks that run without live providers.
- Documenting contract ownership, versioning, and compatibility expectations.

This keeps the project contract-first, mock-first, and testable before product UI, workflow JSON, or live provider integrations are added.

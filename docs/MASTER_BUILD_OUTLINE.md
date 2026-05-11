# Master Build Outline

Status: Draft

Scope: Documentation-only planning baseline for the full project build.

## 1. Project Summary

This project is a universal WordPress + n8n AI scene integration engine. It is designed to accept client scene requests from WordPress, orchestrate multi-stage reasoning and validation in n8n, route decisions through an ImageManager layer, and return validated final image results back to WordPress.

It is not a simple image generator. The system must reason about scene intent, supplied files, object identity, placement, scale, perspective, collisions, functional use, environmental consequences, and client clarification needs before final image generation or editing occurs.

Core principle:

> Design first, generate second.

The system should produce images only after the request has been interpreted, planned, checked, and validated against project constraints. Image generation is a downstream execution step, not the primary intelligence of the platform.

## 2. System Objectives

The full system should support the following objectives:

1. **WordPress client intake**
   - Capture client project details, prompts, files, constraints, and desired outputs through a WordPress-facing interface.
   - Provide job status and final image delivery back to the client.

2. **n8n orchestration**
   - Coordinate the full job lifecycle through staged workflows.
   - Keep each stage bounded, inspectable, and testable.
   - Support mock-mode execution before live provider integrations.

3. **ImageManager validation/routing**
   - Begin as a bounded n8n decision node that validates stage readiness and routes the job to the next appropriate step.
   - Avoid broad autonomous access until the system has schemas, fixtures, tests, and safe operating boundaries.

4. **Research layer**
   - Gather and normalize contextual information required for accurate scene planning.
   - Support product, material, environment, style, and reference interpretation as needed.

5. **Input file intelligence**
   - Inspect supplied client files and references.
   - Determine what each file represents and how it should influence the job.
   - Distinguish source objects, inspiration references, style references, environment references, and unsupported inputs.

6. **Object reconstruction**
   - Reconstruct object requirements from client files, prompts, and research.
   - Preserve important identity, geometry, materials, branding, and functional constraints where applicable.

7. **Placement, scale, perspective, and collision**
   - Plan where objects belong in the target scene.
   - Validate proportions, camera angle, spatial relationships, occlusions, and collision risks.

8. **Functional use**
   - Reason about whether the scene makes sense for the object's purpose.
   - Account for access, mounting, visibility, ergonomics, operation, or other practical use constraints.

9. **Environmental consequences**
   - Account for lighting, shadows, reflections, weathering, background interaction, material response, and other environmental effects.

10. **Iterative validation loops**
    - Validate each major stage output before moving forward.
    - Route invalid or incomplete results to targeted correction instead of blindly continuing.

11. **Client question loop**
    - Ask the client only necessary clarification questions.
    - Pause or branch the job when required information is missing.
    - Resume the job after client answers are received.

12. **Targeted rework layer**
    - Support focused corrections to specific failed stages or image regions.
    - Avoid full restarts for simple rework requests.

13. **Final image return to WordPress**
    - Return final image metadata, status, and delivery links to WordPress once validation passes.

## 3. Repository Structure

### Existing repository structure

Current repository structure is intentionally minimal:

```text
README.md
docs/
  BUILD_QUEUE.md
  MASTER_BUILD_OUTLINE.md
```

`docs/BUILD_QUEUE.md` and `docs/MASTER_BUILD_OUTLINE.md` are documentation-only planning files created for the current planning task.

### Future folders to add later

The following folders are expected later, but should only be added by planned implementation tasks. They should not be created as casual placeholders.

```text
schemas/
tests/
scripts/
n8n/
n8n/prompts/
n8n/test-fixtures/
```

Expected future purposes:

- `schemas/` — canonical JSON schemas for project data contracts.
- `tests/` — automated contract, fixture, plugin, and workflow tests.
- `scripts/` — local validation and development utility scripts.
- `n8n/` — exportable/importable n8n workflow assets when workflow implementation begins.
- `n8n/prompts/` — prompt documents or prompt configuration used by n8n stages.
- `n8n/test-fixtures/` — mock job payloads and workflow test inputs.

These folders should only be added when their corresponding build phase or implementation task explicitly requires them.

## 4. Full Workflow Architecture

### Planned workflow areas

The long-term architecture contains 12 planned workflow areas:

1. **Client intake workflow** — receives WordPress submissions and starts a job.
2. **Job initialization workflow** — creates or loads canonical job state and assigns identifiers.
3. **Input file intelligence workflow** — classifies and summarizes client-provided files.
4. **Research workflow** — gathers external or internal context required for accurate planning.
5. **Object reconstruction workflow** — defines the objects, materials, details, and constraints that must be represented.
6. **Scene planning workflow** — plans composition, placement, scale, perspective, lighting, and scene logic.
7. **Functional and environmental validation workflow** — checks practical use, environmental consequences, collisions, and consistency.
8. **Client question workflow** — asks for missing information, waits for answers, and resumes the job.
9. **ImageManager routing workflow** — decides whether to continue, ask questions, rework a stage, generate, or finish.
10. **Image generation/editing workflow** — executes the planned image operation using the selected provider.
11. **Final validation workflow** — checks generated output against the plan and acceptance criteria.
12. **Targeted rework and delivery workflow** — handles focused corrections and returns approved results to WordPress.

### Smaller MVP workflow set

The MVP should start with a smaller workflow set that proves the system loop without building the entire engine at once:

1. WordPress intake mock or minimal endpoint handoff.
2. Job state creation using schema-validated fixture data.
3. Bounded ImageManager decision node.
4. Mock stage execution and validation results.
5. Client question pause/resume loop.
6. Mock final result return to WordPress.

This MVP should run without live provider calls and should prove data contracts, routing, state transitions, and failure handling before advanced intelligence or image generation is added.

### ImageManager MVP boundary

ImageManager starts as a bounded n8n decision node. Its initial responsibility is to read validated stage outputs and choose from a small allowed set of next actions, such as:

- continue to the next stage;
- request client clarification;
- route to targeted rework;
- stop with a validation error;
- mark the job ready for mock final delivery.

ImageManager should not begin as an unrestricted autonomous controller. Broader capabilities should only be added after schemas, tests, fixtures, and safe execution limits are in place.

## 5. Data Contracts Required

The following data contracts are required before implementation work can safely proceed:

1. **`job_state`**
   - Canonical representation of a job's identity, status, current stage, stage history, validation status, pending questions, outputs, and error state.

2. **`client_submission`**
   - WordPress-originated intake payload containing prompt text, project metadata, attached files, client constraints, desired output, and contact/session identifiers.

3. **`stage_result`**
   - Standard output envelope for each workflow stage, including stage name, status, produced data, warnings, errors, and trace metadata.

4. **`validation_result`**
   - Standard validation envelope showing pass/fail status, validation checks performed, failure reasons, severity, and recommended next action.

5. **`imagemanager_decision`**
   - Decision object produced by ImageManager, including selected route, rationale, required inputs, target stage, and safety constraints.

6. **`client_question`**
   - Structured clarification request sent to the client, including question text, reason, answer format, choices if applicable, and blocking/non-blocking status.

7. **`client_answer`**
   - Structured response from the client, linked to the original question and job, with answer text/value, timestamp, and validation status.

8. **`rework_request`**
   - Targeted correction request identifying the failed stage, problem area, requested change, relevant prior outputs, and expected validation criteria.

9. **`final_result`**
   - Final delivery payload containing output status, image references, metadata, validation summary, delivery destination, and client-facing message.

## 6. Build Phases

### Phase 0: Docs and architecture lock

- Align on system purpose, workflow boundaries, build order, and guardrails.
- Maintain architecture, roadmap, build queue, and master outline documentation.
- Confirm that no product code, workflow JSON, schemas, or placeholder implementation assets are added during this phase.

### Phase 1: Schemas and fixtures

- Define canonical schemas for required data contracts.
- Add valid and invalid fixtures for each contract.
- Add local validation scripts and schema tests.
- Establish mock payloads for future WordPress and n8n work.

### Phase 2: Plugin shell

- Add the WordPress plugin shell after contracts exist.
- Implement only minimal admin/client surfaces required to pass smoke tests.
- Use mock data and schema-compliant payloads rather than live n8n calls.

### Phase 3: n8n skeleton and mock loop

- Add initial n8n workflow skeletons after schemas and fixtures are in place.
- Validate importability and mock-mode execution.
- Prove job initialization, stage result creation, and final mock return.

### Phase 4: Client question loop

- Implement structured client clarification questions and answers.
- Support paused job state and resume behavior.
- Validate question and answer payloads against schemas.

### Phase 5: ImageManager MVP

- Implement bounded ImageManager decision behavior.
- Restrict decisions to an approved route list.
- Add decision tests using fixture jobs and validation results.

### Phase 6: Input intelligence and research

- Add file classification and input interpretation stages.
- Add research-stage interfaces in mock mode first.
- Introduce live research providers only after mock tests pass.

### Phase 7: Planning and validation layers

- Add object reconstruction, scene planning, functional validation, environmental validation, placement checks, scale checks, perspective checks, and collision checks.
- Require each stage to produce schema-valid stage and validation results.

### Phase 8: Image generation and final validation

- Integrate the first image generation/editing provider after the planning loop is stable.
- Add final validation before delivery.
- Keep provider calls isolated and configurable.

### Phase 9: Targeted rework

- Add focused rework requests for specific failed stages or output regions.
- Avoid full workflow restarts for small corrections.
- Validate rework completion before final delivery.

### Phase 10: Live provider integrations and hardening

- Add production provider credentials through secure configuration only.
- Harden retries, timeouts, audit logging, access controls, rate limits, and failure recovery.
- Expand manual and automated end-to-end checks.

## 7. Testing Strategy

The project should use layered testing that starts before product code exists:

1. **Schema validation**
   - Validate every canonical contract with positive and negative examples.

2. **Fixture validation**
   - Ensure mock payloads remain schema-valid and representative of real jobs.

3. **Plugin smoke tests**
   - Confirm the WordPress plugin can load, expose required screens/endpoints, and handle mock payloads without fatal errors.

4. **n8n import validation**
   - Confirm workflow JSON can be imported once workflow assets exist.
   - This should not be added until workflow JSON is intentionally introduced.

5. **Mock-mode workflow tests**
   - Run job lifecycle tests without live providers.
   - Validate routing, pause/resume behavior, errors, and final mock delivery.

6. **ImageManager decision tests**
   - Test allowed routes, invalid inputs, blocked states, rework decisions, and stop conditions.

7. **Manual end-to-end checks**
   - Run a full client-intake-to-final-result path in a controlled environment after the mock loop and provider integrations are ready.

## 8. Guardrails

1. **No secrets**
   - Do not commit API keys, credentials, tokens, private endpoints, or client secrets.

2. **No live provider calls before mock mode**
   - Prove contracts and workflow routing with mock data before enabling external services.

3. **No broad autonomous ImageManager access**
   - Keep ImageManager bounded to approved decision routes until the system has mature validation and safety controls.

4. **No unvalidated stage outputs**
   - Every stage output must be schema-valid and validation-checked before downstream use.

5. **No infinite loops**
   - All loops must have max attempts, clear stop conditions, and observable error states.

6. **No full restart for simple reworks**
   - Target simple corrections to the failed stage or affected image region where possible.

7. **No accidental placeholders**
   - Do not add empty implementation directories, dummy workflow JSON, fake schemas, or stub product code unless a planned task explicitly calls for documentation-only planning artifacts.

## 9. Open Questions

1. Which image generation/editing provider will be used first?
2. Where will final images be stored?
3. Will WordPress store job state, or will n8n/database storage be the canonical state source?
4. How should client authentication work?
5. Is admin approval required before client delivery?
6. Which live research provider should be integrated first?

## 10. Next Recommended Build

Recommended next build: **v0.2.0 Contract & Schema Foundation**.

Schemas and fixtures should come before plugin or n8n feature code because they define the system's shared language. WordPress intake, n8n orchestration, ImageManager decisions, validation stages, client questions, rework requests, and final delivery all depend on stable data contracts. Building feature code first would increase the risk of incompatible payloads, fragile workflow routing, unclear state ownership, and expensive rewrites.

The next build should therefore focus on:

- creating the initial contract schema set;
- adding valid and invalid fixtures;
- adding schema validation commands;
- documenting contract ownership and versioning rules;
- keeping all execution in mock mode.

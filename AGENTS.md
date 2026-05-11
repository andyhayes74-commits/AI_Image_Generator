# AI Agent Instructions

These instructions apply to AI agents working in this repository.

## Project Shape

This repository contains two related but separate build areas:

- `plugin/` — WordPress plugin source.
- `n8n/` — n8n workflow exports, prompts, fixtures, and workflow documentation.

Shared project documentation lives in `docs/`.

The project is a **scene-aware AI object integration system**. It is not a generic one-shot image generator.

## System Objective

The system should allow a client to submit a scene, object references, sketches, instructions, constraints, and rework requests through WordPress. n8n should analyse, research, plan, validate, generate, loop, and return final image versions.

The final image should show the inserted object as physically plausible, correctly scaled, perspective-matched, collision-free, functionally correct, and visually integrated with the scene.

## Non-Negotiable Rules

- Do not commit secrets, API keys, private credentials, `.env` files, n8n credential exports, or production webhook secrets.
- Keep plugin and n8n work separated by folder.
- Do not create product feature code unless a build plan exists or the user explicitly asks for implementation.
- Do not create placeholders unless they are clearly marked as intentional scaffold code.
- Keep changes small, focused, and reviewable.
- Do not rewrite unrelated files.
- Do not remove features unless the user explicitly asks.
- Update docs when behaviour, structure, or workflow contracts change.
- Log bugs in `docs/BUGS.md`.
- Track work in `docs/BUILD_QUEUE.md`.
- Put detailed version plans in `docs/BUILD_PLANS.md`.
- Follow `docs/CODEX_BUILD_QUEUE.md` when preparing Codex-driven implementation.

## Core Architecture Rules

- Design first, generate second.
- Treat client files as evidence, not just uploads.
- Treat client sketches as design intent, not automatic proof of physical feasibility.
- Research missing object or environment facts before relying on guesses.
- Validate every major stage.
- Failed stages should loop back with targeted repair instructions.
- Rework requests should rerun the smallest safe part of the workflow.
- Preserve validated data where safe.
- Use mock mode and schema validation before live provider calls.

## Plugin Rules

Plugin code belongs under `plugin/`.

Planned plugin responsibilities:

- WordPress admin UI.
- Client/admin job submission UI.
- Scene image, object image, sketch, annotation, and document uploads.
- Sanitised user input.
- Nonce and permission checks.
- Safe handoff to n8n or a backend API.
- Job status display.
- Client question display and answer submission.
- Final image and version display.
- Rework request intake.

Do not hardcode provider API keys, private prompts, webhook secrets, or internal workflow logic into front-end JavaScript.

## n8n Rules

n8n files belong under `n8n/`.

- Exported workflow JSON belongs in `n8n/workflows/`.
- Workflow notes and contracts belong in `n8n/notes/`.
- Future prompts should belong in `n8n/prompts/` once that folder is created by an approved build.
- Future fixtures should belong in `n8n/test-fixtures/` once that folder is created by an approved build.
- Remove credentials from workflow exports before committing.
- Document webhook request/response contracts clearly.
- Keep test payloads safe and fake unless explicitly instructed otherwise.
- Keep ImageManager bounded inside n8n for the first implementation.

## ImageManager Rules

ImageManager is a bounded AI decision node inside n8n, not an unrestricted external agent.

It should:

- Read structured job state.
- Compare progress against the client brief.
- Validate stage outputs.
- Choose allowed routing decisions only.
- Ask the client when the workflow would otherwise guess.
- Route targeted rework.
- Approve final only after validation passes.

It should not:

- Directly access WordPress.
- Directly access files or credentials.
- Directly call Perplexity or image generation APIs.
- Invent unsupported facts.
- Loop forever.
- Change the client brief without permission.

## Codex Build Rules

Codex should build this project in small verified slices.

Preferred sequence:

1. Docs.
2. Schemas.
3. Fixtures.
4. Validation scripts.
5. Plugin shell.
6. n8n skeleton.
7. ImageManager MVP.
8. Client question loop.
9. Research/planning workers.
10. Image generation and final validation.
11. Rework layer.

Each slice should be testable before moving to the next.

## Documentation Rules

Use the docs as the project control room:

- `docs/ARCHITECTURE.md` — architecture and core layers.
- `docs/WORKFLOW_OVERVIEW.md` — workflow map.
- `docs/IMAGE_MANAGER.md` — ImageManager design.
- `docs/CODEX_BUILD_QUEUE.md` — Codex build sequence.
- `docs/ROADMAP.md` — high-level version direction.
- `docs/BUILD_QUEUE.md` — active task queue.
- `docs/BUILD_PLANS.md` — detailed plans before implementation.
- `docs/BUGS.md` — bug tracker.

## Coding Style Guidance

- Prefer clear, boring, maintainable code over clever code.
- Validate and sanitise all external input.
- Use WordPress coding patterns where relevant.
- Keep error messages helpful but do not leak secrets or internal prompt details.
- Add comments only where they explain important decisions.

## Before Opening a Pull Request

Check:

- [ ] The change matches the build plan or user request.
- [ ] Plugin and n8n files are in the correct folders.
- [ ] Docs are updated.
- [ ] No secrets or credentials are committed.
- [ ] Bug tracker is updated if bugs were fixed or found.
- [ ] Manual test notes are added where useful.
- [ ] No accidental product placeholders were introduced.

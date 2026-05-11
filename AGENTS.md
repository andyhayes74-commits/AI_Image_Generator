# AI Agent Instructions

These instructions apply to AI agents working in this repository.

## Project Shape

This repository contains two related but separate build areas:

- `plugin/` — WordPress plugin source.
- `n8n/` — n8n workflow exports and workflow documentation.

Shared project documentation lives in `docs/`.

## Non-Negotiable Rules

- Do not commit secrets, API keys, private credentials, `.env` files, n8n credential exports, or production webhook secrets.
- Keep plugin and n8n work separated by folder.
- Do not create product feature code unless a build plan exists or the user explicitly asks for implementation.
- Keep changes small, focused, and reviewable.
- Do not rewrite unrelated files.
- Do not remove features unless the user explicitly asks.
- Update docs when behaviour, structure, or workflow contracts change.
- Log bugs in `docs/BUGS.md`.
- Track work in `docs/BUILD_QUEUE.md`.
- Put detailed version plans in `docs/BUILD_PLANS.md`.

## Plugin Rules

Plugin code belongs under `plugin/`.

Planned plugin responsibilities:

- WordPress admin UI.
- Public shortcode/block UI.
- Sanitised user input.
- Nonce and permission checks.
- Safe handoff to n8n or a backend API.
- Gallery display and moderation UI where appropriate.

Do not hardcode provider API keys or private prompts into front-end JavaScript.

## n8n Rules

n8n files belong under `n8n/`.

- Exported workflow JSON belongs in `n8n/workflows/`.
- Workflow notes and contracts belong in `n8n/notes/`.
- Remove credentials from workflow exports before committing.
- Document webhook request/response contracts clearly.
- Keep test payloads safe and fake unless explicitly instructed otherwise.

## Documentation Rules

Use the docs as the project control room:

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

# Build Queue

This file tracks active and upcoming build tasks.

Use this file for small practical tasks. Use `docs/ROADMAP.md` for version direction, `docs/BUILD_PLANS.md` for detailed version plans, and `docs/CODEX_BUILD_QUEUE.md` for Codex-oriented implementation sequencing.

---

## Active Build

Current active build: `v1.4.0 — Input Intelligence & Research Workers`

Status: `Blocked`

---

## Queue Status Key

| Status | Meaning |
|---|---|
| Todo | Not started |
| Ready | Ready for implementation |
| In Progress | Being worked on |
| Review | Built and ready to inspect |
| Done | Completed and accepted |
| Blocked | Cannot continue until another issue is resolved |
| Deferred | Moved to later |

---

## Current Queue

| ID | Task | Area | Status | Notes |
|---|---|---|---|---|
| Q-0001 | Create repo documentation scaffold | docs | Done | README, roadmap, bugs, build queue, build plans, agent rules |
| Q-0002 | Create plugin folder scaffold | plugin | Done | Folder marker only, no product code yet |
| Q-0003 | Create n8n workflow folder scaffold | n8n | Done | Folder marker only, no workflow export yet |
| Q-0004 | Correct project objective to scene-aware object integration | docs | Done | Replace simple generator framing with real architecture |
| Q-0005 | Add architecture draft | docs | Done | Input intelligence, research, reconstruction, collision, rework, ImageManager |
| Q-0006 | Add workflow overview draft | docs | Done | Full 12-workflow map plus MVP workflow set |
| Q-0007 | Add ImageManager draft design | docs | Done | Bounded n8n decision node, no direct broad access |
| Q-0008 | Add Codex build queue | docs | Done | Contract-first, mock-first, schema/test path |
| Q-0009 | Define plugin-to-n8n integration contract | integration | Done | Initial packet contracts now live in `schemas/` |
| Q-0010 | Create schema foundation | schemas | Done | Job state, submission, stage result, validation, ImageManager decision, questions, rework |
| Q-0011 | Create safe fixtures and validation scripts | tests | Done | Fixture validation runs with `npm test` |
| Q-0012 | Create first plugin build plan | plugin | Done | Plugin shell built against schema contracts |
| Q-0013 | Create first n8n workflow build plan | n8n | Done | Mock master workflow export added |
| Q-0014 | Correct roadmap over-claims from v1.0 audit | docs | Done | Mark current v1.0 as mock-first baseline and track live-intent gap |
| Q-0015 | WordPress runtime hardening plan | plugin | Done | Real activation, media handling, permissions, result display |
| Q-0016 | n8n schema-true workflow plan | n8n | Done | Schema-valid final result, ImageManager routing, question/resume |
| Q-0017 | Provider adapter plan | integration | Blocked | Needs provider choice and credentials for live research, vision validation, and image generation |

---

## Completed Queue Items

- `v0.1.0 — Foundation & Architecture Lock` completed the documentation foundation, repo structure, architecture draft, workflow overview, ImageManager design, build queues, and agent rules.
- `v0.2.0 — Contract & Schema Foundation` added JSON schemas, safe fixtures, a validation script, and a schema validation test.
- `v0.3.0 — WordPress Intake Shell` added the WordPress plugin shell, settings, job storage, form, answer endpoint, and rework endpoint.
- `v0.4.0 — n8n Skeleton & Mock Loop` added the mock master workflow export and workflow JSON validation.
- `v0.5.0 — Client Question Loop & ImageManager MVP` added ImageManager prompts, decision fixtures, question packets, and simulator routing.
- `v0.6.0 — Research & Input Intelligence` added mock input classification and research worker behavior.
- `v0.7.0 — Planning, Collision, Functional Use & Environmental Effects` added mock planning and validation layers.
- `v0.8.0 — Image Generation & Final Validation Loop` added mock generation attempts, final validation, and final result routing.
- `v0.9.0 — Targeted Rework Layer` added rework classification and dependency routing.
- `v1.0.0 — Stable Mock-First MVP Baseline` completed the smoke-test, documentation, known limitations, and security review pass.

---

## Parking Lot

Ideas that may be useful later but are not active yet:

- Optional image style packs per portfolio project.
- Admin cost controls.
- Public generation limits.
- Prompt version history.
- Approved image gallery filters.
- Client-facing project pages.
- Optional external ImageManager service after n8n-node MVP proves itself.
- Optional object library for common products, dimensions, and reference packs.
- Optional visual comparison dashboard for generated versions and reworks.

---

## Current Build Notes

The stable mock-first MVP is complete. WordPress runtime hardening, n8n import validation, and bounded ImageManager routing are now verified. The live roadmap is blocked at provider-backed input intelligence because no research/vision/image provider credential is available in the repo.

No production credentials, provider keys, or live webhook secrets should be committed.

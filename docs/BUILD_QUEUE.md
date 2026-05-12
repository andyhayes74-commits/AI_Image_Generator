# Build Queue

This file tracks active and upcoming build tasks.

Use this file for small practical tasks. Use `docs/ROADMAP.md` for version direction, `docs/BUILD_PLANS.md` for detailed version plans, and `docs/CODEX_BUILD_QUEUE.md` for Codex-oriented implementation sequencing.

---

## Active Build

Current active build: `v0.1.0 — Foundation & Architecture Lock`

Status: `Planning / Docs Update`

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
| Q-0001 | Create repo documentation scaffold | docs | In Progress | README, roadmap, bugs, build queue, build plans, agent rules |
| Q-0002 | Create plugin folder scaffold | plugin | Done | Folder marker only, no product code yet |
| Q-0003 | Create n8n workflow folder scaffold | n8n | Done | Folder marker only, no workflow export yet |
| Q-0004 | Correct project objective to scene-aware object integration | docs | In Progress | Replace simple generator framing with real architecture |
| Q-0005 | Add architecture draft | docs | In Progress | Input intelligence, research, reconstruction, collision, rework, ImageManager |
| Q-0006 | Add workflow overview draft | docs | In Progress | Full 12-workflow map plus MVP workflow set |
| Q-0007 | Add ImageManager draft design | docs | In Progress | Bounded n8n decision node, no direct broad access |
| Q-0008 | Add Codex build queue | docs | In Progress | Contract-first, mock-first, schema/test path |
| Q-0009 | Define plugin-to-n8n integration contract | integration | Todo | Needed before coding the real handoff |
| Q-0010 | Create schema foundation | schemas | Todo | Job state, submission, stage result, validation, ImageManager decision, questions, rework |
| Q-0011 | Create safe fixtures and validation scripts | tests | Todo | Must happen before live providers |
| Q-0012 | Create first plugin build plan | plugin | Todo | Should happen before feature implementation |
| Q-0013 | Create first n8n workflow build plan | n8n | Todo | Should happen before importing/exporting workflow JSON |
| Q-0014 | Define plugin release and update strategy | plugin/docs | Review | Added `docs/PLUGIN_RELEASES.md` to require GitHub Releases based WordPress update notifications when the plugin shell is built |
| Q-0015 | Add GitHub Releases updater to WordPress plugin shell | plugin | Todo | Implement during the first real plugin shell build; WordPress should show update notifications after first updater-enabled ZIP install |

---

## Completed Queue Items

No completed build batches yet.

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
- Optional commercial plugin update/licensing server after GitHub Releases based updates prove stable.

---

## Current Build Notes

The current docs update is intentionally documentation-only.

No plugin feature code, schemas, tests, workflow JSON, provider calls, or placeholder implementations should be added until a specific build plan approves them.

The GitHub Releases updater requirement is now captured as planned plugin infrastructure. It should be implemented with the first real WordPress plugin shell, not as fake scaffold code before the plugin exists.

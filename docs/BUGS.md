# Bug Tracker

This file tracks bugs found during development and testing.

## Bug Status Key

| Status | Meaning |
|---|---|
| Open | Confirmed or suspected bug, not fixed yet |
| In Progress | Fix is being worked on |
| Fixed | Fix has been implemented but may need verification |
| Verified | Fix has been tested and accepted |
| Deferred | Not being fixed in the current version |
| Not a Bug | Investigated and rejected as a bug |

---

## Active Bugs

## BUG-0001 — v1.0.0 roadmap overstates live system completion

Status: `Fixed`
Severity: `Medium`
Area: `docs`
Version Found: `v1.0.0`
Date Found: `2026-05-12`

### Summary

The original `v1.0.0` roadmap marked live-intent work complete even though the implementation was a mock-first baseline. The docs now identify `v1.0.0` as a stable mock-first MVP baseline and track the live-intent work in `docs/LIVE_V1_ROADMAP.md`.

### Steps to Reproduce

1. Read the previous `docs/ROADMAP.md` v1.0.0 section.
2. Compare it with `docs/KNOWN_LIMITATIONS.md`.
3. Note that live provider, runtime WordPress, and real n8n routing work was not complete.

### Expected Result

Roadmap language should distinguish verified mock-first behavior from planned live behavior.

### Actual Result

Roadmap checkboxes implied live behavior had been completed.

### Notes / Evidence

The audit found missing WordPress runtime verification, schema-true n8n final result output, ImageManager routing inside n8n, live provider adapters, and real question/resume wiring.

### Fix Notes

Added `docs/LIVE_V1_ROADMAP.md` and updated roadmap/build queue/README wording to describe `v1.0.0` as the mock-first baseline.

### Verification

Reviewed roadmap text and ran `git diff --check`.

---

## Bug Template

```md
## BUG-0001 — Short descriptive title

Status: `Open`
Severity: `Low | Medium | High | Critical`
Area: `plugin | n8n | docs | integration | unknown`
Version Found: `v0.1.0`
Date Found: `YYYY-MM-DD`

### Summary

Describe the bug clearly.

### Steps to Reproduce

1. Step one.
2. Step two.
3. Step three.

### Expected Result

What should happen.

### Actual Result

What actually happens.

### Notes / Evidence

Screenshots, logs, filenames, or useful context.

### Fix Notes

What changed when fixed.

### Verification

How the fix was tested.
```

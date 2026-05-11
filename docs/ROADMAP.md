# Project Roadmap

This roadmap defines planned versions and major development direction for AI Image Generator.

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

---

## v0.1.0 — Foundation Build

Status: `Planned`

### Goal

Create the first stable WordPress plugin foundation for controlled AI image generation.

### Included

- [ ] Initial WordPress plugin file structure.
- [ ] Basic plugin activation path.
- [ ] Basic admin interface placeholder.
- [ ] Initial settings/configuration foundation.
- [ ] Initial documentation.

### Out of Scope

- Payment systems.
- Complex user roles.
- Advanced automation.
- Full gallery customisation.
- Production launch polish.
- Live provider billing/cost controls beyond the first simple structure.

### Acceptance Criteria

- [ ] Plugin installs or can be placed inside `wp-content/plugins`.
- [ ] Plugin activates without fatal errors.
- [ ] Basic admin page or interface loads.
- [ ] Core feature path is defined clearly.
- [ ] README is accurate.

---

## v0.2.0 — Generator Prototype

Status: `Planned`

### Goal

Create the first usable generation workflow with a controlled project prompt and a front-end shortcode.

### Included

- [ ] Project configuration data model.
- [ ] Hidden prompt/template storage.
- [ ] Front-end generator shortcode.
- [ ] Basic generation request handler.
- [ ] Basic error handling.

### Out of Scope

- Advanced moderation.
- Large design system.
- Full block editor support.
- Payment or account features.

### Acceptance Criteria

- [ ] Admin can define at least one image project.
- [ ] Shortcode renders a simple generator form.
- [ ] Prompt input is sanitized.
- [ ] Request flow is protected by nonce checks.
- [ ] Failure states are visible and safe.

---

## v0.3.0 — Gallery and Moderation Build

Status: `Planned`

### Goal

Add gallery storage and moderation so generated images can be curated before public display.

### Included

- [ ] Custom database table or stable storage layer for generated image records.
- [ ] Pending/approved/rejected image states.
- [ ] Admin moderation screen.
- [ ] Gallery shortcode for approved images.
- [ ] Basic manual test checklist.

### Out of Scope

- Social features.
- Likes/comments.
- Public user accounts.
- Advanced masonry/lightbox polish unless simple.

### Acceptance Criteria

- [ ] Generated image records are stored.
- [ ] Admin can approve or reject images.
- [ ] Gallery displays approved images only.
- [ ] Moderation actions are permission protected.

---

## v1.0.0 — Stable Release

Status: `Planned`

### Goal

Prepare the plugin for real-world portfolio use.

### Included

- [ ] Stable core features.
- [ ] Security review.
- [ ] Performance pass.
- [ ] Documentation pass.
- [ ] Release checklist.

### Acceptance Criteria

- [ ] All critical bugs closed.
- [ ] Manual smoke test completed.
- [ ] Documentation complete enough for a new user.
- [ ] Known limitations listed.
- [ ] No secrets exposed in repo or logs.

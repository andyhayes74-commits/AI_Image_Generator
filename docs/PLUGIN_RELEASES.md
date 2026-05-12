# Plugin Release & Update Strategy

This document defines how the future AI Image Generator WordPress plugin should be packaged, released, installed, and updated.

The goal is to avoid direct GitHub-to-WordPress deployment for normal plugin updates. GitHub should build versioned plugin ZIP releases, and WordPress should detect those releases through the normal plugin update interface after the first updater-enabled version is installed.

---

## Intended Update Model

```text
Codex updates plugin source
  ↓
Pull request is reviewed and merged
  ↓
Version tag is pushed, for example v0.3.1
  ↓
GitHub Actions builds a clean plugin ZIP
  ↓
GitHub Release stores the ZIP asset
  ↓
WordPress detects the newer release
  ↓
Admin sees a normal plugin update notification
  ↓
Admin clicks Update now, or enables WordPress auto-updates later
```

This is a pull-style update model. WordPress pulls updates from GitHub Releases. GitHub Actions must not deploy directly to WordPress for this route.

---

## Why This Route Fits This Project

The project is planned as a WordPress + n8n system. The WordPress plugin will eventually handle client intake, uploads, job status, client questions, final image display, and downloads. Because this plugin may later become reusable across multiple sites or client installs, it should behave like a proper WordPress plugin product instead of relying on manual file copying or SSH deployment.

This approach gives the project:

- A normal WordPress update notification.
- A versioned release history.
- A downloadable release ZIP for manual install or rollback.
- No server SSH credentials in GitHub Actions.
- A clean route toward commercial/client distribution later.

---

## First Install Rule

WordPress can only discover GitHub-based updates after the plugin contains updater code.

That means the first updater-enabled ZIP must be installed manually:

```text
WordPress Admin
  → Plugins
  → Add New Plugin
  → Upload Plugin
  → Upload the release ZIP
  → Install
  → Activate
```

After that first install, future GitHub Releases should appear as normal plugin updates.

---

## Required Plugin Behaviour

When the first real WordPress plugin shell is built, it should include:

- A stable plugin slug.
- A main plugin PHP file with a valid WordPress plugin header.
- A `Version:` header that exactly matches release tags without the leading `v`.
- A `readme.txt` file with `Stable tag:` matching the plugin version.
- Plugin Update Checker, or an equivalent custom updater layer, configured for this repository.
- GitHub Release ZIP asset support.
- No hardcoded GitHub tokens.
- No direct forced auto-update behaviour.
- No direct deployment to WordPress from GitHub Actions.

Recommended initial behaviour:

```text
Show WordPress update notifications only.
Do not force automatic updates.
Let the admin choose Update now.
```

Auto-updates can be enabled later through WordPress once the plugin is mature.

---

## Required GitHub Release Workflow

When plugin implementation starts, add a workflow similar to:

```text
.github/workflows/release-plugin.yml
```

The workflow should:

- Trigger only on tags matching `v*.*.*`.
- Validate that the Git tag version matches the plugin header version.
- Validate that `readme.txt` `Stable tag:` matches the same version.
- Build a clean WordPress plugin ZIP.
- Ensure the ZIP unpacks to exactly one top-level folder matching the plugin slug.
- Exclude development-only files.
- Create a GitHub Release.
- Attach the built plugin ZIP as a release asset.
- Never deploy to WordPress.
- Never require SSH credentials.

Suggested exclusions:

```text
.git
.github
node_modules
tests
build
dist
.env
*.log
development-only notes that should not ship inside the plugin
```

Keep project documentation outside the shipped plugin ZIP unless the plugin intentionally includes public documentation.

---

## Versioning Rules

Use one version number per release.

| Location | Example |
|---|---|
| Plugin header | `Version: 0.3.1` |
| `readme.txt` | `Stable tag: 0.3.1` |
| Git tag | `v0.3.1` |
| Release title | `AI Image Generator v0.3.1` |
| ZIP asset | `ai-image-generator-0.3.1.zip` |
| Plugin folder slug | `ai-image-generator` |

The workflow must fail if the version numbers do not match.

---

## Public vs Private Repository

This repository is currently public, so the first implementation should assume public GitHub Releases.

Do not add private GitHub token support during the initial plugin shell unless explicitly required.

If private repository support is required later, it must be handled as a separate security build. Do not store broad GitHub tokens directly in customer WordPress installs without a dedicated review.

---

## Rollback Strategy

Every release ZIP should remain attached to its GitHub Release.

Rollback should be possible by manually downloading an older ZIP and installing it through WordPress, or by using WP-CLI on the server if required.

A later hardening build may add:

- Pre-update backups.
- Rollback notes in the admin UI.
- Release health checks.
- Staging-site validation before production use.

---

## Out of Scope For The First Plugin Shell

The first implementation should not include:

- License-key validation.
- Commercial update server.
- Forced automatic updates.
- SSH deployment.
- GitHub Actions deployment to WordPress.
- n8n workflow deployment.
- Live AI provider calls.

Those belong in later planned builds.

---

## Acceptance Criteria

When this release/update layer is implemented:

- [ ] The plugin activates without fatal errors.
- [ ] The plugin uses a stable slug.
- [ ] The updater checks GitHub Releases.
- [ ] The updater uses release ZIP assets, not GitHub source archives.
- [ ] WordPress shows an update notification when a newer release exists.
- [ ] The release workflow creates a clean installable ZIP.
- [ ] The ZIP contains exactly one top-level plugin folder.
- [ ] Version mismatch causes workflow failure.
- [ ] No SSH credentials, API keys, `.env` files, or private tokens are committed.
- [ ] The release process is documented for a human maintainer and for Codex.

---

## Relationship To The Roadmap

This should be added to the first real WordPress plugin implementation slice, currently planned around the WordPress intake shell. The updater does not need to wait for the full image-generation system, because the update channel is foundational plugin infrastructure.

The sensible sequence is:

```text
v0.2.0 Contract & Schema Foundation
  ↓
v0.3.0 WordPress Plugin Shell
  ↓
Add release/update channel inside the plugin shell
  ↓
Future plugin releases use normal WordPress update notifications
```

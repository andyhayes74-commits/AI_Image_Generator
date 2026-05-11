# AI Image Generator

## Summary

AI Image Generator is a combined WordPress plugin and n8n workflow project for controlled AI image generation on portfolio project pages.

The repo is designed as a single project home:

- `plugin/` contains the WordPress plugin.
- `n8n/` contains exported n8n workflows and workflow notes.
- `docs/` contains plans, bug tracking, build notes, and agent instructions.

The WordPress plugin will handle the website/user interface. The n8n workflow will handle automation-heavy generation, orchestration, provider calls, image processing, and future pipeline logic.

This repository currently contains the project documentation framework only. Product feature code has not been started yet.

## Current Version

Current version: `v0.1.0-planning`

## Project Status

Status: `Planning`

## Main Goal

The main goal of this project is:

- Create a WordPress plugin that lets visitors generate images inside controlled project styles.
- Keep proprietary prompt templates, provider settings, API keys, and workflow internals hidden from visitors.
- Use n8n for the backend automation workflow where it makes sense.
- Store plugin code, n8n workflow exports, plans, notes, and bug tracking in one repo.
- Allow generated images to be reviewed, moderated, and displayed in curated project galleries.
- Build the project in small, reviewable stages that can be handled safely by AI coding agents.

## Target Users

This project is intended for:

- Portfolio visitors who want to generate images in a guided project style.
- The site owner/admin who needs control over prompts, costs, moderation, and galleries.
- Future clients or portfolio reviewers who need to see a polished AI content workflow.

## Repository Layout

```text
AI_Image_Generator/
├── plugin/                 # WordPress plugin source
├── n8n/                    # n8n workflow exports and workflow docs
│   ├── workflows/          # Exported workflow JSON files
│   └── notes/              # n8n-specific notes and mapping docs
├── docs/                   # Shared planning, bugs, build queue, build plans
├── AGENTS.md               # AI agent working rules
└── README.md               # Project overview
```

## Core Features

Planned features:

- [ ] WordPress plugin scaffold.
- [ ] n8n workflow scaffold/export location.
- [ ] Admin settings page for image generation projects.
- [ ] Hidden master prompt and user prompt template per project.
- [ ] Plugin-to-n8n webhook/API handoff.
- [ ] Provider/model configuration handled safely outside public UI.
- [ ] Front-end generator shortcode or block.
- [ ] Gallery shortcode for approved images.
- [ ] Image moderation workflow.
- [ ] Daily generation limits or rate limiting.
- [ ] Safe debug logging with secret redaction.

## Tech Stack

- Plugin: PHP, JavaScript, CSS, WordPress
- Automation: n8n workflow JSON
- Storage: WordPress options/custom tables, WordPress Media Library, possible workflow-side storage later
- Build tools: TODO
- Testing: PHP linting, WordPress manual smoke tests, n8n import validation, TODO automated checks

## Repository Rules

- Keep plugin and n8n workflow files in separate folders.
- Keep shared notes, plans, and bug tracking in `docs/`.
- Keep changes small and reviewable.
- Do not rewrite unrelated systems.
- Do not remove existing features unless explicitly instructed.
- Update documentation when behaviour changes.
- Record bugs in `docs/BUGS.md`.
- Track active work in `docs/BUILD_QUEUE.md`.
- Use `docs/BUILD_PLANS.md` before starting a new version or major feature.
- Never commit secrets, API keys, `.env` files, n8n credentials, or private credentials.

## How to Run Locally

TODO: Add local WordPress and n8n setup instructions once the scaffolds exist.

```bash
# Example future checks
# php -l plugin/ai-image-generator.php
```

## How to Test

TODO: Add automated and manual test commands once the plugin and workflow scaffolds exist.

```bash
# Add test commands here
```

## Manual Test Checklist

Before release, confirm:

- [ ] Plugin activates without fatal errors.
- [ ] Admin settings page loads.
- [ ] Project settings save correctly.
- [ ] Generator shortcode renders on a page.
- [ ] Plugin can call the intended n8n webhook/API route.
- [ ] n8n workflow import is valid.
- [ ] Main image generation flow works once.
- [ ] Gallery displays approved images only.
- [ ] No obvious mobile layout issues.
- [ ] No browser console errors.
- [ ] No PHP/runtime warnings.
- [ ] Documentation updated.

## Release Notes

See `docs/ROADMAP.md` and `docs/BUILD_PLANS.md`.

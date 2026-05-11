# AI Image Generator

## Summary

AI Image Generator is a planned WordPress plugin for controlled AI image generation on portfolio project pages.

The project is intended to let visitors generate images inside a controlled project style while keeping the site owner’s hidden prompts, provider settings, and moderation controls safely on the back end.

This repository currently contains the project documentation framework only. Product feature code has not been started yet.

## Current Version

Current version: `v0.1.0-planning`

## Project Status

Status: `Planning`

## Main Goal

The main goal of this project is:

- Create a WordPress plugin that adds controlled AI image generation to portfolio pages.
- Keep proprietary prompt templates and provider details hidden from visitors.
- Allow generated images to be reviewed, moderated, and displayed in curated project galleries.
- Build the project in small, reviewable stages that can be handled safely by AI coding agents.

## Target Users

This project is intended for:

- Portfolio visitors who want to generate images in a guided project style.
- The site owner/admin who needs control over prompts, costs, moderation, and galleries.
- Future clients or portfolio reviewers who need to see a polished AI content workflow.

## Core Features

Planned features:

- [ ] WordPress plugin scaffold.
- [ ] Admin settings page for image generation projects.
- [ ] Hidden master prompt and user prompt template per project.
- [ ] Provider/model configuration, likely via a controlled API route or LiteLLM endpoint.
- [ ] Front-end generator shortcode or block.
- [ ] Gallery shortcode for approved images.
- [ ] Image moderation workflow.
- [ ] Daily generation limits or rate limiting.
- [ ] Safe debug logging with secret redaction.

## Tech Stack

- Language/framework: PHP, JavaScript, CSS
- Platform: WordPress
- Database/storage: WordPress options, custom database table, WordPress Media Library
- Build tools: TODO
- Testing: PHP linting, WordPress manual smoke tests, TODO automated checks

## Repository Rules

- Keep changes small and reviewable.
- Do not rewrite unrelated systems.
- Do not remove existing features unless explicitly instructed.
- Update documentation when behaviour changes.
- Record bugs in `docs/BUGS.md`.
- Track active work in `docs/BUILD_QUEUE.md`.
- Use `docs/BUILD_PLANS.md` before starting a new version or major feature.
- Never commit secrets, API keys, `.env` files, or private credentials.

## How to Run Locally

TODO: Add local WordPress setup instructions once the plugin scaffold exists.

```bash
# Example future checks
# php -l portfolio-ai-generator.php
```

## How to Test

TODO: Add automated and manual test commands once the plugin scaffold exists.

```bash
# Add test commands here
```

## Manual Test Checklist

Before release, confirm:

- [ ] Plugin activates without fatal errors.
- [ ] Admin settings page loads.
- [ ] Project settings save correctly.
- [ ] Generator shortcode renders on a page.
- [ ] Main image generation flow works once.
- [ ] Gallery displays approved images only.
- [ ] No obvious mobile layout issues.
- [ ] No browser console errors.
- [ ] No PHP/runtime warnings.
- [ ] Documentation updated.

## Release Notes

See `docs/ROADMAP.md` and `docs/BUILD_PLANS.md`.

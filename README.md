# AI Image Generator

## Summary

AI Image Generator is a universal WordPress + n8n system for **AI-assisted scene integration**.

The project is not a simple image generator. Its purpose is to take imperfect client material, understand the scene, research the target object, plan a physically plausible edit, build the image from validated fragments, and return a final image where the inserted object looks like it genuinely belongs and functions in the environment.

Examples:

- Add a blender to a kitchen worktop, correctly scaled, plugged in, and fitted around existing objects.
- Add a wall-mounted TV that is switched on, with realistic glow, reflections, cable logic, and wall placement.
- Add a medical or industrial object with plausible tubing, power, clearance, dirt, wear, and scene interaction.
- Interpret a client sketch showing where an object should go, then validate whether that request physically works.

The system is designed around one core principle:

> **Design first, generate second.**

The image model should not freestyle the answer. n8n should build a validated composition blueprint first, then use image generation/editing as the final build stage.

---

## Current Version

Current version: `v0.1.0-planning`

Status: `Planning / documentation foundation`

This repository currently contains the project documentation framework only. Product feature code and live n8n workflow JSON have not been started yet.

---

## Main Objectives

The system should:

- Provide a WordPress plugin that acts as a universal client intake and result portal.
- Collect scene images, object references, sketches, annotations, manuals, constraints, and client instructions.
- Send structured job packets from WordPress to n8n.
- Use n8n as the workflow engine for analysis, research, planning, validation, generation, rework, and client questions.
- Use specialist AI systems for different jobs, for example Perplexity for research and vision models for scene/image analysis.
- Include an **ImageManager** decision layer inside n8n to validate each stage against the client brief.
- Loop failed or weak stages back for targeted improvement rather than aiming for perfection in one pass.
- Allow n8n to ask the client clarifying questions through the WordPress plugin.
- Support targeted rework without restarting the whole job when the requested change is small.
- Return final approved image versions to WordPress for review, display, and download.
- Keep future n8n workflow exports deployable through a validated, sanitised, manual GitHub Actions deployment path.

---

## Core Design Principles

### 1. Universal intake

The plugin must not be hardcoded for one object or scene type. It should support any realistic object insertion request, including client photos, sketches, and written instructions.

### 2. Evidence-based planning

Important decisions should come from client data, research, scene analysis, object analysis, or validated inference. The system should track where decisions came from.

### 3. Physical plausibility

Inserted objects must fit the scene. Scale, perspective, collision, surface contact, clearance, and usability all matter.

### 4. Functional realism

Objects should be shown being used correctly where requested: plugged in, mounted, connected to tubes, switched on, or otherwise functioning as intended.

### 5. Environmental consequences

The scene must respond to the inserted object. A switched-on TV creates light. A lamp changes shadows. A dirty room affects the inserted object. A cable or tube needs a believable path.

### 6. Iterative loops

The workflow should draft, validate, repair, and improve. Every failed check should produce a targeted repair instruction.

### 7. Rework without restart

Small rework requests, such as “make the scene brighter”, should reuse validated research, placement, object analysis, and prior outputs wherever safe.

### 8. Codex-buildable delivery

The repo should be structured so Codex can build one tested slice at a time: contracts first, mock mode first, tests after each slice, then live integrations.

### 9. Deployable n8n workflow source

n8n workflow JSON should be treated as source-controlled deployment artifacts. Future workflow builds must keep exports deploy-safe, credential-clean, validated, and compatible with a manual GitHub Actions deployment path.

---

## System Shape

```text
WordPress Plugin
  ↓
Client intake, uploads, status, questions, final image display
  ↓
n8n Master Workflow
  ↓
ImageManager decision node
  ↓
Specialist sub-workflows
  ├── Input file analysis
  ├── Research
  ├── Scene analysis
  ├── Object analysis and reconstruction
  ├── Placement / scale / collision validation
  ├── Scene reengineering
  ├── Functional use planning
  ├── Environmental consequence planning
  ├── Image generation
  ├── Final validation
  └── Rework routing
```

---

## Repository Layout

```text
AI_Image_Generator/
├── plugin/                 # WordPress plugin source
├── n8n/                    # n8n workflow exports, prompts, notes, and fixtures
│   ├── workflows/          # Exported workflow JSON files
│   └── notes/              # n8n-specific notes and mapping docs
├── docs/                   # Shared planning, architecture, bugs, queue, build plans
├── AGENTS.md               # AI agent working rules
└── README.md               # Project overview
```

Future Codex-friendly folders may include:

```text
schemas/                    # JSON schemas for job state and workflow contracts
tests/                      # Schema, fixture, plugin, and workflow-simulator tests
scripts/                    # Validation, mock workflow checks, and future deployment scripts
n8n/prompts/                # ImageManager and worker prompts
n8n/test-fixtures/          # Safe fake input/output packets
n8n/deploy/                 # Future safe deployment mapping examples
.github/workflows/          # Future manual GitHub Actions for controlled deployment
```

These folders should be added by a planned build, not as accidental placeholders.

---

## Planned Workflow Set

The full system is expected to grow into 12 workflow areas:

1. Master Job Controller
2. Client Question / Resume Workflow
3. Rework Request Workflow
4. Input File Analysis Workflow
5. Research Workflow
6. Scene Analysis Workflow
7. Object Analysis & Reconstruction Workflow
8. Placement / Scale / Collision Workflow
9. Scene Reengineering Workflow
10. Functional Use & Environmental Effects Workflow
11. Image Generation Workflow
12. Final Validation / QA Workflow

The MVP should start with fewer workflows and split them later as the system proves itself.

---

## n8n Deployment Direction

Future n8n workflow development should allow this deployment path:

```text
Edit workflow JSON in GitHub
→ Validate workflow export
→ Sanitise deployment payload
→ Deploy to self-hosted n8n through n8n API
→ Preserve existing active state unless explicitly changed
→ Report success/failure in GitHub Actions
```

This deployment path is not active yet. It should be added only after schemas, fixtures, workflow validation, and n8n skeleton workflows exist.

See `docs/N8N_DEPLOYMENT.md` for the future deployment plan.

---

## ImageManager

The ImageManager is a bounded AI decision node inside n8n.

It should not directly access WordPress, files, credentials, Perplexity, or image generation APIs. n8n remains the gatekeeper. The ImageManager receives structured job state and returns a structured decision.

Allowed decisions should be fixed, for example:

```text
continue
retry_stage
repair_stage
rerun_research
ask_client
request_admin_review
approve_final
reject_final
start_targeted_rework
```

See `docs/IMAGE_MANAGER.md` for the draft design.

---

## Documentation Index

- `docs/ARCHITECTURE.md` — draft architecture and core layers.
- `docs/WORKFLOW_OVERVIEW.md` — planned workflow map.
- `docs/IMAGE_MANAGER.md` — ImageManager design.
- `docs/N8N_DEPLOYMENT.md` — future n8n deployment and GitHub Actions plan.
- `docs/CODEX_BUILD_QUEUE.md` — Codex-oriented build path.
- `docs/ROADMAP.md` — version roadmap.
- `docs/BUILD_QUEUE.md` — active task queue.
- `docs/BUILD_PLANS.md` — version build plans.
- `docs/BUGS.md` — bug tracker.

---

## Repository Rules

- Keep plugin and n8n workflow files in separate folders.
- Keep shared notes, plans, and bug tracking in `docs/`.
- Keep changes small and reviewable.
- Do not rewrite unrelated systems.
- Do not remove existing features unless explicitly instructed.
- Update documentation when behaviour, structure, workflow contracts, or deployment expectations change.
- Record bugs in `docs/BUGS.md`.
- Track active work in `docs/BUILD_QUEUE.md`.
- Use `docs/BUILD_PLANS.md` before starting a new version or major feature.
- Never commit secrets, API keys, `.env` files, n8n credentials, or private credentials.

---

## Current Build Focus

The next practical build should be documentation and contract alignment:

1. Lock the architecture.
2. Define the job state and workflow contracts.
3. Create schemas and safe fixtures.
4. Build a mockable WordPress-to-n8n loop.
5. Add the ImageManager only after routing and contracts exist.
6. Keep future n8n workflow exports compatible with validation and controlled deployment.

No live AI provider calls or live n8n deployment should be required until mock mode and contract tests are working.

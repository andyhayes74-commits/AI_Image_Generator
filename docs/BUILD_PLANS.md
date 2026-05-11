# Build Plans

This file stores detailed build plans before implementation starts.

A build plan should exist before each version or major feature branch is coded.

---

## Build Plan Template

```md
## vX.Y.Z — Build Name

Status: `Draft | Approved | In Progress | Complete`
Branch: `feature/example-branch`
Date Created: `YYYY-MM-DD`

### Goal

What this build is trying to achieve.

### Scope

Included:

- Item one.
- Item two.

Out of scope:

- Item one.
- Item two.

### Files Expected To Change

Plugin:

- `plugin/...`

n8n:

- `n8n/workflows/...`
- `n8n/notes/...`

Docs:

- `docs/...`

### Implementation Steps

1. Step one.
2. Step two.
3. Step three.

### Acceptance Criteria

- [ ] Criterion one.
- [ ] Criterion two.

### Test Plan

- [ ] Test one.
- [ ] Test two.

### Risks / Notes

- Risk or note.
```

---

## v0.1.0 — Repository Foundation

Status: `In Progress`
Branch: `feature/v0.1.0`
Date Created: `2026-05-11`

### Goal

Set up the repository as a shared home for the WordPress plugin, n8n workflow exports, and project documentation.

### Scope

Included:

- Create `plugin/` folder scaffold.
- Create `n8n/workflows/` folder scaffold.
- Create `n8n/notes/` folder scaffold.
- Add shared documentation structure.
- Define the initial repo rules for AI coding agents.

Out of scope:

- Building the plugin features.
- Building the n8n workflow.
- Connecting the plugin to n8n.
- Adding real API keys, credentials, or webhook secrets.

### Files Expected To Change

Plugin:

- `plugin/.gitkeep`

n8n:

- `n8n/workflows/.gitkeep`
- `n8n/notes/README.md`

Docs:

- `README.md`
- `docs/ROADMAP.md`
- `docs/BUGS.md`
- `docs/BUILD_QUEUE.md`
- `docs/BUILD_PLANS.md`
- `AGENTS.md`

### Implementation Steps

1. Create a feature branch.
2. Update README to define the project purpose and folder structure.
3. Add plugin and n8n folder markers.
4. Add documentation files.
5. Add agent rules.
6. Open a pull request for review.

### Acceptance Criteria

- [ ] Repo clearly separates plugin and n8n workflow areas.
- [ ] Docs clearly describe the shared repo approach.
- [ ] Build queue and bug tracker exist.
- [ ] Agent rules exist.
- [ ] No product feature code has been started accidentally.

### Test Plan

- [ ] Confirm files exist in the expected folders.
- [ ] Confirm README references the correct folder structure.
- [ ] Confirm no secrets or credentials have been committed.

### Risks / Notes

- Empty folders require `.gitkeep` files so GitHub keeps them.
- n8n credentials must never be exported into repo workflow JSON.

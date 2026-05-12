# n8n Deployment Plan

This document defines the future deployment requirements for n8n workflows in this repository.

The current project phase is documentation, contracts, schemas, fixtures, and mock-mode validation. This document does **not** create a live deployment pipeline. It exists so future n8n workflow development is designed from the start to be deployable through GitHub Actions or a similar CI/CD process.

---

## Goal

Future n8n workflow development should support this path:

```text
Edit workflow JSON in GitHub
→ Validate workflow export
→ Sanitise deployment payload
→ Deploy to self-hosted n8n through n8n API
→ Preserve existing active state unless explicitly changed
→ Report success/failure in GitHub Actions
```

The repository should treat n8n workflow JSON as source-controlled deployment artifacts, not as loose manual exports.

---

## Deployment Principles

1. **GitHub is the source of truth**
   - Workflow JSON should live in `n8n/workflows/`.
   - n8n UI changes should be exported back into GitHub before becoming canonical.

2. **Deploy only after validation**
   - Workflow JSON must pass schema/structure checks before deployment.
   - Known read-only n8n fields must be removed from update payloads.
   - Credentials and secrets must never be committed.

3. **Deploy intentionally**
   - First deployment action should be manual only using `workflow_dispatch`.
   - Automatic deployment can be added later after the process is proven.

4. **Preserve active state by default**
   - Deployment should update workflow content without unexpectedly activating or deactivating production workflows.
   - The deploy script should omit `active` unless a build plan explicitly allows active-state changes.

5. **Environment-specific configuration stays outside the repo**
   - n8n base URL, API key, workflow IDs, and credential mapping should come from GitHub secrets, environment variables, or deployment config that is not committed.

---

## Future Repository Additions

Future n8n deployment support may add:

```text
.github/workflows/deploy-n8n.yml
scripts/validate-n8n-workflows.js
scripts/deploy-n8n-workflow.mjs
n8n/deploy/workflow-map.example.json
n8n/deploy/README.md
```

These files should only be created by an approved build plan. They should not be added during the schema-only foundation build unless explicitly requested.

---

## Workflow Export Rules

Every workflow export committed to `n8n/workflows/` should follow these rules:

- Valid JSON.
- Descriptive workflow name.
- No real credential secrets.
- No API keys.
- No private webhook secrets.
- No environment-specific hardcoded URLs unless they are safe examples.
- No accidental test credentials.
- Include only deploy-safe workflow structure.

Before deployment, scripts should strip or ignore read-only/runtime fields where present, including:

```text
id
versionId
active
meta
createdAt
updatedAt
triggerCount
shared
ownedBy
homeProject
usedCredentials
```

The deployment payload should normally include only deployable workflow fields such as:

```text
name
nodes
connections
settings
tags
pinData
```

Exact payload handling must be verified against the n8n version in use before enabling live deployment.

---

## Workflow Mapping

The repo should eventually include a safe example mapping file:

```text
n8n/deploy/workflow-map.example.json
```

Example shape:

```json
{
  "environment": "production",
  "workflows": [
    {
      "name": "AI Image Generator - Master Job Controller",
      "file": "n8n/workflows/01-master-job-controller.json",
      "target_workflow_id_env": "N8N_WORKFLOW_ID_MASTER_JOB_CONTROLLER",
      "deploy_enabled": true
    }
  ]
}
```

Real workflow IDs should be stored in GitHub secrets or environment variables, not committed to the repo.

---

## Required GitHub Secrets Later

A future deployment action will likely need these secrets:

```text
N8N_BASE_URL
N8N_API_KEY
N8N_WORKFLOW_ID_MASTER_JOB_CONTROLLER
N8N_WORKFLOW_ID_CLIENT_QUESTION_RESUME
N8N_WORKFLOW_ID_REWORK_REQUEST
```

Additional workflow ID secrets can be added as workflows are built.

Do not commit secret values. Do not echo secrets in logs.

---

## Future GitHub Actions Behaviour

The future deployment action should support:

- Manual trigger with environment selection.
- Validate all workflow JSON files.
- Validate target workflow mapping.
- Dry-run mode.
- Deploy one workflow by file/name.
- Deploy all enabled workflows.
- Preserve active state unless explicitly instructed.
- Fail clearly on HTTP errors.
- Redact secrets in logs.
- Summarise deployed workflow names and target IDs.

Suggested manual inputs:

```text
environment: dev | staging | production
workflow_file: optional specific workflow path
dry_run: true | false
preserve_active_state: true | false
```

Default should be:

```text
dry_run: true
preserve_active_state: true
```

---

## Deployment Script Requirements

A future deployment script should:

1. Read workflow JSON from `n8n/workflows/`.
2. Validate required fields: `name`, `nodes`, `connections`, `settings`.
3. Remove read-only/runtime fields.
4. Resolve target n8n workflow ID from environment variable or safe deployment mapping.
5. Fetch existing workflow metadata where needed.
6. Preserve active state by omitting `active` unless explicitly allowed.
7. Send update request to the n8n API.
8. Report success/failure clearly.
9. Never print API keys or credentials.

---

## Build Gating

n8n deployment should not be enabled until:

- Contract schemas exist.
- Workflow fixtures exist.
- n8n workflow JSON exists intentionally.
- Workflow JSON validation exists.
- Deployment scripts have dry-run mode.
- GitHub secrets are configured manually.
- A test deploy has succeeded against a non-critical workflow or development instance.

---

## Relationship To Current Build Phases

Recommended timing:

```text
v0.2.0 — Contract & Schema Foundation
  No live n8n deploy.

v0.4.0 — n8n Skeleton & Mock Loop
  Add deploy-safe workflow export rules.
  Add workflow validation script.

v0.5.x or later — n8n Deployment Action
  Add manual GitHub Action and dry-run deployment script.

v1.0.0 — Stable MVP
  Deployment action may be used for controlled production updates.
```

---

## Non-Goals For Now

Do not build yet:

- Automatic deployment on every push.
- Production activation/deactivation control.
- Credential creation through GitHub Actions.
- Multi-environment secret rotation.
- Workflow migration engine.
- Direct database edits to n8n.

Those can be considered later after manual deployment is proven.

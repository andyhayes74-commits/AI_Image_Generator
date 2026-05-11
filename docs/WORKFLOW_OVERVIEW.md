# Workflow Overview Draft

This document defines the planned n8n workflow system for AI Image Generator.

The system should be modular. It should not become one giant untestable workflow.

---

## High-Level Flow

```text
WordPress Job Submitted
        ↓
n8n Webhook Receives Job
        ↓
Create / Load Job State
        ↓
Input File Analysis
        ↓
ImageManager Decision
        ↓
Need client info? ── yes ──→ Send Question to WordPress
        ↓ no                         ↓
Research Layer                  Client Answers
        ↓                            ↓
ImageManager Decision ←──────────────
        ↓
Scene Analysis
        ↓
ImageManager Decision
        ↓
Object Analysis / Reconstruction
        ↓
ImageManager Decision
        ↓
Placement + Collision + Scale
        ↓
ImageManager Decision
        ↓
Scene Reengineering if needed
        ↓
Functional Use Planning
        ↓
Environmental Consequence Planning
        ↓
Composition Blueprint
        ↓
Image Generation
        ↓
Final Image Validation
        ↓
Pass? ── no ──→ ImageManager chooses targeted repair loop
        ↓ yes
Return Final Image to WordPress
        ↓
Client Review
        ↓
Rework requested? ── yes ──→ Rework Layer
        ↓ no
Approved / Complete
```

---

## Full Workflow Set

The complete system is expected to grow into 12 workflow areas.

### 1. Master Job Controller

Receives jobs from WordPress and controls the full workflow state.

Responsibilities:

- Receive initial job submission.
- Load or create job state.
- Call ImageManager.
- Route to the next specialist workflow.
- Track loop counts.
- Prevent infinite retries.
- Update WordPress status.
- Return final outputs.

### 2. Client Question / Resume Workflow

Allows n8n to pause and ask the client for clarification.

Responsibilities:

- Create client question packet.
- Send question to WordPress.
- Set job status to `awaiting_client_answer`.
- Receive answer from WordPress.
- Attach answer to job state.
- Resume Master Job Controller.

### 3. Rework Request Workflow

Handles rework requests after a draft or final image exists.

Responsibilities:

- Receive rework request from WordPress.
- Classify the rework type.
- Decide which previous stages remain valid.
- Route targeted rework.
- Preserve earlier versions.
- Return new image version.

### 4. Input File Analysis Workflow

Classifies uploaded files and checks input quality.

Responsibilities:

- Identify scene images.
- Identify object references.
- Identify hand-drawn sketches.
- Identify placement annotations.
- Identify manuals/spec sheets.
- Detect client label mismatches.
- Flag poor-quality inputs.
- Recommend whether clarification is needed.

### 5. Research Workflow

Uses a research provider, such as Perplexity, to gather missing or verifying information.

Responsibilities:

- Research object identity.
- Find dimensions.
- Find installation/usage rules.
- Find functional requirements.
- Find common cables, tubes, vents, mounting needs.
- Return source-backed findings where possible.
- Mark uncertainty.

### 6. Scene Analysis Workflow

Analyses the source scene image.

Responsibilities:

- Identify room/environment type.
- Identify surfaces, walls, floor, counters, shelves.
- Estimate lighting and perspective.
- Detect sockets, pipes, fixtures, doors, vents, windows.
- Identify obstacles and clutter.
- Estimate cleanliness, wear, damage, or environmental style.

### 7. Object Analysis & Reconstruction Workflow

Analyses the target object and turns imperfect references into a usable object plan.

Responsibilities:

- Interpret object photos.
- Interpret object sketches.
- Detect poor-quality references.
- Decide whether reconstruction is needed.
- Define target angle and visible features.
- Define function and required connections.
- Identify unknowns.

### 8. Placement / Scale / Collision Workflow

Determines whether the object physically fits.

Responsibilities:

- Generate placement candidates.
- Estimate object scale.
- Match scene perspective.
- Check surface/wall/floor fit.
- Detect collisions with existing objects.
- Check clearance and access.
- Recommend scene reengineering where needed.

### 9. Scene Reengineering Workflow

Modifies the scene plan when existing items need moving/removing/rebuilding.

Responsibilities:

- Decide which items may move.
- Respect protected client constraints.
- Plan background repair after moving objects.
- Create space for the object.
- Preserve realism.

### 10. Functional Use & Environmental Effects Workflow

Combines two related concerns: correct object use and scene consequences.

Responsibilities:

- Plan cables, tubes, hoses, mounts, plugs, brackets, or active screens.
- Confirm the object is usable in the chosen placement.
- Plan lighting, shadows, reflections, dirt, wear, and other consequences.
- Ensure the scene responds to the inserted object.

### 11. Image Generation Workflow

Generates or edits the image using the validated composition blueprint.

Responsibilities:

- Build prompt/edit package from blueprint.
- Submit to image model or editing provider.
- Store output image/version.
- Return generation metadata.

### 12. Final Validation / QA Workflow

Checks generated output against brief and blueprint.

Responsibilities:

- Validate brief match.
- Validate object identity.
- Validate placement and scale.
- Validate perspective.
- Validate collision-free result.
- Validate functional use.
- Validate environmental effects.
- Detect artefacts or unwanted scene drift.
- Recommend targeted repair.

---

## MVP Workflow Set

For the first working system, start with 5 workflows:

1. Master Job Controller.
2. Input File Analysis.
3. Client Question / Resume.
4. Research + Planning.
5. Image Generation + Validation.

This MVP should prove the loop:

```text
Submit job
→ analyse inputs
→ ask client if needed
→ research/plan
→ generate or mock-generate
→ validate
→ return result
```

Then split Research + Planning into specialist workflows once the foundation works.

---

## ImageManager Placement

ImageManager should initially be a decision node inside the Master Job Controller.

It receives:

- Job state.
- Latest stage result.
- Validation reports.
- Loop counts.
- Client brief.
- Allowed actions.

It returns one strict JSON decision.

n8n then routes based on that decision.

---

## Job Statuses

Draft shared statuses:

```text
draft
submitted
intake_analysis
awaiting_client_answer
researching
scene_analysis
object_reconstruction
placement_planning
scene_reengineering
functional_validation
environmental_consequence
generating
validating
repairing
rework_requested
complete
failed
admin_review
cancelled
```

These should be formalised in schema before implementation.

---

## Loop Rules

Every loop should have:

- Stage name.
- Attempt number.
- Max attempts.
- Last failure reason.
- Repair instruction.
- Escalation path.

If a stage reaches max attempts, ImageManager should choose one of:

- Ask client.
- Request admin review.
- Suggest alternative.
- Mark blocked/failed.

---

## Rework Routing Examples

### Visual-only rework

Request: `Make the scene brighter.`

Reuse:

- Research.
- Scene analysis.
- Object analysis.
- Placement.
- Collision validation.
- Functional validation.

Rerun:

- Visual adjustment.
- Image generation/edit.
- Final validation.

### Placement rework

Request: `Move the TV to the other wall.`

Reuse:

- Object identity.
- Research where still valid.
- Original scene analysis as context.

Rerun:

- Placement.
- Collision.
- Perspective.
- Functional use.
- Environmental effects.
- Generation.
- Final validation.

### Object change rework

Request: `Use this different blender model.`

Rerun:

- Object analysis.
- Research if needed.
- Reconstruction.
- Placement/scale/collision if dimensions changed.
- Generation.
- Validation.

---

## Mock Mode

The first Codex builds should use mock mode.

In mock mode:

- No real Perplexity calls.
- No real image generation calls.
- No paid model calls required.
- Fixture JSON is used to simulate stage outputs.
- Contract tests verify the workflow packets.

Live provider integration should come later.

# Architecture Draft

This document captures the current draft architecture for AI Image Generator.

The project is a **scene-aware AI object integration system**, not a one-shot image generator.

---

## Purpose

The system takes client-provided materials and produces a validated final image where an object has been inserted into a real scene in a physically plausible, visually coherent, and functionally correct way.

The system must support imperfect inputs, including:

- Poor quality source scene images.
- Poor quality object references.
- Object photos taken from the wrong angle.
- Hand-drawn object sketches.
- Client placement sketches.
- Annotated photos.
- Product manuals or specification sheets.
- Incomplete written instructions.

---

## Core Principle

> Design first, generate second.

The image generation model is not the brain of the system. The workflow must first create a validated composition blueprint, then use image editing/generation to build that blueprint.

---

## Primary Components

### WordPress Plugin

The plugin is the client portal and job interface.

Responsibilities:

- Gather client brief.
- Upload and label source files.
- Allow clients to submit scene images, object images, sketches, manuals, and constraints.
- Display job status.
- Display questions from n8n.
- Send client answers back to n8n.
- Receive final image outputs.
- Support rework requests.
- Show image versions and final downloadable outputs.

The plugin should not expose private prompts, provider settings, API keys, or workflow internals.

### n8n Workflow System

n8n is the orchestration engine.

Responsibilities:

- Receive job packets from WordPress.
- Maintain workflow state.
- Route jobs through specialist analysis and generation stages.
- Call external AI systems and APIs.
- Run validation loops.
- Ask WordPress/client questions when needed.
- Return status, questions, previews, final images, and rework results.

### ImageManager

ImageManager is a bounded AI decision layer inside n8n.

Responsibilities:

- Compare stage outputs against the client brief.
- Decide whether a stage passes, retries, asks the client, or escalates.
- Select targeted rework paths.
- Avoid unnecessary reruns.
- Approve final results only after validation.

ImageManager does not directly access WordPress, file storage, credentials, Perplexity, or image generation APIs. n8n remains the gatekeeper.

---

## Core Layers

### 1. Universal Intake Layer

Collects job inputs from WordPress.

Inputs may include:

- Scene image.
- Object reference image.
- Hand-drawn sketch.
- Placement sketch.
- Annotated scene photo.
- Product manual/specification.
- Written instructions.
- Constraints and preferences.

### 2. Input File Intelligence Layer

Classifies uploaded files and determines their role.

Examples:

- Scene photo.
- Object reference.
- Object sketch.
- Placement sketch.
- Annotation.
- Style reference.
- Manual/spec sheet.
- Unknown file needing clarification.

Client labels should be treated as helpful but not automatically trusted. If the detected file type conflicts with the client label, the workflow should flag it.

### 3. Research Layer

Uses a specialist research tool, such as Perplexity, to gather information not supplied by the client.

Research may include:

- Product dimensions.
- Installation requirements.
- Functional requirements.
- Cable, tube, vent, or mounting logic.
- Safety or clearance requirements.
- Usage examples.
- Material and visual references.

Research should be skipped during simple reworks unless the rework changes the object, function, or environment enough to invalidate previous research.

### 4. Scene Analysis Layer

Analyses the source scene.

Checks:

- Scene type.
- Surfaces and planes.
- Wall, floor, counter, table, and shelf geometry.
- Sockets, pipes, vents, doors, windows, controls, fixtures.
- Lighting direction and intensity.
- Perspective and camera angle.
- Clutter and movable objects.
- Cleanliness, wear, dirt, damage, or age.

### 5. Object Analysis & Reconstruction Layer

Analyses object references and reconstructs a usable insert plan.

Handles:

- Poor quality object images.
- Wrong object angle.
- Hand-drawn object concepts.
- Partial references.
- Approximate reconstruction when exact model is not required.
- Missing dimensions or unclear features.

The output should define the object’s appearance, function, required orientation, dimensions, visible features, and unknowns.

### 6. Placement / Scale / Collision Layer

Determines where the object can physically fit.

Checks:

- Object footprint.
- Available surfaces.
- Wall/floor/worktop plane.
- Scale relative to reference objects.
- Perspective alignment.
- Collision with existing objects.
- Clearance for access, doors, controls, vents, tubes, and cables.
- Whether existing scene objects need moving.

The client’s sketch is design intent, not proof that the object can physically fit.

### 7. Scene Reengineering Layer

Adjusts the scene to make the object fit when allowed by the brief.

May include:

- Moving clutter.
- Removing an obstacle.
- Rebuilding countertop, wall, or floor behind moved items.
- Preserving protected scene elements.
- Making space without breaking realism.

### 8. Functional Use Layer

Ensures the object is being used correctly.

Examples:

- Blender plugged into a socket.
- TV wall-mounted and switched on.
- Medical object connected to tubes.
- Lamp switched on and affecting the scene.
- Industrial device connected to hoses or cables.

### 9. Environmental Consequence Layer

Determines how the inserted object changes the environment.

Examples:

- TV creates screen glow and reflections.
- Lamp changes shadows and colour cast.
- Dirty room makes inserted object dirtier.
- Wet or glossy surfaces create reflections.
- Cable/tube paths create physical visual consequences.

The scene must respond to the object.

### 10. Composition Blueprint Layer

Combines prior validated outputs into one controlled build plan for the image model.

The blueprint should include:

- Object identity.
- Placement.
- Scale.
- Perspective.
- Required scene changes.
- Functional details.
- Environmental effects.
- Protected elements.
- Rework constraints if applicable.

### 11. Image Generation / Edit Layer

Builds the final image from the validated blueprint and available fragments.

This stage should not invent major decisions already handled by planning layers.

### 12. Final Validation / QA Layer

Checks the generated result against the brief and blueprint.

Validates:

- Brief match.
- Object identity.
- Scale.
- Perspective.
- Collision.
- Functional realism.
- Environmental effects.
- Scene consistency.
- Unwanted changes.
- Artefacts.

Failures should loop back with targeted repair instructions.

### 13. Rework Layer

Handles client/admin rework requests without restarting the whole job unless necessary.

Examples:

- “Make the scene brighter” should rerun visual rework only.
- “Move the object to the other wall” should rerun placement, collision, perspective, lighting, and generation.
- “Use a different object model” may rerun research and object reconstruction.

---

## Looping Strategy

Every major stage should support this cycle:

1. Produce a draft output.
2. Validate it.
3. Identify weaknesses.
4. Create targeted repair instructions.
5. Retry the smallest safe stage.
6. Continue until pass, max loop reached, or client/admin input is needed.

The system should not aim for perfection in one pass. It should improve the weakest validated area on each loop.

---

## Job State

The system should maintain a central job state object.

Draft fields:

```json
{
  "job_id": "img-job-0001",
  "status": "planning",
  "client_inputs": {},
  "assets": {},
  "research": {},
  "scene_analysis": {},
  "object_analysis": {},
  "object_reconstruction_plan": {},
  "placement_plan": {},
  "scene_reengineering_plan": {},
  "functional_use_plan": {},
  "environmental_consequence_plan": {},
  "composition_blueprint": {},
  "validation_results": [],
  "generation_attempts": [],
  "questions": [],
  "rework_requests": [],
  "final_outputs": []
}
```

A formal schema should be created before implementation.

---

## Build Strategy

This system should be built contract-first and mock-first.

Recommended order:

1. Documentation.
2. Schemas.
3. Safe fixtures.
4. Validation scripts.
5. WordPress intake shell.
6. n8n skeleton.
7. ImageManager MVP.
8. Client question loop.
9. Research and planning workers.
10. Image generation and final validation.
11. Rework layer.

No live provider calls should be required before mock mode and contract tests exist.

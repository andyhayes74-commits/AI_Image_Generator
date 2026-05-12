# ImageManager Draft Design

ImageManager is the bounded AI decision layer inside the n8n workflow.

It supervises the image engineering process but does not directly access external systems. n8n remains the gatekeeper for WordPress, files, credentials, providers, research tools, and image generation APIs.

---

## Role

ImageManager decides what should happen next.

It should:

- Read the client brief.
- Read the current job state.
- Read the latest stage result.
- Read validation reports.
- Compare progress against the brief.
- Decide whether to continue, retry, repair, ask the client, request admin review, or approve final output.
- Avoid unnecessary reruns.
- Route rework to the smallest safe part of the workflow.

It should not:

- Generate images itself.
- Access WordPress directly.
- Access file storage directly.
- Access API keys or credentials.
- Call Perplexity or image models directly.
- Change the client brief without permission.
- Loop forever.
- Invent unsupported facts.

---

## Position in n8n

Initial version:

```text
Master Job Controller
  ↓
Build ImageManager input packet
  ↓
ImageManager AI node
  ↓
Validate ImageManager JSON output
  ↓
Switch/Router node
  ↓
Next specialist workflow
```

Later, ImageManager may become a small external service, but it should still remain bounded and schema-driven.

---

## Inputs

ImageManager should receive structured data only.

Draft input packet:

```json
{
  "job_state": {},
  "client_brief": {},
  "latest_stage_result": {},
  "validation_results": [],
  "loop_counts": {},
  "available_actions": [
    "continue",
    "retry_stage",
    "repair_stage",
    "rerun_research",
    "ask_client",
    "request_admin_review",
    "approve_final",
    "reject_final",
    "start_targeted_rework"
  ]
}
```

---

## Allowed Decisions

ImageManager must choose one decision from a fixed list.

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

No other decision names should be accepted.

---

## Output Schema Draft

```json
{
  "decision": "retry_stage",
  "target_stage": "environmental_consequence",
  "priority": "medium",
  "reason": "The TV is switched on, but the surrounding wall and cabinet do not show enough light spill.",
  "repair_instructions": [
    "Add subtle cool screen glow to the wall around the TV.",
    "Add mild reflection to the media cabinet surface.",
    "Preserve TV size, placement, and perspective."
  ],
  "ask_client": false,
  "client_question": null,
  "reuse_previous_data": {
    "research": true,
    "scene_analysis": true,
    "object_analysis": true,
    "placement_plan": true,
    "collision_validation": true,
    "functional_use_validation": true
  },
  "next_status": "repairing"
}
```

The formal decision contract now lives in `schemas/imagemanager_decision.schema.json`.

---

## Decision Examples

### Continue

Used when a stage passed and the next normal stage can run.

```json
{
  "decision": "continue",
  "target_stage": "scene_analysis",
  "reason": "Input analysis found a valid scene image and object reference. No blocking missing information was detected.",
  "repair_instructions": [],
  "ask_client": false,
  "client_question": null,
  "next_status": "scene_analysis"
}
```

### Retry Stage

Used when the same stage should run again with improved instructions.

```json
{
  "decision": "retry_stage",
  "target_stage": "placement_planning",
  "reason": "The proposed blender placement overlaps the kettle and would not fit on the available worktop space.",
  "repair_instructions": [
    "Generate a new placement candidate closer to the wall socket.",
    "Allow the mug to move if needed but preserve the kettle unless no valid placement exists."
  ],
  "ask_client": false,
  "client_question": null,
  "next_status": "placement_planning"
}
```

### Ask Client

Used when the workflow should not guess.

```json
{
  "decision": "ask_client",
  "target_stage": "client_question",
  "reason": "The uploaded blender reference is too low quality to confirm the exact model.",
  "repair_instructions": [],
  "ask_client": true,
  "client_question": {
    "question_id": "q-0003",
    "question": "Is the exact blender model required, or can we reconstruct a visually similar black and silver blender?",
    "answer_type": "single_choice",
    "options": [
      "Exact model required",
      "Similar blender is acceptable",
      "I will upload more reference images"
    ]
  },
  "next_status": "awaiting_client_answer"
}
```

### Start Targeted Rework

Used when a rework request does not require a full restart.

```json
{
  "decision": "start_targeted_rework",
  "target_stage": "visual_rework",
  "reason": "The client asked to make the scene brighter. Research, placement, and functional validation remain valid.",
  "repair_instructions": [
    "Increase overall brightness naturally.",
    "Preserve object identity, object placement, scale, perspective, and functional connections."
  ],
  "reuse_previous_data": {
    "research": true,
    "scene_analysis": true,
    "object_analysis": true,
    "placement_plan": true,
    "collision_validation": true,
    "functional_use_validation": true
  },
  "next_status": "repairing"
}
```

---

## Validation Rules

ImageManager output must be validated before routing.

Validation should reject:

- Unknown decision names.
- Missing `target_stage` for retry/repair/rework decisions.
- Missing client question for `ask_client` decisions.
- `approve_final` when required validation results are missing or below threshold.
- Rerun decisions that exceed max loop count without escalation.
- Decisions that require unavailable actions.

---

## Loop Control

ImageManager should receive loop counters for each stage.

Example:

```json
{
  "placement_planning": {
    "attempt": 2,
    "max_attempts": 3,
    "last_failure_reason": "Object overlaps existing kettle."
  }
}
```

If a stage reaches max attempts, ImageManager should usually choose one of:

- `ask_client`
- `request_admin_review`
- `reject_final`

It should not keep retrying blindly.

---

## Rework Classification

ImageManager should classify reworks by impact.

### Visual polish

Examples:

- Make scene brighter.
- Make it warmer.
- Slightly reduce contrast.
- Make object dirtier.

Usually rerun:

- Visual rework.
- Generation/edit.
- Affected-area validation.

Usually reuse:

- Research.
- Scene analysis.
- Object analysis.
- Placement.
- Collision.
- Functional validation.

### Placement change

Examples:

- Move TV to other wall.
- Put blender nearer the sink.

Usually rerun:

- Placement.
- Collision.
- Perspective.
- Functional use.
- Environmental effects.
- Generation.
- Validation.

### Object change

Examples:

- Use a different model.
- Change blender to coffee machine.

Usually rerun:

- Object analysis.
- Research where needed.
- Reconstruction.
- Placement if dimensions changed.
- Generation.
- Validation.

---

## Prompt Design

The ImageManager prompt should be strict and boring.

Draft system instruction:

```text
You are ImageManager, a bounded orchestration agent for a scene-aware image engineering workflow.

Your job is to compare the current job state against the client brief, judge the latest stage result, and choose the next workflow action.

You may only choose one allowed action. Do not invent new actions. Do not invent unsupported facts. Do not approve final output unless validation passes. Avoid unnecessary reruns. Ask the client only when required information is missing or when the workflow would otherwise guess.

Return strict JSON only.
```

---

## First MVP Scope

ImageManager v0.1 should support:

- Continue.
- Retry stage.
- Ask client.
- Approve final.
- Start targeted rework.

Out of scope for v0.1:

- Complex multi-agent debate.
- External ImageManager API service.
- Autonomous direct tool access.
- Live provider cost optimisation.

---

## Testing Strategy

Before live AI use, Codex should create fixtures for valid and invalid decisions.

Suggested tests:

- Valid `continue` decision passes.
- Valid `ask_client` decision passes.
- Invalid decision name fails.
- Missing client question fails for `ask_client`.
- Missing target stage fails for `retry_stage`.
- `approve_final` fails when validation scores are below threshold.
- Visual-only rework skips research and placement.

The ImageManager is only useful if its decisions are predictable enough for n8n to route safely. Use `npm run validate:fixtures` to check the current valid and invalid decision fixtures before adding routing logic.

import { randomUUID } from "node:crypto";

const now = () => new Date("2026-05-12T18:30:00Z").toISOString();

export function classifyInputFiles(submission) {
  const classified = submission.assets.map((asset) => {
    const notes = `${asset.client_label ?? ""} ${asset.notes ?? ""}`.toLowerCase();
    const poorQuality = notes.includes("poor") || notes.includes("blurry") || notes.includes("low quality");
    return {
      asset_id: asset.asset_id,
      declared_role: asset.declared_role,
      detected_role: asset.declared_role === "unknown" ? inferRole(asset) : asset.declared_role,
      quality: poorQuality ? "poor" : "usable",
      needs_clarification: poorQuality
    };
  });

  const hasScene = classified.some((asset) => asset.detected_role === "scene_image");
  const hasObject = classified.some((asset) => ["object_reference", "object_sketch"].includes(asset.detected_role));
  const issues = [];

  if (!hasScene) {
    issues.push(issue("high", "No scene image was detected.", "Ask the client for a scene photo."));
  }
  if (!hasObject) {
    issues.push(issue("high", "No object reference or sketch was detected.", "Ask the client for an object reference."));
  }
  for (const asset of classified.filter((item) => item.needs_clarification)) {
    issues.push(issue("medium", `Asset ${asset.asset_id} appears too low quality.`, "Ask for a clearer reference or permission to reconstruct approximately."));
  }

  return stageResult("intake_analysis", issues.length === 0 ? "passed" : "needs_client", {
    classified_assets: classified,
    placement_intent: classified.some((asset) => asset.detected_role === "placement_sketch"),
    needs_client_clarification: issues.length > 0
  }, issues, issues.length === 0 ? 0.94 : 0.52);
}

export function researchObject(submission, { reworkRequest } = {}) {
  if (reworkRequest?.impact === "visual_polish") {
    return {
      skipped: true,
      reason: "Visual-only rework preserves prior research.",
      reuse_previous_data: { research: true }
    };
  }

  const object = submission.client_brief.target_object;
  return stageResult("researching", "passed", {
    object,
    dimensions: {
      width_cm: 18,
      depth_cm: 20,
      height_cm: 40,
      confidence: 0.72
    },
    functional_requirements: ["stable worktop surface", "nearby power socket", "visible safe cable path"],
    sources: [
      {
        source_type: "mock_fixture",
        summary: `Mock research for ${object} dimensions and use requirements.`,
        confidence: 0.82
      }
    ]
  }, [], 0.86);
}

export function buildPlanningBundle(submission) {
  const desired = submission.client_brief.desired_scene_change.toLowerCase();
  const moveProtected = submission.client_brief.constraints?.some((constraint) => constraint.toLowerCase().includes("keep the kettle visible"));
  const placementIssues = desired.includes("on top of kettle")
    ? [issue("high", "Requested placement collides with the protected kettle.", "Generate a placement candidate beside the kettle.")]
    : [];

  const placement = stageResult("placement_planning", placementIssues.length ? "failed" : "passed", {
    candidates: [
      {
        candidate_id: "place-001",
        surface: "kitchen worktop",
        perspective: "matches counter plane",
        collision_free: placementIssues.length === 0,
        preserves_protected_elements: Boolean(moveProtected)
      }
    ],
    scale_estimate: "Countertop appliance scale relative to kettle and socket."
  }, placementIssues, placementIssues.length ? 0.45 : 0.9);

  const functional = stageResult("functional_validation", "passed", {
    requirements: ["power cable", "stable footprint", "clear access to controls"],
    planned_connections: ["cable routed to wall socket without crossing sink"]
  }, [], 0.88);

  const environmental = stageResult("environmental_consequence", "passed", {
    consequences: ["contact shadow on worktop", "mild reflection on glossy counter", "slight cable shadow"],
    lighting_notes: ["match existing window light direction"]
  }, [], 0.84);

  const blueprint = stageResult("composition_blueprint", placementIssues.length ? "blocked" : "passed", {
    object_identity: submission.client_brief.target_object,
    placement: "left side of worktop near wall socket",
    scale: "18 x 20 x 40 cm approximate appliance footprint",
    perspective: "aligned to worktop plane",
    protected_elements: submission.client_brief.protected_elements ?? [],
    functional_details: functional.outputs.planned_connections,
    environmental_effects: environmental.outputs.consequences
  }, placementIssues, placementIssues.length ? 0.4 : 0.9);

  return { placement, functional, environmental, blueprint };
}

export function decideWithImageManager({ latestStageResult, finalValidation, reworkRequest, loopCounts = {} }) {
  if (reworkRequest) {
    return imageManagerDecision("start_targeted_rework", {
      target_stage: reworkTarget(reworkRequest.impact),
      reason: `Classified rework as ${reworkRequest.impact}.`,
      repair_instructions: repairInstructionsForRework(reworkRequest.impact),
      next_status: "repairing",
      reuse_previous_data: reuseMapForRework(reworkRequest.impact)
    });
  }

  if (finalValidation?.passed && finalValidation.score >= 0.8) {
    return imageManagerDecision("approve_final", {
      reason: "Final validation passed with sufficient score.",
      next_status: "complete",
      final_validation_evidence: [finalValidation]
    });
  }

  if (latestStageResult?.status === "needs_client") {
    return imageManagerDecision("ask_client", {
      target_stage: "client_question",
      reason: "The latest stage needs client clarification.",
      next_status: "awaiting_client_answer",
      ask_client: true,
      client_question: {
        question_id: "q-" + randomUUID(),
        job_id: latestStageResult.job_id,
        stage: "client_question",
        question: "Can you provide a clearer object reference or confirm approximate reconstruction is acceptable?",
        help_text: "The workflow should not guess when a key reference is unclear.",
        answer_type: "single_choice",
        options: ["I will upload a clearer reference", "Approximate reconstruction is acceptable"],
        required: true,
        created_at: now()
      }
    });
  }

  if (latestStageResult?.status === "failed" || latestStageResult?.status === "blocked") {
    const loop = loopCounts[latestStageResult.stage] ?? { attempt: 1, max_attempts: 3 };
    if (loop.attempt >= loop.max_attempts) {
      return imageManagerDecision("request_admin_review", {
        target_stage: "admin_review",
        reason: "The stage reached its loop limit.",
        next_status: "admin_review"
      });
    }
    return imageManagerDecision("repair_stage", {
      target_stage: latestStageResult.stage,
      reason: latestStageResult.validation.summary,
      repair_instructions: latestStageResult.validation.issues.map((item) => item.repair_instruction).filter(Boolean),
      next_status: "repairing"
    });
  }

  return imageManagerDecision("continue", {
    target_stage: "generating",
    reason: "Latest stage passed and generation can proceed.",
    next_status: "generating"
  });
}

export function generateImageMock(blueprint) {
  const passed = blueprint.status === "passed";
  return {
    attempt: {
      attempt_id: "gen-0001",
      stage: "generating",
      status: passed ? "mocked" : "failed",
      provider: "mock",
      output_asset_id: passed ? "asset-final-001" : undefined,
      created_at: now()
    },
    validation: validationResult("final_validation", passed, passed ? 0.88 : 0.46, passed ? [] : [
      issue("high", "No valid blueprint was available for generation.", "Repair the blocked planning stage before generation.")
    ], passed ? "The mock final output matches the validated blueprint." : "Generation cannot pass without a valid blueprint."),
    finalResult: passed ? {
      result_id: "final-0001",
      job_id: blueprint.job_id,
      version: 1,
      status: "approved",
      image: {
        asset_id: "asset-final-001",
        uri: "mock://outputs/img-job-0001/final-v1.webp",
        media_type: "image/webp",
        width: 1600,
        height: 1200
      },
      validation: validationResult("final_validation", true, 0.88, [], "The mock final output matches the validated blueprint."),
      generation_attempt_id: "gen-0001",
      created_at: now()
    } : null
  };
}

export function classifyRework(change) {
  const lower = change.toLowerCase();
  if (lower.includes("brighter") || lower.includes("warmer") || lower.includes("contrast")) {
    return "visual_polish";
  }
  if (lower.includes("move") || lower.includes("other wall") || lower.includes("nearer")) {
    return "placement_change";
  }
  if (lower.includes("different") || lower.includes("model") || lower.includes("coffee machine")) {
    return "object_change";
  }
  if (lower.includes("plug") || lower.includes("tube") || lower.includes("hose")) {
    return "function_change";
  }
  return "unknown";
}

export function runMockWorkflow(submission, { reworkRequest } = {}) {
  const input = classifyInputFiles(submission);
  const research = researchObject(submission, { reworkRequest });
  const planning = buildPlanningBundle(submission);
  const generation = generateImageMock(planning.blueprint);
  const decision = decideWithImageManager({
    latestStageResult: planning.blueprint,
    finalValidation: generation.validation,
    reworkRequest
  });

  return {
    input,
    research,
    planning,
    generation,
    decision,
    finalResult: generation.finalResult
  };
}

function inferRole(asset) {
  const label = `${asset.client_label ?? ""} ${asset.uri ?? ""}`.toLowerCase();
  if (label.includes("scene") || label.includes("room") || label.includes("kitchen")) return "scene_image";
  if (label.includes("object") || label.includes("reference") || label.includes("product")) return "object_reference";
  if (label.includes("sketch") || label.includes("placement")) return "placement_sketch";
  if (label.includes("manual") || asset.media_type === "application/pdf") return "manual";
  return "unknown";
}

function issue(severity, message, repair_instruction) {
  return { severity, message, repair_instruction };
}

function stageResult(stage, status, outputs, issues, score) {
  const job_id = "img-job-0001";
  return {
    result_id: `stage-${stage.replaceAll("_", "-")}-0001`,
    job_id,
    stage,
    status,
    summary: `${stage} ${status}`,
    outputs,
    validation: validationResult(stage, issues.length === 0, score, issues, `${stage} validation ${issues.length === 0 ? "passed" : "found issues"}.`),
    evidence: [
      {
        source_type: "mock_fixture",
        summary: `${stage} produced by the local mock workflow simulator.`,
        confidence: 1
      }
    ],
    created_at: now()
  };
}

function validationResult(stage, passed, score, issues, summary) {
  return {
    validation_id: `val-${stage.replaceAll("_", "-")}-0001`,
    job_id: "img-job-0001",
    stage,
    passed,
    score,
    summary,
    issues,
    evidence: [
      {
        source_type: "mock_fixture",
        summary: "Local mock workflow validation.",
        confidence: 1
      }
    ],
    checked_at: now()
  };
}

function imageManagerDecision(decision, overrides = {}) {
  return {
    decision_id: "im-" + randomUUID(),
    job_id: "img-job-0001",
    decision,
    priority: "medium",
    reason: overrides.reason ?? "Mock decision.",
    repair_instructions: overrides.repair_instructions ?? [],
    ask_client: overrides.ask_client ?? false,
    client_question: overrides.client_question ?? null,
    next_status: overrides.next_status ?? "generating",
    ...(overrides.target_stage ? { target_stage: overrides.target_stage } : {}),
    ...(overrides.reuse_previous_data ? { reuse_previous_data: overrides.reuse_previous_data } : {}),
    ...(overrides.final_validation_evidence ? { final_validation_evidence: overrides.final_validation_evidence } : {}),
    created_at: now()
  };
}

function reworkTarget(impact) {
  if (impact === "visual_polish") return "visual_rework";
  if (impact === "placement_change") return "placement_planning";
  if (impact === "object_change") return "object_reconstruction";
  if (impact === "function_change") return "functional_validation";
  return "admin_review";
}

function repairInstructionsForRework(impact) {
  if (impact === "visual_polish") {
    return ["Adjust visual brightness only.", "Preserve object identity, placement, scale, perspective, and functional connections."];
  }
  if (impact === "placement_change") {
    return ["Recalculate placement, collision, perspective, functional use, environmental effects, generation, and final validation."];
  }
  if (impact === "object_change") {
    return ["Rerun object analysis and research where dimensions or function changed."];
  }
  return ["Request admin review to classify the rework safely."];
}

function reuseMapForRework(impact) {
  return {
    research: impact === "visual_polish" || impact === "placement_change",
    scene_analysis: true,
    object_analysis: impact !== "object_change",
    placement_plan: impact === "visual_polish",
    collision_validation: impact === "visual_polish",
    functional_use_validation: impact === "visual_polish",
    environmental_consequence_plan: impact === "visual_polish",
    composition_blueprint: impact === "visual_polish"
  };
}

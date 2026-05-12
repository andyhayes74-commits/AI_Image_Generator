# Plugin to n8n Contract

The WordPress plugin submits packets that validate against:

- `schemas/client_submission.schema.json`

n8n should return or persist packets shaped by:

- `schemas/job_state.schema.json`
- `schemas/stage_result.schema.json`
- `schemas/validation_result.schema.json`
- `schemas/imagemanager_decision.schema.json`
- `schemas/client_question.schema.json`
- `schemas/client_answer.schema.json`
- `schemas/rework_request.schema.json`
- `schemas/final_result.schema.json`

## Mock Loop

The first n8n workflow is intentionally mock-first. It accepts a schema-shaped submission, runs mock analysis/planning/generation, validates the final output, and returns a final result packet.

No credentials, provider keys, private prompts, or production webhook URLs should be exported into workflow JSON.

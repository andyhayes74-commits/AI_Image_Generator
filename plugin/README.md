# AI Image Generator WordPress Plugin

This folder contains the WordPress-facing intake and result portal.

Current MVP responsibilities:

- Register an internal job post type.
- Provide admin settings for the n8n webhook URL and shared secret.
- Render a basic submission form with scene, object, sketch/annotation/manual uploads.
- Store schema-shaped job packets.
- Expose REST endpoints for job submission, client answers, and rework requests.

Provider calls, private prompts, and image generation logic do not belong in front-end JavaScript.

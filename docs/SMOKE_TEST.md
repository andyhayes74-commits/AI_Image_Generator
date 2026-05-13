# Manual Smoke Test

Run the local MVP smoke checks from the repository root:

```sh
npm run validate:fixtures
npm run validate:workflow
npm run validate:n8n-import
npm run lint:php
npm run smoke:wordpress
npm test
npm run smoke
```

Expected result:

- All schema fixtures match their expected valid or invalid outcome.
- The n8n workflow export parses, imports into n8n, and contains no credential-like content.
- The WordPress plugin activates, accepts a REST submission, and returns a schema-valid packet.
- The WordPress plugin shell exposes the intake, question, and rework surfaces.
- The mock workflow reaches an approved final result from the valid submission fixture.
- Visual-only rework reuses research and placement data.

## WordPress Manual Check

In a WordPress installation, copy `plugin/` into `wp-content/plugins/ai-image-generator/`, activate the plugin, and confirm:

- The plugin activates without fatal errors.
- The `AI Images` admin menu appears.
- The settings page renders.
- The job submission form renders.
- A submitted job stores a schema-shaped packet.
- The webhook secret remains server-side and is not printed to the front end.

The automated WordPress smoke check expects a prepared WordPress test install. By default it uses `/tmp/aiig-wp`; set `WP_TEST_PATH=/path/to/wordpress` to use another install.

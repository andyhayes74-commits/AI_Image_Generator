# Manual Smoke Test

Run the local MVP smoke checks from the repository root:

```sh
npm run validate:fixtures
npm run validate:workflow
npm test
npm run smoke
```

Expected result:

- All schema fixtures match their expected valid or invalid outcome.
- The n8n workflow export parses and contains no credential-like content.
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

PHP is not available in this development container, so the current automated checks use static plugin tests rather than `php -l`.

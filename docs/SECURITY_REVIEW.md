# Security Review

Security checks completed for v1.0.0:

- No provider keys, `.env` files, n8n credentials, or production webhook secrets are committed.
- `node_modules/` is ignored.
- n8n workflow JSON contains no credential object or provider secret.
- The WordPress plugin stores the webhook secret server-side and does not expose private prompts or provider settings to front-end JavaScript.
- Submitted text fields are sanitised before packet storage.
- Output in admin/form views uses escaping helpers.
- Mock fixtures use fake `mock://` URIs and `example.test` email data.

Remaining production security work:

- Add nonce/capability hardening around public submission flows.
- Replace filename-only upload representation with WordPress media handling.
- Add webhook replay protection and timestamped HMAC verification.
- Add rate limits and spam protection for public forms.
- Run full WordPress plugin security testing in a PHP/WordPress environment.

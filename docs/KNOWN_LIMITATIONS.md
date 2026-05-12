# Known Limitations

This v1.0.0 MVP is stable for contract-first, mock-first development. It is not a production live image service yet.

- Live Perplexity, vision, and image generation providers are not connected.
- The n8n workflow export is a mock skeleton, not a full production workflow.
- WordPress activation has not been run in this container because PHP is unavailable here.
- File uploads are represented in the contract packet, but production media handling and permission hardening need a dedicated WordPress pass.
- Image generation currently records a mock output packet rather than producing a provider-rendered image.
- ImageManager is implemented as bounded prompts, schema validation, fixtures, and simulator routing; it is not yet wired to a live AI node.
- Security review is limited to static secret scans and keeping credentials out of committed files.

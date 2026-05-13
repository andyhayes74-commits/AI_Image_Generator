# Known Limitations

This branch is stable for contract-first, mock-first development and now has verified WordPress/n8n runtime checks. It is not a production live image service yet.

- Live Perplexity, vision, and image generation providers are not connected.
- The n8n workflow export is an importable contract-true mock workflow, not a full production workflow.
- WordPress activation and REST submission smoke checks pass in the local test install.
- File uploads use WordPress media handling in the plugin, but upload storage still needs browser-level/manual media QA before production use.
- Image generation currently records a mock output packet rather than producing a provider-rendered image.
- ImageManager routing is bounded in the n8n mock workflow and simulator; it is not yet wired to a live AI node.
- Security review is limited to static secret scans, runtime smoke checks, and keeping credentials out of committed files.

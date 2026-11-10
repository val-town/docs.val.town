---
title: "Migration guide"
description: "Val Town migration guide: Migration guide"
updated: 2026-11-07
---

[Val Town is winding down.](https://blog.val.town/winding-down) Code on Val Town will become read-only on December 10, 2026. Apps on Val Town ("vals") will continue running until January 10, 2027. We've prepared this migration guide for moving your vals to other platforms before then.

For support, email us at [support@val.town](mailto:support@val.town) — we are here to help.

## Migrating with your AI agent

To migrate with an AI agent, copy-paste this prompt:

```md
Val Town is winding down.

I need to migrate apps on Val Town ("vals") to another platform.

1. Help me install the Val Town plugin / MCP server so you can access my account: https://docs.val.town/guides/prompting/plugin
2. Help me figure out which vals I care about enough to move over
3. Help me figure out which platform to move to. For recommendations, read: https://docs.val.town/migration/where-to-migrate
4. Propose a concise migration plan for me to approve

For information on the Val Town platform, reference:

- https://github.com/val-town/plugins/tree/main/plugin/skills
- https://val.town/townie/system-prompt
- https://docs.val.town

[Val Town uses Deno as its JavaScript runtime](https://docs.val.town/reference/runtime), and [Deno itself is winding down](https://deno.com/blog/cloudflare). The core maintainers won't support Deno beyond October 2027, so we recommend moving to Node, Bun, or a provider-specific runtime like Cloudflare Workers or Vercel Functions.

After each migrated app is verified and its data is synced, redirect its `*.val.run` URLs to the new URL so existing links keep working. Confirm the new URL with me before setting each redirect, and update webhook URLs with their providers directly. See https://docs.val.town/migration/redirects

Ask the user if they want you to build and maintain html tracker of the migration progress. Recommended tables:

- Agents: main agent or subagent, model, current work. Show active agents only.
- Vals: name, % done (sort: low to high), status, remaining actions, live URL, val.run redirect, hosting/data dashboard links, repo/folder. Put original and migrated line counts at the far right if measured.
- Domains: domain, current registrar/DNS account, destination account, hosting status, registrar-transfer status, remaining actions.
- Email addresses: old address, replacement address, sending/forwarding/inbound handler, verification status, remaining actions.
- Todos: remaining action, related val/domain/email row, who handles it (user, main agent, or named subagent), and when it will be tackled.

Update the tracker as you work, not just at the end. Link todos back to the affected rows. Keep status and action labels short, with details on hover. Use a checkmark for completed work.

If you run into problems with these migration guides, open a GitHub issue at https://github.com/val-town/docs.val.town/issues with details, or submit a pull request with a fix. If you migrate to a platform we haven't covered, contribute a guide for it in a pull request so others can benefit.
```

## Migration guides

- [Where to migrate](/migration/where-to-migrate)

- [Cloudflare](/migration/cloudflare)

- [Vercel](/migration/vercel)

- [Netlify](/migration/netlify)

- [Render](/migration/render)

- [GitHub](/migration/github)

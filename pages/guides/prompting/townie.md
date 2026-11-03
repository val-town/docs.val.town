---
title: Townie
description: Townie, the Val Town coding agent
---

[Townie](https://val.town/townie) is Val Town's in-browser coding agent. Pretty much anything you can do in the Val Town UI, Townie can do: read, write, and run code; read SQLite, blob storage, logs, and environment variables; schedule crons; view version history, create branches; and more.

Powered by frontier models and the Val Town [MCP server](/guides/prompting/mcp). Available on all plans, including $1 of included credit on Free. Click the little robot in the top right corner on [val.town](https://val.town) to get started.

![Townie](/images/guides-prompting-townie-3ef24708.webp)

## Features

### Models

You can pick from the following models.

1. **Claude Haiku 4.5**
2. **Claude Sonnet 5**
3. **Claude Opus 5**
4. **Claude Fable 5.1**
5. **GLM-5.3 Flash**
6. **DeepSeek V4.1 Flash**

### Modes

1. **Auto**: Townie asks only before high-impact actions
2. **Allow all**: Townie YOLOs changes to your vals
3. **Plan**: Townie as your read-only thinking partner

### Tools

Townie has full access to our [MCP server](/guides/prompting/mcp), so it can do almost anything you as a user can do.

- List, search, & create vals
- Read, write, & run files
- Fetch a val's HTTP endpoint
- View history, create & switch branches, revert versions
- Query your SQLite databases & Blob storage
- Read & write environment variables
- Read logs (e.g. to debug)
- Read & configure cron jobs
- Remix vals
- List orgs
- ...

### System prompt

Our [system prompt](https://val.town/townie/system-prompt) is public. It provides Townie full context on how to use the Val Town platform—e.g. available [tools](#tools), the Val Town [runtime](/reference/runtime/), our standard library, different types of vals, etc.

### Context

Townie automatically attaches the val you're currently viewing as context. You can manually edit what vals are in context by selecting that menu in the chat bar.

### Keyboard shortcuts & slash commands

You can open Townie with `⌘J`. The following slash commands are available:

- `/cost` Show estimated cost and usage
- `/context` Show context window usage
- `/compact` Summarize older messages to save context
- `/clear` Start a new chat

### History & version control

You can view your Townie [chat history in settings](https://www.val.town/settings/chat-history) to read and continue old chats.

As when coding without AI, you can use Val Town's [versioning and collaboration](https://docs.val.town/vals/#versioning--collaboration) tools like branching, remixing, PRs, and version history to safely work with Townie.

## Pricing

Every Val Town plan includes Townie credit: [Business](https://www.val.town/pricing) and [Pro](https://www.val.town/pricing) include $100 and $10 of monthly usage respectively, and Free includes $1.

| 🟩 Business | 🟨 Pro     | 🟥 Free   |
| ----------- | ---------- | --------- |
| $100/mo cap | $10/mo cap | $1/mo cap |

## Learn more

Townie has been through many iterations, which we [wrote about](https://blog.val.town/townie-v5) on our blog. We also documented learnings from prior versions in: [What we learned copying all the best code assistants](https://blog.val.town/blog/fast-follow)

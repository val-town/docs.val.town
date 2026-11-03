---
title: Claude Code
description: Install and connect the Val Town plugin in Claude Code
updated: 2026-09-10
---

Use the Val Town plugin to read, edit, run, and deploy vals from Claude Code.
For Claude web/desktop/Cowork, use the [Claude guide](/guides/prompting/claude).

## Install the plugin

Inside a **Claude Code session**, paste:

```text
/plugin install valtown@claude-plugins-official
```

Alternatively, run this in your **terminal**, outside Claude Code:

```bash
claude plugin install valtown@claude-plugins-official
```

Choose either method. Both install the plugin from Claude Code’s official
marketplace.

## Connect your Val Town account

1. In Claude Code, run `/reload-plugins` to load the installed plugin, or
   restart Claude Code.
2. Run `/mcp` and select the Val Town server.
3. Follow the sign-in link, sign in to Val Town, and approve access.

## Check the connection

Start a new chat or session after installation and send:

```text
Use Val Town to list my vals. Don’t create or change anything.
```

A response from Val Town listing your vals, even an empty list, confirms the
connection. If the agent only explains how to list vals, ask it to use the Val
Town tools.

## Troubleshooting

- **The slash command fails in your terminal:** slash commands belong inside
  Claude Code. Use the `claude plugin install` command in your terminal.
- **The plugin is installed but no tools appear:** run `/reload-plugins` or
  restart, then check `/mcp`.
- **Tools appear but requests fail:** select the server in `/mcp` and complete
  authentication.
- **The marketplace or plugin is unavailable:** check your Claude Code version
  and organization’s plugin policy. See
  [Claude Code’s plugin documentation](https://code.claude.com/docs/en/discover-plugins).

## Alternative: MCP only

The plugin includes MCP and platform skills. If you only want the MCP
connection, run this in your **terminal**:

```bash
claude mcp add --transport http --scope user val-town https://api.val.town/v3/mcp
```

The user scope makes the connection available across your local projects. Start
Claude Code, run `/mcp`, select `val-town`, and sign in. Skip this if you
already installed the plugin, to avoid duplicate connections.

## Alternative: sync local files with the Val Town CLI

> **Caution** We recommend the plugin, which includes the MCP server and skills,
> over the CLI.

1. Install [Claude Code](https://docs.claude.com/en/docs/claude-code/quickstart)
2. Install the [Val Town CLI](https://github.com/val-town/vt)

```
deno install -grAf jsr:@valtown/vt
```

3. Copy-paste our
   [system prompt](https://www.val.town/x/valdottown/Townie/code/prompts/system_prompt.txt)
   into [`CLAUDE.md`](https://docs.claude.com/en/docs/claude-code/memory) at the
   root of your local directory for vals
4. `vt create`, `vt remix`, or `vt clone` a val\*
5. `cd` into your val's directory
6. (Optional) `vt checkout -b <branch>` to isolate changes
7. `vt watch` to sync with Val Town
8. `claude` to start your Claude Coding session

_\* Running `vt create|remix|clone` will ask you to add editor files including
`AGENTS.md`, which Claude doesn't support as of this writing (use `CLAUDE.md`
instead)._

As an example, watch this 4-minute video
[creating a customer support val](https://screen.studio/share/pYSiLKJU).
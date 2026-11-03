---
title: Cursor
description: Install and connect the Val Town plugin in Cursor
updated: 2026-09-10
---

Use the [Val Town plugin](/guides/prompting/plugin) to read, edit, run, and
deploy vals from Cursor.

## Install the plugin

1. Open **Customize** in Cursor’s sidebar.
2. Search for **Val Town** (it may be listed as `vals`) and select **Add to
   Cursor**.

## Connect your Val Town account

In **Customize**, find the Val Town MCP server, click on it to enable it, and
complete its connection prompts. Sign in with your Val Town account and approve
access.

## Check the connection

Start a new agent chat and send:

```text
Use Val Town to list my vals. Don’t create or change anything.
```

A response from Val Town listing your vals, even an empty list, confirms the
connection.

## Alternative: MCP only

If you only want the MCP connection, add this entry to your Cursor MCP
configuration. Skip this if you already installed the plugin, to avoid duplicate
connections.

Use `~/.cursor/mcp.json` for all projects, or `.cursor/mcp.json` in a project
for just that project. If the file already has servers, add the `val-town` entry
alongside them.

```json
{
  "mcpServers": {
    "val-town": {
      "url": "https://api.val.town/v3/mcp"
    }
  }
}
```

Find the server in **Customize**, enable it, and complete the browser sign-in
flow. You don’t need an API key for OAuth. Older Cursor versions may show these
controls under **Settings → Tools & MCP**.

## Troubleshooting

- **No Val Town tools appear:** check that the plugin and server are enabled,
  then start a new agent chat.
- **The server asks for authentication:** finish the browser sign-in flow from
  its connection controls.
- **Install is blocked:** check your organization’s plugin and MCP policies.
- **Your menu labels differ:** see Cursor’s current
  [plugin instructions](https://cursor.com/docs/plugins) and
  [MCP instructions](https://cursor.com/docs/mcp).

## Alternative: sync local files with the Val Town CLI

> **Caution** We recommend the plugin, which includes the MCP server and skills,
> over the CLI.

You can edit vals locally with Cursor and the Val Town CLI. The recommended
workflow uses `vt watch`, which will automatically sync your changes to Val Town
as you save files.

1. Open [Cursor](https://cursor.com)
2. Install the [Val Town CLI](https://github.com/val-town/vt)

```
deno install -grAf jsr:@valtown/vt
```

3. `vt create`, `vt remix`, or `vt clone` a val. Select "Yes" to add editor
   files\*
4. `cd` into your val's directory
5. `vt checkout -b <branch>` to isolate changes (optional)
6. `vt watch` to sync with Val Town

_\* Running `vt create|remix|clone` will prompt you to add editor files,
including `AGENTS.md` with our
[system prompt](https://val.town/townie/system-prompt), which Cursor should
recognize._
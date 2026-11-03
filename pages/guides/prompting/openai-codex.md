---
title: Codex
description: Install and connect Val Town in Codex desktop and CLI
updated: 2026-09-10
---

The Val Town plugin gives Codex tools to read, edit, run, and deploy vals, plus skills for building on Val Town. Choose the instructions for Codex desktop or CLI. For ChatGPT, use the [ChatGPT guide](/guides/prompting/chatgpt).

## Codex desktop

1. Open **Plugins**.
2. Search for **Val Town** and select **Install**.
3. Sign in with your Val Town account and approve access when prompted. You may be prompted when you first use the plugin.
4. Start a new task and run the connection check below.

![Val Town plugin in Codex](/images/guides-prompting-openai-codex-81910b17.webp)

## Codex CLI

Inside a **Codex session**, open the plugin browser:

```text
/plugins
```

Find **Val Town**, install it, and connect your Val Town account when prompted. Start a new session after installation.

### Alternative marketplace

If you want to use the marketplace from our GitHub repository, run this in your **terminal**:

```bash
codex plugin marketplace add val-town/plugins
```

This command **adds a marketplace; it does not install the plugin**. Next, start Codex, open `/plugins`, select the Val Town plugin from that marketplace, and install it. Connect your account and start a new session.

## Check the connection

Start a new chat or session after installation and send:

```text
Use Val Town to list my vals. Don’t create or change anything.
```

A response from Val Town listing your vals, even an empty list, confirms the connection. If the agent only explains how to list vals, ask it to use the Val Town tools.

## Troubleshooting

- **You added the marketplace but no tools appear:** open `/plugins` and install the plugin.
- **The plugin is installed but missing from an existing task:** start a new task or CLI session.
- **Tools are listed but need authentication:** finish the Val Town sign-in flow from the plugin’s connection settings or its first-use prompt.
- **You use multiple machines or a remote environment:** confirm that Val Town is installed and connected in the environment running the task.
- **You use the Codex IDE extension:** plugins aren’t currently supported there. Use a [remote MCP connection](/guides/prompting/mcp) or the [Val Town CLI](/guides/prompting/cli).
- **You want to connect ChatGPT web:** follow the [ChatGPT guide](/guides/prompting/chatgpt). Local Codex MCP configuration doesn’t configure ChatGPT web.

See OpenAI’s current [plugin documentation](https://learn.chatgpt.com/docs/plugins) and [MCP documentation](https://learn.chatgpt.com/docs/extend/mcp), or [ask us for help](https://discord.val.town/).

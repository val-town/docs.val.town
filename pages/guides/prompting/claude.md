---
title: Claude (Web, Desktop, Cowork)
description: Connect Val Town to Claude on the web and desktop
updated: 2026-09-10
---

Use Val Town from Claude on the web or in the desktop app. If you use Claude in
a terminal, follow the [Claude Code guide](/guides/prompting/claude-code)
instead.

## Install the plugin

Claude plugins are available on paid plans. If you don’t see Plugins, use the
[custom connector option](#add-a-custom-connector) below.

1. Open Claude, switch to "Chat and Cowork" mode (even if you typically use Code
   mode)
2. Open **Customize → Plugins**.
3. Search for **Val Town** in the plugin browser.
4. Select **Add**.

## Connect your Val Town account

After installing the plugin, you need to connect your account.

1. Open the installed Val Town plugin. (**Customize → Yours → Val Town**)
2. In its **Connectors** section, select the Val Town connector and click
   **Connect**.
3. If an **Add custom connector** dialog appears, select **Add**.
4. Select **Connect** for the Val Town connector.
5. Sign in to Val Town and approve access.

![Val Town connector in the Claude plugin](/images/guides-prompting-claude-756bde23.webp)

## Check the connection

Start a new chat or session after installation and send:

```text
Use Val Town to list my vals. Don’t create or change anything.
```

A response from Val Town listing your vals, even an empty list, confirms the
connection. If the agent only explains how to list vals, ask it to use the Val
Town tools.

## Add a custom connector

Use this option if the plugin isn’t available. You only need one Val Town
connection; skip this if the plugin’s connector is already connected.

1. Open **Customize → Connectors**.
2. Select **+ → Add custom connector**.
3. Enter **Val Town** as the name and copy this server URL:

```text
https://api.val.town/v3/mcp
```

4. Leave the optional advanced OAuth fields empty.
5. Select **Add**, then **Connect**.
6. Sign in to Val Town and approve access.
7. Start a new chat and run the connection check above.

This connects Val Town’s tools through MCP. The plugin also packages platform
skills.

## Troubleshooting

- **Plugins aren’t available:** use the custom connector option. Claude’s free
  plan allows a limited number of custom connectors; you may need to remove
  another connector or change plans.
- **You can’t add a connector in a managed workspace:** ask an owner or
  administrator to enable it.
- **The plugin is installed but Val Town tools aren’t available:** check its
  Connectors section and finish connecting your account.
- **The connector is connected but an existing chat can’t see it:** start a new
  chat and check that the connector is enabled for that chat. If the desktop app
  still shows old settings, quit and reopen it.
- **You installed with a terminal command:** Claude Code’s configuration doesn’t
  add a connector to Claude web or desktop. Follow the steps above.

Claude’s menu labels can change. See its current
[plugin instructions](https://support.claude.com/en/articles/13837440-use-plugins-in-claude)
and
[connector instructions](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities),
or [ask us for help](https://discord.val.town/).
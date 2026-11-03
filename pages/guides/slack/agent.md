---
title: Build your own Slack agent
description: BYOA (Bring Your Own Agent) to Slack
updated: 2026-09-16
---

This guide takes you through building a Slack agent in Val Town, using the
Vercel AI SDK. In 5 or 10 minutes, you'll have an agent that can respond to DMs
and mentions in Slack channels.

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/jmZbroNh8PM?si=SCpeuyoJ8vV5usg4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Quick setup

1. Remix our [ai-slackbot](https://www.val.town/x/templates/ai-slackbot)
   template
1. Fill out your Slack app name and bot name on the remixed val, click Create
   Slack App, and follow the steps to install in your Slack workspace
1. Add [environment variables](/reference/environment-variables/) in your
   remixed val:

- `SLACK_BOT_TOKEN` in your Slack app: OAuth & Permissions > OAuth Tokens > Bot
  User OAuth Token
- `SLACK_SIGNING_SECRET` in your Slack app: Basic Information > Signing Secret
- `ANTHROPIC_API_KEY` from the
  [Claude console](https://platform.claude.com/settings/keys)

At this point, you should already be able to chat with your agent in Slack via
@mention in channels, or directly via the Slack app's chat interface. Next,
we'll walk through how the code works so you can make it your own.

## How it works

### Scopes & events

Our [ai-slackbot](https://www.val.town/x/templates/ai-slackbot) template uses a
Slack [app manifest](https://docs.slack.dev/app-manifests/) to speed up
configuration. You can also create a Slack app from scratch and manually select
which scopes your bot has access to and which events it subscribes to. The
template adds the following scopes:

1. `app_mentions:read`
1. `assistant:write`
1. `channels:history`
1. `groups:history`
1. `chat:write`
1. `im:history`
1. `im:write`

And subscribes to these events:

1. `app_mention`
1. `assistant_thread_started`
1. `message.im`

You may want to edit your remixed val's `lib/slack.manifest.ts` file, which also
includes configuration like suggested prompts for Slack users of your app.

### Dependencies

The ai-slackbot template is built using Hono for routing, Vercel's AI SDK for
chatbot functionality, and Slack's Web API.

- Slack's Web API (v7.14.1)
- Hono (v4.12.0)
- Vercel's AI SDK (v6.0.92)

### Webhook handler

The `events.ts` file exposes an API from the val's HTTP URL using Hono. The
`POST /events` route is where Slack webhooks come in, and the `POST /process`
route handles each based on its type (@mention, thread started, or generic
message). It also verifies that webhooks are indeed coming from Slack. The event
types are:

1. `app_mention`: fires when you @mention your agent in a Slack channel or
   thread
1. `assistant_thread_started`: fires when you create a new chat directly with
   the agent app
1. `message`: fires when you send a message in an agent app chat

> **Note** Slack
> [expects a response within 3 seconds](https://docs.slack.dev/apis/events-api/#failure)
> to confirm the request is being handled. It'll retry automatically if a
> response takes too long. Since LLM inference can take longer, we use a
> fire-and-forget pattern that responds to the HTTP request immediately then
> continues with the LLM call and sends it back to Slack when done.

### App mentions

When you mention your bot in a channel or channel thread, the `app_mention`
event is triggered, which we handle in `handle-app-mention.ts`:

1. Checks if the message is from a bot to avoid infinite response loops
2. Creates a status updater to show the bot is "thinking"
3. If the mention is in a thread, it retrieves the thread history
4. Calls the LLM with the message content

### Assistant thread messages

When you start a thread with your assistant in its dedicated Slack app chat
interface, the `assistant_thread_started` event is triggered, which we handle in
`handle-thread-started.ts`:

1. Your agent sends a welcome message to the thread
2. Sets up suggested prompts to help users get started

You should tailor these, of course, based on your needs.

### DMs

For direct messages to your bot in its dedicated Slack app chat interface, the
`message` event is triggered, which we handle in `handle-message.ts`:

1. Ignore messages from the agent (bot) itself
1. Update the status ahead of the LLM call
1. Retrieve the conversation history
1. Call the LLM with the conversation context
1. Post the LLM's response to the thread

### LLM calls

The core AI parts of your agent live in `generate-response.ts`:

1. Loads your system prompt
1. Uses the Vercel AI SDK's `generateText` function with Anthropic's
   `claude-sonnet-5` model
1. Passes tools to the LLM: web search
1. Formats the response for Slack's markdown format

## Make it your own

We've set up this val template and guide with web search as its only tool, but
the goal is for you to make it your own! You could connect to the Val Town MCP
server so that your agent can build and run your vals from Slack. Or you could
create a customer support bot, like this
[template for Pylon](https://www.val.town/x/templates/pylon-support-bot). You
could refactor the val to use other language models, either swapping the model
id to stay in the Anthropic family (e.g. `claude-fable-5-1`), or using another
provider or gateway like OpenRouter.

If you're building a Slack agent for your team in Val Town, we'd be happy to set
up a Slack connect channel to demo and lend a hand!
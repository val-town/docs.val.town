---
title: Receive Slack webhooks & send messages
description: Receive Slack webhooks and send messages to Slack channels from Val Town
updated: 2026-09-15
---

This guide walks you through sending a Slack message from Val Town in response
to an [incoming Slack webhook](https://api.slack.com/messaging/webhooks).

## 1. Create a Slack app & webhook

1. [Click here to create a new Slack app](https://api.slack.com/apps?new_app=1)
2. Click **From Scratch**
3. Type an **App Name**
4. Select your Slack workspace

![Create Slack app](/images/guides-slack-send-messages-to-slack-c6ad17b4.webp)

5. Click **Incoming Webhooks** in the left sidebar of your app (under
   **Features**)
6. Toggle **Activate Incoming Webhooks** to **On**

![Enable incoming webhooks](/images/guides-slack-send-messages-to-slack-a0ca9c01.webp)

7. Click **Add New Webhook** at the bottom of the page
8. Select your target channel
9. Copy the **Webhook URL** from Slack
10. (Bonus) Customize the **App icon** under **Basic Information** in the left
    sidebar ([Val Town icons](https://www.val.town/brand))

## 2. Add the webhook URL to Val Town

1. Click **Environment Variables** in your val's left sidebar
2. Add a new env variable with key: **SLACK_WEBHOOK_URL**
3. Paste the webhook URL you copied from Slack as the value

![Copy webhook URL](/images/guides-slack-send-messages-to-slack-3c46ee2a.webp)

## 3. Send a message

Now you're ready to send your first message to Slack!

```ts
import { IncomingWebhook } from "npm:@slack/webhook";

const slack = new IncomingWebhook(Deno.env.get("SLACK_WEBHOOK_URL"));
const EDIT = `<${import.meta.url.replace("esm", "val")}|(edit val)>`;
await slack.send(`🥳 Hi from Val Town! ${EDIT}`);
```

![Message sent](/images/guides-slack-send-messages-to-slack-a712608e.webp)

We recommend including this link to the edit val, so everyone on your team is
one click away from making changes.

## Learn more

Learn how to
[make your message fancy with advanced formatting](https://api.slack.com/messaging/webhooks#advanced_message_formatting).

Take this a step further by responding to mentions, slash commands, buttons, and
other user interactions with our full [Slack bot guide](/guides/slack/bot/)!

You can find more Slack examples on our
[Templates page](https://www.val.town/explore/use-cases).
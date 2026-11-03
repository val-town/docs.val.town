---
title: Send Discord message via webhook
description: Shows you how to receive webhooks from Discord on Val Town.
updated: 2023-12-22
---

1. Create a Discord webhook
2. Add the webhook to your [Val Town environment variables](https://www.val.town/settings/environment-variables)
3. Use `@stevekrouse.discordWebhook` to send the message

![untitled.png](/images/guides-discord-send-message-38cee21d.webp)

```ts
import { fetchText } from "https://esm.town/v/stevekrouse/fetchText?v=5"; // pin to proxied fetch

export const discordWebhook = async ({
  url,
  content,
}: {
  url: string;
  content: string;
}) => {
  const text = await fetchText(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (text.length) throw Error("Discord Webhook error: " + text);
};
```

You can [browse example usages of this function here](https://www.val.town/v/stevekrouse.discordWebhook/references).

## Example Integration

![untitled-1.png](/images/guides-discord-send-message-894cd33c.webp)

<iframe src="https://www.val.town/embed/maxm/discordClerkWebhookHandlerExample" class="val-embed" loading="lazy"></iframe>
---
title: GitHub webhooks
description: Send yourself an email or Slack/Discord message when someone stars your GitHub repository
updated: 2026-09-08
---

GitHub supports sending webhooks for a
[number of events](https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads).
The example in this guide uses [@std/email](/reference/std/email/) to send
yourself an email when someone stars your GitHub repository (a.k.a.
[Catching stars](https://blog.val.town/catching-stars)). But you could also send
a message to [Slack](/guides/slack/send-messages-to-slack/),
[Discord](/guides/discord/send-message/), etc., or do something else entirely.

## Creating a webhook handler

1. Create a val with an [HTTP trigger](/vals/http), or remix
   [`templates/github-webhook`](https://www.val.town/x/templates/github-webhook)
2. Go to your GitHub repo's Settings > Webhooks
3. Copy-paste your val's HTTP URL as the Payload URL
4. Set the Content type to `application/json`
5. Add a high entropy secret
6. Select "Stars" (or whichever event(s) you want to receive)

Your val handler function should look something like this:

```ts
import { email } from "https://esm.town/v/std/email?v=11";

export default async function githubStarWebhook(req: Request) {
  if (req.method === "GET") return new Response("Ready to receive webhooks...");

  const { action, sender, repository } = payload;
  if (action === "created") {
    const repo = repository.full_name;
    const stargazer = sender.login;
    await email({ text: `Repo ${repo} starred by ${stargazer}` });
  }

  return new Response("OK", { status: 200 });
}
```

And your configuration in GitHub like this:

<img
  alt="create a webhook in github"
  src="/images/guides-github-receiving-a-github-webhook-fd1eb54a.webp"
  style="border: 2px solid var(--beige)"
/>

When your GitHub repository is starred, GitHub will send a webhook payload to
your val, and you'll get an email!

## Securing GitHub Webhooks

Once public, your val function will listen for any payload sent to its endpoint.
For security reasons, you probably want to limit requests to those coming from
GitHub. One method is to add a secret token and perform validation.

Copy the secret you created in step 5 above on GitHub and paste it in your
[environment variables](/reference/environment-variables/) on Val Town. GitHub
uses this secret to create a hash signature with each payload. This hash
signature is sent as a header: `x-hub-signature-256`.

With your secret, the payload, and the signature header, you can use Octokit's
[`verify`](https://github.com/octokit/webhooks.js/#webhooksverify) function to
confirm that the webhook came from GitHub. Your val should now look something
like this:

```ts
import { email } from "https://esm.town/v/std/email?v=11";
import { verify } from "https://esm.sh/@octokit/webhooks-methods@3.0.2?pin=v106";

export default async function githubStarWebhook(req: Request) {
  if (req.method === "GET") return new Response("Ready to receive webhooks...");

  const payload = await req.json();
  const verified = await verify(
    Deno.env.get("GITHUB_WEBHOOK_SECRET"),
    JSON.stringify(payload),
    req.headers.get("X-Hub-Signature-256"),
  );
  if (!verified) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { action, sender, repository } = payload;
  if (action === "created") {
    const repo = repository.full_name;
    const stargazer = sender.login;
    await email({ text: `Repo ${repo} starred by ${stargazer}` });
  }

  return new Response("OK", { status: 200 });
}
```

With your webhook pointing to the new example, your val now refuses payload that
don't come from GitHub! For more details, read GitHub's in-depth guide on
[securing webhooks](https://docs.github.com/en/webhooks-and-events/webhooks/securing-your-webhooks).

## Debugging webhooks

In your handler val, you can see all HTTP requests in Logs. You can also debug
this on the GitHub side by selecting "Edit" in Settings > Webhooks then review
the Recent Deliveries tab.
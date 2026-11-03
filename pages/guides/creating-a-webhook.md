---
title: Handling webhooks
description: Use Val Town to receive HTTP webhooks from services like Stripe, GitHub, and Notion
updated: 2026-09-08
---

Val Town is a very good fit for handling webhooks. You can create a val with an
[HTTP trigger](/vals/http) and copy-paste its URL as a webhook destination.

<iframe width="100%" height="376px" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/trBH2bdS77o?si=QWU4K2RolYhJ0fA6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## What's a webhook?

A webhook is an event with some data, sent to some URL. Many apps send webhooks
when something happens, like:

- A new Stripe subscription
- A star on a GitHub repo
- A comment on a Notion doc

Those apps—Stripe, GitHub, Notion, etc.—let you configure where to send
webhooks. When an event happens, they will send an HTTP request to a URL you
specify, and you can do whatever you want with that data.

## Creating a webhook

While the specifics vary by service, the general steps are:

1. Create an HTTP trigger to receive the webhook in Val Town
2. Write some code to do something with incoming webhooks
3. Copy-paste your val's URL into the sender app's configuration
4. Secure the webhook by validating the request came from the app

To respond to a webhook, export a function from a file with an HTTP trigger:

```ts
export default function (req: Request): Response {
  console.log(req.body);
  return Response.json({ ok: true });
}
```

_Note: if your handler function awaits long-running tasks, you can early return
a `200` so that the sender won't retry the request._

## Example

We have examples for receiving webhooks from
[GitHub](/guides/github/receiving-a-github-webhook), [Stripe](/guides/stripe),
and [Supabase](/guides/supabase). But you could handle any webhook in Val Town.
Let us know if there are specific integrations you'd like us to document!
---
title: "Migrate email"
description: "Val Town migration guide: Migrate email"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose sending and receiving

Netlify Functions call an external mail provider. Val Town’s default sender and `@valtown.email` addresses do not transfer. Record whether the app sends, forwards, or runs code on incoming mail.

This example uses [Resend](https://resend.com/docs), but keep an existing provider where it already works.

## Send mail

Verify a sending domain in the provider dashboard and add the required DNS records without removing existing mail records. Store `RESEND_API_KEY`, `MAIL_FROM`, and the test recipient in Netlify’s Functions env vars. Install `resend`.

Use this in the app’s existing server-side flow, not an unauthenticated public send endpoint:

```ts
import { Resend } from "resend";

export async function sendNotice(to: string, subject: string, text: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM!,
    to, subject, text,
  });
  if (error) throw new Error("Email provider rejected the request");
  return data!.id;
}
```

Preserve reply-to, HTML, and attachments when the original app uses them. Restrict recipients and permissions exactly as the existing app does.

## Receive mail

Use a dedicated receiving subdomain such as `inbound.example.com` unless replacing the existing mailbox provider is intended. Configure a receiving domain/address and an `email.received` webhook in Resend pointing to the deployed Function URL. Store the webhook’s signing secret as `RESEND_WEBHOOK_SECRET`.

Save as `netlify/functions/incoming-email.ts` and connect `handleInbound` to the original application behavior:

```ts
import { Resend } from "resend";
import { handleInbound } from "../../src/handle-inbound";

export default async (request: Request) => {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  let event;
  try {
    event = resend.webhooks.verify({
      payload: await request.text(),
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (event.type === "email.received") {
    const { data, error } = await resend.emails.receiving.get(event.data.email_id);
    if (error || !data) return new Response("Fetch failed", { status: 502 });
    await handleInbound({
      id: data.id, from: data.from, to: data.to, subject: data.subject,
      text: data.text, html: data.html, attachments: data.attachments,
    });
  }
  return new Response(null, { status: 204 });
};
```

[Verify the raw body](https://resend.com/docs/webhooks/verify-webhooks-requests) before parsing/processing. The code retrieves the received message and maps fields before invoking app logic. If the app needs attachment bytes, fetch them using Resend’s attachment API before processing; attachment metadata alone is not the content. Make `handleInbound` deduplicate by event/message ID so retries do not repeat effects. Use ordinary provider forwarding if the app only needs forwarding, not a webhook.

## Verify and switch

Send from another account to a controlled recipient. Confirm receipt, replies, attachments, login links, and inbound processing. Test an invalid webhook signature. An accepted API call is not proof of delivery.

Update forms and external services using the old address; keep old routing until these checks pass. Remove test mail and temporary endpoints without deleting real user messages.

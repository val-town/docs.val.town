---
title: "Migrate email"
description: "Val Town migration guide: Migrate email"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose sending and receiving separately

Vercel runs the HTTP handler; an email provider sends mail and delivers incoming-mail webhooks. [Resend](https://resend.com/docs) is one option used below, not a required provider.

Record sender, destination, reply-to, attachments, and what incoming mail does. Val Town’s default inbox and `@valtown.email` addresses do not move automatically.

## Set up the domain and credentials

Verify a domain with the provider. Add only the DNS records it requires; keep existing mail delivery intact, or use a dedicated subdomain. Configure the new sender/address and webhook URL.

Install `resend` and set `RESEND_API_KEY`, `MAIL_FROM`, and `RESEND_WEBHOOK_SECRET` through [Transfer env vars](/migration/vercel/transfer-env-vars). Never include them in browser code.

## Send transactional mail

Use the server SDK instead of `std/email`:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(to: string, subject: string, text: string) {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM is required");
  const { data, error } = await resend.emails.send({ from, to, subject, text });
  if (error) throw new Error("Email provider rejected the message");
  return data?.id;
}
```

Carry over HTML, attachments, reply-to, and idempotency keys where the app uses them. Sending success means acceptance, not inbox delivery.

## Receive mail

Create a receiving address/domain in Resend, subscribe the Vercel endpoint to `email.received`, and use the webhook’s signing secret. A starting adapter for `api/incoming-email.ts`:

```ts
import { Resend } from "resend";
import { handleIncomingEmail } from "../lib/incoming-email";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return new Response("Not configured", { status: 503 });
  let event;
  try {
    event = resend.webhooks.verify({
      payload: await request.text(),
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }
  if (event.type !== "email.received") return new Response(null, { status: 204 });
  const { data, error } = await resend.emails.receiving.get(event.data.email_id);
  if (error || !data) return new Response("Retry later", { status: 503 });
  await handleIncomingEmail(data);
  return new Response(null, { status: 204 });
}
```

Implement `handleIncomingEmail` using the app’s existing behavior. Deduplicate by the provider email ID in persistent storage; retries must not trigger the effect twice. [Verify the raw body](https://resend.com/docs/webhooks/verify-webhooks-requests) before parsing or acting. Fetch attachment bytes separately if needed; webhook metadata is not the attachment itself.

## Verify

If the site uses All Deployments protection, follow [Migrate Access](/migration/vercel/migrate-access) to admit the signed webhook narrowly. Test an actual provider delivery through the protected deployment; a local signature test does not prove it reaches the handler.

Test a controlled inbox, reply behavior, attachments, and single-use login links. Send inbound mail from another account. Check invalid signatures, duplicate events, and provider retries. Update forms and external services using the old address; keep the old route until the replacement works.

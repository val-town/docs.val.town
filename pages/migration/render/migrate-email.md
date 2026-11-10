---
title: "Migrate email"
description: "Val Town migration guide: Migrate email"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Separate the behaviors

Sending, forwarding, and processing inbound email are different migrations. Render does not supply a replacement `@valtown.email` address.

Choose a provider that supports the required behavior. Record sender, recipients, reply-to, attachments, and incoming-mail actions. Verify the domain/DNS before switching addresses. Keep existing MX records unless changing inbox delivery is intended.

## Send email

Use the provider's HTTPS API; free Render services [block outbound SMTP ports](https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports). For example, with [Resend](https://resend.com/docs/send-with-nodejs), install `resend` and configure the verified sender/key:

```javascript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const result = await resend.emails.send({
  from: process.env.MAIL_FROM,
  to: process.env.TEST_INBOX,
  subject: "Migration test",
  text: "Test message from the migrated app.",
});
if (result.error) throw new Error("Email provider rejected the message");
```

Use a controlled inbox for testing. Preserve the app's content, attachments, reply-to, and idempotency behavior.

## Receive or forward

Use the provider's forwarding feature for a simple inbox alias. For application processing, configure an inbound webhook pointing to the Render web service. Verify the signature using the original raw request body before JSON parsing; parse the provider's payload/MIME format and fetch attachments using its authorized API. Deduplicate by event/message ID.

Update forms, documentation, and services that still use the old address. Configure authentication callback URLs separately.

## Verify

Confirm actual inbox receipt, replies, attachments, incoming processing, and single-use login links with a persistent session. An accepted API call is not proof of delivery. Keep the old routing until replacement delivery is verified.

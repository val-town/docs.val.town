---
title: "Migrate email"
description: "Val Town migration guide: Migrate email"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Identify the behavior

These are separate migrations:

<div class="table-scroll">

| Val Town behavior | Cloudflare replacement |
| --- | --- |
| Send transactional email | [Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/) |
| Forward mail to an inbox | [Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/) |
| Run code on incoming mail | [Email Worker](https://developers.cloudflare.com/email-routing/email-workers/) |

</div>

Record sender, recipient, reply-to addresses, attachments, and what incoming mail triggers. Val Town’s default account email and `@valtown.email` addresses do not automatically transfer.

## Configure the domain

Choose addresses on a domain the user controls. Cloudflare Email Service requires Cloudflare DNS. Onboard the domain for sending and/or routing; review the required DNS records before changing existing mail delivery.

For forwarding, verify the destination inbox. For incoming handlers, route the address to the Worker. Do not replace existing MX records without accounting for the mail service already using them.

## Adapt the code

Use a `send_email` binding for outbound messages. Preserve subject, text/HTML, reply-to, and attachments using the current [sending API](https://developers.cloudflare.com/email-service/api/).

For inbound mail, implement the Worker’s `email(message, env, ctx)` handler. Parse the raw MIME message when the app needs its body or attachments. Preserve rejection, forwarding, and duplicate-handling behavior.

Update forms, documentation, and external services that use the old address.

## Verify

Send to a controlled inbox and confirm receipt, reply behavior, links, and attachments. Test inbound processing from another account. Check login links are single-use and create a working session.

An accepted API call alone does not prove delivery. Retain old routing until the replacement is verified.

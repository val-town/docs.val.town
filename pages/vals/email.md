---
title: Email
description: A val that can receive email
updated: 2026-09-03
---

> Btw: Vals can send email, too! See [`std/email`](/reference/std/email)

Email triggers provide a unique email address for your val, like
`acme-support@valtown.email`. When Val Town receives an email at that address,
it triggers the corresponding file within your val, passing the email's subject,
body, attachments, and more data. You could use email triggers to:

- Automatically forward email
- Post support email to Slack or Discord
- Have an LLM draft a reply

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/n1CEu-_7F6c?si=AxV8-Q_zzFN3i8Vt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>

## Adding an email trigger

To add an email trigger, click the `+ Add trigger` button in the top right of
your val editor and select `EMAIL`. You can also add or remove email triggers
from the triple dots menu next to the `Run` button, or via our
[MCP server](/guides/prompting/mcp).

<img
  alt="add an email trigger"
  src="/images/vals-email-6062efb2.webp"
  style="border: 2px solid var(--beige)"
/>

## Setting a custom email address

Similar to HTTP trigger [custom subdomains](/vals/http/custom-subdomains/), you
can set a custom email address by clicking on the pencil icon in the top right
of your editor. You can choose any available email address ending in
`@valtown.email` that has not been reserved or taken by another user.

<img
  alt="add a custom email address"
  src="/images/vals-email-652c707b.webp"
  style="border: 2px solid var(--beige)"
/>

## Email function signature

Files triggered by Email receive an argument called `Email` that represents the
email that was sent. Here's an example:

```ts
export async function emailValHandler(email: Email) {
  console.log("Email received!", email.from, email.subject, email.text);
  for (const file of email.attachments) {
    console.log(`Filename: ${file.name}`);
    console.log(`Content Type: ${file.type}`);
    console.log(`Content: ${await file.text()}`);
  }
}
```

The `Email` type has this shape:

```ts
interface Email {
  from: string;
  to: string[];
  cc: string | string[] | undefined;
  bcc: string | string[] | undefined;
  subject: string | undefined;
  text: string | undefined;
  html: string | undefined;
  attachments: File[];
  headers: Record<string, string>;
}
```

## Example

This email trigger forwards any email it receives. Try it out by sending an
email to `stevekrouse.forwarder@valtown.email`.

<iframe src="https://www.val.town/embed/x/valdottown/forwarder/forwarder" class="val-embed" loading="lazy"></iframe>

## Limitations

The total size of inbound emails, including attachments, must be less than 30MB.

_Email triggers are powered internally by
[Sendgrid Inbound Parse](https://www.twilio.com/docs/sendgrid/ui/account-and-settings/inbound-parse)._
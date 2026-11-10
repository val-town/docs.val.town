---
title: "Where to migrate"
description: "Val Town migration guide: Where to migrate"
updated: 2026-11-07
---

We've put together a shortlist of replacements for these core Val Town features:

1. [Website](#web)
2. [SQLite](#sqlite)
3. [Blob](#blob)
4. [Cron](#cron)
5. [Email](#email)
6. [Access](#access)
7. [AI](/migration/cloudflare/migrate-ai)

The following table summarizes providers that have the biggest feature overlap with Val Town. We've provided more information on each and additional alternatives below. If there's a provider missing that you'd like to migrate to, let us know—we'd be glad to help you migrate and update this guide accordingly for others.

<div class="table-scroll">

|  | Website | SQLite | Blob | Cron | Email | Access | AI | FaaS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cloudflare | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Render | ✓ |  |  | ✓ |  |  |  |  |
| Vercel | ✓ |  | ✓ | ✓ |  | ✓ | ✓ | ✓ |
| Netlify | ✓ |  | ✓ | ✓ |  | ✓ | ✓ | ✓ |
| Supabase |  | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |
| Railway | ✓ |  | ✓ | ✓ |  |  |  | ✓ |

</div>

> *Note: A checkmark in the table indicates that the provider includes the feature as a built-in product, but in many cases it would be straightforward to set up that feature using an external service—e.g. using Resend for email on Vercel; using SQLite on Render Persistent Disks.*

## All-in one

### [Cloudflare](https://www.cloudflare.com/)


Cloudflare is the most feature-equivalent platform to Val Town. Some of us on the Val Town team have decided to move our own vals to Cloudflare, including the Val Town blog and docs.


### [Vercel](https://vercel.com/)

Vercel is a very popular hosting provider. It has almost all of the features from Val Town built-in, or near at hand via their [Marketplace](https://vercel.com/marketplace).

## Web

There are many web hosting providers, including but not limited to:

- [Render](https://render.com/)
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.com/)
- [Digital Ocean](https://www.digitalocean.com/)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Fly.io](https://fly.io/)

## SQLite

### [Turso](https://turso.tech/)

Turso is the underlying provider for Val Town SQLite.

### [Cloudflare D1](https://developers.cloudflare.com/d1/)

D1 is Cloudflare's managed SQLite database, which you can query from Cloudflare Workers and Pages projects. Cloudflare also offers [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/).

### Other

To use SQLite, you may also consider libraries like [node:sqlite](https://nodejs.org/api/sqlite.html), [bun:sqlite](https://bun.com/docs/runtime/sqlite), and [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) with your preferred hosting provider.

## Blob

There are many alternatives for blob/object storage, including but not limited to:

- [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
- [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Supabase Storage](https://supabase.com/storage)
- [Upstash Blob](https://upstash.com/blob)
- [Neon Object Storage](https://neon.com/object-storage)
- [Railway Buckets](https://docs.railway.com/storage-buckets)
- [Google Cloud Storage](https://cloud.google.com/storage)

## Cron

There are many alternatives for cron jobs, including but not limited to:

- [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Render Cron Jobs](https://render.com/docs/cronjobs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [GitHub Actions](https://github.com/features/actions)
- [Railway Cron Jobs](https://docs.railway.com/cron-jobs)
- [Upstash QStash](https://upstash.com/qstash)
- [Netlify Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Supabase Cron](https://supabase.com/docs/guides/cron)

## Email

### Receiving email

Val Town allowed you to programmatically receive email and run arbitrary code. Alternatives include but are not limited to:

- [Cloudflare Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Resend Inbound](https://resend.com/features/inbound)
- [Postmark Inbound Email](https://postmarkapp.com/inbound-email)
- [Mailgun Inbound Email Routing](https://www.mailgun.com/features/inbound-email-routing/)
- [SendGrid Inbound Parse](https://www.twilio.com/docs/sendgrid/ui/account-and-settings/inbound-parse)

### Sending email

Val Town offered transactional email with the std/email library. Alternatives include but are not limited to:

- [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Resend](https://resend.com/)
- [Postmark](https://postmarkapp.com/)
- [Amazon SES](https://aws.amazon.com/ses/)
- [Mailgun](https://www.mailgun.com/)
- [SendGrid](https://www.twilio.com/en-us/sendgrid) (Twilio)
- [Loops](https://loops.so/)
- [Kit](https://kit.com/)
- [nodemailer](https://www.npmjs.com/package/nodemailer)

## Access

[Val Town Access](https://docs.val.town/reference/access) and [OAuth](https://docs.val.town/guides/auth#sign-in-with-val-town) allowed restricting `*.val.run` URLs to you and your team, or specific people you shared a val with (like Google Doc sharing permissions). Alternatives include but are not limited to:

- [Cloudflare Access](https://www.cloudflare.com/sase/products/access/)
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [Supabase Auth](https://supabase.com/auth)
- [Tailscale](https://tailscale.com/)

## Vibe Coding platforms

### [Lovable](https://lovable.dev/)


Lovable is the ostensible leader in the vibe coding space. Apps and websites created using Lovable are React applications, and it has a Supabase integration for PostgreSQL data storage (along with integrations for payments, AI, analytics, and more). Lovable has an import tool for migrating existing projects from other platforms.


### [Replit](https://replit.com/)

Like Val Town, Replit existed before ChatGPT as an in-browser coding and deployment platform. Nowadays the Replit experience is similar to that of Lovable, creating fullstack React apps and websites via a chat interface. Replit also has a Figma-like design view, and integrations for data storage, authentication, analytics, and more.

### [v0](https://v0.app/)

v0 is Vercel's vibe-code and -design tool. It is a good landing spot if you would like to work with the Vercel ecosystem, using Next.js and/or Vercel Blob and Cron Jobs, for example. They have an integration with Neon for PostgreSQL data storage. v0 integrates with Vercel's AI Gateway, if having a wide selection of LLMs is important to you.

### [ChatGPT Sites](https://openai.com/academy/chatgpt-sites/)

ChatGPT Sites is OpenAI’s quick live website tool. Unlike the fullstack platforms above, ChatGPT Sites is more suited to simpler static sites, and it is still a beta product (which OpenAI seems to not be heavily invested in). It could be a fit if you only need to migrate simple sites and already use ChatGPT / don't want yet another tool.

### [Claude Artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)

Claude Artifacts are most similar to ChatGPT Sites on this list, but even simpler—meant for prototypes and ephemeral personal or shared tools. Artifacts can only be published to `claude.ai/artifact/*` URLs, and you cannot link custom domains. Artifacts can be HTML pages, slide decks, documents, or design files, and you can store data in an Artifact.

### Other

If you'd like to read more about the five tools above, Pete tested each out and wrote [an opinionated review](https://app.notion.com/how-to-make-a-website-in-2026). There are many other vibe coding tools, including but not limited to:

- [Cursor](https://cursor.com/)
- [Gemini](https://gemini.google.com/)
- [Bolt](https://bolt.new/)
- [Base44](https://base44.com/)
- [Retool](https://retool.com/)

An adjacent category of tools worth mentioning are in-browser code editors. These tools range from lightweight social coding playgrounds (i.e. write and run code, share a URL) to heavier sandboxes. Popular options include:

- [Codepen](https://codepen.io/)
- [JSFiddle](https://jsfiddle.net/)
- [Observable](https://observablehq.com/)
- [CodeSandbox](https://codesandbox.io/)
- [GitHub Codespaces](https://github.com/features/codespaces)

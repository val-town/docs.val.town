---
title: In, Val, Out
description: Manage input (like user signups) and automate output (e.g., Slack messages)
updated: 2026-08-14
---

A common pattern in Val Town is what we call _In, Val, Out_, or Input/Val/Output
(I/V/O). You have data coming in, and you want to do something with it then
output something. For example:

1. Webhook received from Supabase when a user signs up

2. Enrich the user data with Clay

3. Send your team a Slack notification

There's a combinatorial explosion of possibilities, so we've listed some
examples and ideas. Feel free to add new use cases, or
[ask](https://discord.gg/dHv45uN5RY) [us](mailto:docs-help@val.town) to lend a
hand—we're happy to help.

## Input

**Messages, email:**

- [Email](/vals/email/) — Handle received emails
- [Gmail](/guides/gmail/) — Handle forwarded emails from Gmail
- [Slack bot](/guides/slack/bot/) — Handle incoming Slack messages
- [Discord bot](/guides/discord/how-to-make-a-discord-bot-24-7/) — Handle
  incoming Discord messages
- [Telegram bot](/guides/telegram/) — Handle incoming Telegram messages

**Events:**

- [GitHub webhooks](/guides/github/receiving-a-github-webhook/) — Receive GitHub
  webhooks for issues, stars, PRs, etc.
- [Supabase webhooks](/guides/supabase/) — Handle Supabase webhooks for inserts,
  updates, and deletes
- [Stripe webhooks](/guides/stripe/) — Handle Stripe webhooks, e.g., orders,
  refunds, etc.
- [HTML forms](/guides/save-html-form-data/) — Send HTML form data in a POST
  request

You can hook up any tool in your stack as long as it can send data to your val's
HTTP endpoint or email. That might be data from Clerk, Vercel, Linear, Sentry,
Cal.com, Shopify, PostHog, Cloudflare, Google Forms, Typeform, or anywhere
else—just send it to a val.

## Val

**AI enrichment, browser automation:**

- [std/openai](/reference/std/openai) — Prompt an OpenAI model
- [Clay](https://blog.val.town/clay) — Enrich user data with Clay
- [Browserbase](/guides/browser-automation/browserbase/) — Search the web with
  Browserbase
- [Kernel](/guides/browser-automation/kernel/) — Search the web with Kernel
- [Steel](/guides/browser-automation/steel/) — Search the web with Steel

You can also call your LLM of choice, like Claude, or run arbitrary enrichment
and analysis using other tools, like Exa.

## Output

**Notifications:**

- [Email](/reference/std/email) — Send email directly from a val
- [Slack](/guides/slack/send-messages-to-slack/) — Send a Slack message to your
  team
- [Discord](/guides/discord/send-message/) — Ping yourself in a Discord server
- [Telegram](/guides/telegram/) — Send a telegram message

Whether you use Resend, Loops, Twilio, or some other platform, as long as it has
an API you can use it in Val Town.

**Persistence:**

- [std/sqlite](/reference/std/sqlite/) — Store in Val Town's built-in SQLite
- [std/blob](/reference/std/blob) — Persist to Val Town blob storage
- [Google Sheets](/guides/google-sheets/) — Write to a spreadsheet
- [Airtable](/guides/airtable/) — Update your Airtable with new data
- [Neon](/guides/databases/neon-postgres/) — Write to your Neon Postgres
  database
- [PlanetScale](/guides/databases/planetscale/) — Write to your PlanetScale db
- [Supabase](/guides/databases/supabase/) — Write to your Supabase db
- [Upstash](/guides/databases/upstash/) — Write to your Upstash db
- [AWS S3](/guides/s3/) — Upload to an S3 bucket

You can of course store your data in Cloudflare R2, Notion, or any other
database or CRM. Let us know if you'd like help with your use case, and we'll
continue to add examples to this docs page.
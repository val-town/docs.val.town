---
title: "Vercel"
description: "Val Town migration guide: Vercel"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Pre-requisites for your human fingers

1. If you don’t already have one, make a [Vercel account](https://vercel.com/signup).
2. Install the [Vercel plugin/MCP](https://vercel.com/docs/agent-resources/vercel-mcp) and authenticate.

## Mapping Val Town to Vercel

<div class="table-scroll">

| [Val Town](https://docs.val.town/) | [Vercel](https://vercel.com/docs) | Guides |
| --- | --- | --- |
| [Source code](https://docs.val.town/) | [GitHub](https://github.com/) | [GitHub](/migration/github) |
| [Env vars](https://docs.val.town/reference/environment-variables) | [Environment variables](https://vercel.com/docs/environment-variables) | [Transfer env vars](/migration/vercel/transfer-env-vars) |
| [`https:` imports](https://docs.val.town/reference/import#http-imports) | [package.json](https://vercel.com/docs/functions/runtimes/node-js) | [Migrate code](/migration/vercel/migrate-code) |
| [`esm.town` imports](https://docs.val.town/reference/esm-town) | [Local imports](https://vercel.com/docs/functions/runtimes/node-js) | [Migrate code](/migration/vercel/migrate-code) |
| [`npm:` imports](https://docs.val.town/reference/import#npm) | [package.json](https://vercel.com/docs/functions/runtimes/node-js) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/blob`](https://docs.val.town/reference/std/blob) | [Vercel Blob](https://vercel.com/docs/vercel-blob) | [Migrate blobs](/migration/vercel/migrate-blobs) |
| [`std/sqlite`](https://docs.val.town/reference/std/sqlite) | [Turso](https://docs.turso.tech/) / [Postgres](https://vercel.com/docs/storage) | [Migrate SQLite](/migration/vercel/migrate-sqlite) |
| [`std/openai`](https://docs.val.town/reference/std/openai) | [AI Gateway](https://vercel.com/docs/ai-gateway) | [Migrate AI](/migration/vercel/migrate-ai) |
| [`std/email`](https://docs.val.town/reference/std/email) | [Email provider](https://resend.com/docs) | [Migrate email](/migration/vercel/migrate-email) |
| [`std/utils.readFile`](https://utilities.val.run/#readFile) | [node:fs.readFile](https://nodejs.org/api/fs.html) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.serveFile`](https://utilities.val.run/#serveFile) | [Static files](https://vercel.com/docs/deployments) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.listFiles`](https://utilities.val.run/#listFiles), [`std/utils.listFilesByPath`](https://utilities.val.run/#listFilesByPath) | [node:fs.readdir](https://nodejs.org/api/fs.html) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.readFileTranspiled`](https://www.val.town/x/std/utils/code/file.ts), [`std/utils.fetchTranspiledJavaScript`](https://utilities.val.run/#fetchTranspiledJavaScript) | [Vite build](https://vercel.com/docs/frameworks/frontend/vite) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.serveImmutableFile`](https://utilities.val.run/#serveImmutableFile), [`std/utils.immutableFileUrl`](https://utilities.val.run/#immutableFileUrl) | [Hashed assets](https://vite.dev/guide/assets) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.hotReload`](https://utilities.val.run/#hotReload) | [Vite dev](https://vite.dev/guide/) | [Migrate code](/migration/vercel/migrate-code) |
| [`std/utils.httpEndpoint`](https://utilities.val.run/#httpEndpoint), [`std/utils.emailAddress`](https://utilities.val.run/#emailAddress) | [Explicit configuration](https://vercel.com/docs/environment-variables) | [Migrate code](/migration/vercel/migrate-code) |
| [react-hono-starter](https://www.val.town/x/templates/react-hono-starter/code/) | [Vite](https://vercel.com/docs/frameworks/frontend/vite)  • [Hono](https://vercel.com/templates/backend/hono-on-vercel) | [Migrate code](/migration/vercel/migrate-code) |
| [basic-html-starter](https://www.val.town/x/templates/basic-html-starter/code/) | [Static deployment](https://vercel.com/docs/deployments) | [Migrate code](/migration/vercel/migrate-code) |
| [hono-jsx-starter](https://www.val.town/x/templates/hono-jsx-starter/code/) | [Hono starter](https://vercel.com/templates/backend/hono-on-vercel) | [Migrate code](/migration/vercel/migrate-code) |
| [better-auth-starter](https://www.val.town/x/templates/better-auth-starter/code/) | [Better Auth](https://www.better-auth.com/docs/integrations/hono) | [Migrate code](/migration/vercel/migrate-code)<br />[Migrate SQLite](/migration/vercel/migrate-sqlite) |
| [Static HTML, CSS, JS](https://docs.val.town/reference/file-io#statichttpserver) | [Static deployment](https://vercel.com/docs/deployments) | [Migrate code](/migration/vercel/migrate-code) |
| [HTTP vals](https://docs.val.town/vals/http/) | [Functions](https://vercel.com/docs/functions) | [Migrate code](/migration/vercel/migrate-code) |
| [Cron vals](https://docs.val.town/vals/cron/) | [Schedules (beta)](https://vercel.com/docs/schedules) | [Migrate crons](/migration/vercel/migrate-crons) |
| [Email vals](https://docs.val.town/vals/email/) | [Inbound email webhook](https://resend.com/docs/receive-email) | [Migrate email](/migration/vercel/migrate-email) |
| [Val Town Access](https://docs.val.town/reference/access), [OAuth](https://docs.val.town/guides/auth#sign-in-with-val-town) | [Deployment Protection](https://vercel.com/docs/deployment-protection) / app auth | [Migrate Access](/migration/vercel/migrate-access) |
| [Custom domains](https://docs.val.town/vals/http/custom-domains) | [Custom domains](https://vercel.com/docs/domains) | [Migrate domains](/migration/vercel/migrate-domains) |

</div>

## Vercel Migration guides

- [Migrate code](/migration/vercel/migrate-code)

- [Transfer env vars](/migration/vercel/transfer-env-vars)

- [Migrate SQLite](/migration/vercel/migrate-sqlite)

- [Migrate blobs](/migration/vercel/migrate-blobs)

- [Migrate AI](/migration/vercel/migrate-ai)

- [Migrate crons](/migration/vercel/migrate-crons)

- [Migrate email](/migration/vercel/migrate-email)

- [Migrate Access](/migration/vercel/migrate-access)

- [Migrate domains](/migration/vercel/migrate-domains)

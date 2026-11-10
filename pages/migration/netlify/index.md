---
title: "Netlify"
description: "Val Town migration guide: Netlify"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Pre-requisites for your human fingers

1. If you don’t already have one, make a [Netlify account](https://app.netlify.com/signup).
2. Install the [Netlify plugin/MCP](https://docs.netlify.com/build/build-with-ai/agent-setup-guides/agent-setup-overview/#mcp-server-support) and authenticate.

## Mapping Val Town to Netlify

<div class="table-scroll">

| [Val Town](https://docs.val.town/) | [Netlify](https://docs.netlify.com/) | Guides |
| --- | --- | --- |
| [Source code](https://docs.val.town/) | [GitHub](https://github.com/) | [GitHub](/migration/github) |
| [Env vars](https://docs.val.town/reference/environment-variables) | [Environment variables](https://docs.netlify.com/build/functions/environment-variables/) | [Transfer env vars](/migration/netlify/transfer-env-vars) |
| [`https:` imports](https://docs.val.town/reference/import#http-imports) | [package.json](https://docs.netlify.com/build/configure-builds/manage-dependencies/) | [Migrate code](/migration/netlify/migrate-code) |
| [`esm.town` imports](https://docs.val.town/reference/esm-town) | [Local files](https://docs.netlify.com/build/functions/overview/) | [Migrate code](/migration/netlify/migrate-code) |
| [`npm:` imports](https://docs.val.town/reference/import#npm) | [package.json](https://docs.netlify.com/build/configure-builds/manage-dependencies/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/blob`](https://docs.val.town/reference/std/blob) | [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) | [Migrate blobs](/migration/netlify/migrate-blobs) |
| [`std/sqlite`](https://docs.val.town/reference/std/sqlite) | [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/) / [Turso](https://docs.turso.tech/) | [Migrate SQLite](/migration/netlify/migrate-sqlite) |
| [`std/openai`](https://docs.val.town/reference/std/openai) | [AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/) | [Migrate AI](/migration/netlify/migrate-ai) |
| [`std/email`](https://docs.val.town/reference/std/email) | External email provider | [Migrate email](/migration/netlify/migrate-email) |
| [`std/utils.readFile`](https://utilities.val.run/#readFile) | [node:fs.readFile](https://docs.netlify.com/build/functions/optional-configuration/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.serveFile`](https://utilities.val.run/#serveFile) | [Static deployment](https://docs.netlify.com/deploy/create-deploys/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.listFiles`](https://utilities.val.run/#listFiles), [`std/utils.listFilesByPath`](https://utilities.val.run/#listFilesByPath) | [node:fs.readdir](https://docs.netlify.com/build/functions/optional-configuration/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.readFileTranspiled`](https://www.val.town/x/std/utils/code/file.ts), [`std/utils.fetchTranspiledJavaScript`](https://utilities.val.run/#fetchTranspiledJavaScript) | [Vite build](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.serveImmutableFile`](https://utilities.val.run/#serveImmutableFile), [`std/utils.immutableFileUrl`](https://utilities.val.run/#immutableFileUrl) | [Hashed assets](https://vite.dev/guide/assets) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.hotReload`](https://utilities.val.run/#hotReload) | [Vite dev](https://vite.dev/guide/) | [Migrate code](/migration/netlify/migrate-code) |
| [`std/utils.httpEndpoint`](https://utilities.val.run/#httpEndpoint), [`std/utils.emailAddress`](https://utilities.val.run/#emailAddress) | [Explicit configuration](https://docs.netlify.com/build/functions/environment-variables/) | [Migrate code](/migration/netlify/migrate-code) |
| [react-hono-starter](https://www.val.town/x/templates/react-hono-starter/code/) | [Vite + Functions](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) | [Migrate code](/migration/netlify/migrate-code) |
| [basic-html-starter](https://www.val.town/x/templates/basic-html-starter/code/) | [Static deployment](https://docs.netlify.com/deploy/create-deploys/) | [Migrate code](/migration/netlify/migrate-code) |
| [hono-jsx-starter](https://www.val.town/x/templates/hono-jsx-starter/code/) | [Hono Netlify adapter](https://hono.dev/docs/getting-started/netlify) | [Migrate code](/migration/netlify/migrate-code) |
| [better-auth-starter](https://www.val.town/x/templates/better-auth-starter/code/) | [Better Auth + database](https://www.better-auth.com/docs/integrations/hono) | [Migrate code](/migration/netlify/migrate-code)<br />[Migrate SQLite](/migration/netlify/migrate-sqlite) |
| [Static HTML, CSS, JS](https://docs.val.town/reference/file-io#statichttpserver) | [Static deployment](https://docs.netlify.com/deploy/create-deploys/) | [Migrate code](/migration/netlify/migrate-code) |
| [HTTP vals](https://docs.val.town/vals/http/) | [Functions](https://docs.netlify.com/build/functions/overview/) | [Migrate code](/migration/netlify/migrate-code) |
| [Cron vals](https://docs.val.town/vals/cron/) | [Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/) | [Migrate crons](/migration/netlify/migrate-crons) |
| [Email vals](https://docs.val.town/vals/email/) | External email provider | [Migrate email](/migration/netlify/migrate-email) |
| [Val Town Access](https://docs.val.town/reference/access), [OAuth](https://docs.val.town/guides/auth#sign-in-with-val-town) | [Site protection](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/) / app auth | [Migrate Access](/migration/netlify/migrate-access) |
| [Custom domains](https://docs.val.town/vals/http/custom-domains) | [Custom domains](https://docs.netlify.com/manage/domains/get-started-with-domains/) | [Migrate domains](/migration/netlify/migrate-domains) |

</div>

## Netlify Migration guides

- [Migrate code](/migration/netlify/migrate-code)

- [Transfer env vars](/migration/netlify/transfer-env-vars)

- [Migrate SQLite](/migration/netlify/migrate-sqlite)

- [Migrate blobs](/migration/netlify/migrate-blobs)

- [Migrate AI](/migration/netlify/migrate-ai)

- [Migrate crons](/migration/netlify/migrate-crons)

- [Migrate email](/migration/netlify/migrate-email)

- [Migrate Access](/migration/netlify/migrate-access)

- [Migrate domains](/migration/netlify/migrate-domains)

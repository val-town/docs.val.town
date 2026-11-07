---
title: "Cloudflare"
description: "Val Town migration guide: Cloudflare"
updated: 2026-11-07
---

## Pre-requisites for your human fingers

Before you let your agent loose to do the migration, your human fingers are needed to (1) set up the cloudflare account, (2) install & authenticate the MCP server, and (3) enable some Cloudflare services:

1. If you don’t already have a Cloudflare account, [create one free here](https://dash.cloudflare.com/sign-up).
2. [Install the Cloudflare MCP](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/) and authenticate
3. Enable the following Cloudflare services:
   1. [R2](https://dash.cloudflare.com/?to=/:account/r2/overview)
   2. [Zero Trust](https://one.dash.cloudflare.com/)
   3. [Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/)
   4. [Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/)
   5. [Workers AI](https://dash.cloudflare.com/?to=/:account/ai/workers-ai)

## Mapping Val Town to Cloudflare

<div class="table-scroll">

| [Val Town](https://docs.val.town/) | [Cloudflare](https://developers.cloudflare.com/workers/) | Guides |
| --- | --- | --- |
| [Source code](https://docs.val.town/) | [GitHub](https://github.com/) | [GitHub](/migration/github) |
| [Env vars](https://docs.val.town/reference/environment-variables) | [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/) | [Transfer secrets](/migration/cloudflare/transfer-secrets) |
| [`https:` imports](https://docs.val.town/reference/import#http-imports) | [package.json](https://developers.cloudflare.com/workers/wrangler/bundling/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`esm.town` imports](https://docs.val.town/reference/esm-town) | [Bundling](https://developers.cloudflare.com/workers/wrangler/bundling/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`npm:` imports](https://docs.val.town/reference/import#npm) | [package.json](https://developers.cloudflare.com/workers/wrangler/bundling/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/blob`](https://docs.val.town/reference/std/blob) | [R2](https://developers.cloudflare.com/r2/) | [Migrate blobs](/migration/cloudflare/migrate-blobs) |
| [`std/sqlite`](https://docs.val.town/reference/std/sqlite) | [D1](https://developers.cloudflare.com/d1/) | [Migrate SQLite](/migration/cloudflare/migrate-sqlite) |
| [`std/openai`](https://docs.val.town/reference/std/openai) | [AI Gateway](https://developers.cloudflare.com/ai-gateway/) | [Migrate AI](/migration/cloudflare/migrate-ai) |
| [`std/email`](https://docs.val.town/reference/std/email) | [Email Service](https://developers.cloudflare.com/email-service/) | [Migrate email](/migration/cloudflare/migrate-email) |
| [`std/utils.readFile`](https://utilities.val.run/#readFile) | [`node:fs/promises.readFile`](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.serveFile`](https://utilities.val.run/#serveFile) | [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.listFiles`](https://utilities.val.run/#listFiles), [`std/utils.listFilesByPath`](https://utilities.val.run/#listFilesByPath) | [`node:fs.readdir`](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.readFileTranspiled`](https://www.val.town/x/std/utils/code/file.ts), [`std/utils.fetchTranspiledJavaScript`](https://utilities.val.run/#fetchTranspiledJavaScript) | [Vite build](https://developers.cloudflare.com/workers/vite-plugin/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.serveImmutableFile`](https://utilities.val.run/#serveImmutableFile), [`std/utils.immutableFileUrl`](https://utilities.val.run/#immutableFileUrl) | [Hashed assets](https://vite.dev/guide/assets) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.hotReload`](https://utilities.val.run/#hotReload) | [Vite dev](https://developers.cloudflare.com/workers/vite-plugin/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [`std/utils.httpEndpoint`](https://utilities.val.run/#httpEndpoint), [`std/utils.emailAddress`](https://utilities.val.run/#emailAddress) | [Explicit configuration](https://developers.cloudflare.com/workers/configuration/environment-variables/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [react-hono-starter](https://www.val.town/x/templates/react-hono-starter/code/) | [vite-react-template](https://github.com/cloudflare/templates/tree/main/vite-react-template) | [Migrate code](/migration/cloudflare/migrate-code) |
| [basic-html-starter](https://www.val.town/x/templates/basic-html-starter/code/) | [Static-site starter](https://developers.cloudflare.com/workers/static-assets/get-started/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [hono-jsx-starter](https://www.val.town/x/templates/hono-jsx-starter/code/) | [Hono Vite starter](https://github.com/honojs/starter/tree/main/templates/cloudflare-workers%2Bvite) | [Migrate code](/migration/cloudflare/migrate-code) |
| [better-auth-starter](https://www.val.town/x/templates/better-auth-starter/code/) | [Better Auth generator](https://github.com/zpg6/better-auth-cloudflare/tree/main/cli) | [Migrate code](/migration/cloudflare/migrate-code)<br />[Migrate SQLite](/migration/cloudflare/migrate-sqlite) |
| [Static HTML, CSS, JS](https://docs.val.town/reference/file-io#statichttpserver) | [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [HTTP vals](https://docs.val.town/vals/http/) | [Worker `fetch()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/) | [Migrate code](/migration/cloudflare/migrate-code) |
| [Cron vals](https://docs.val.town/vals/cron/) | [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) | [Migrate crons](/migration/cloudflare/migrate-crons) |
| [Email vals](https://docs.val.town/vals/email/) | [Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/) | [Migrate email](/migration/cloudflare/migrate-email) |
| [Val Town Access](https://docs.val.town/reference/access), [OAuth](https://docs.val.town/guides/auth#sign-in-with-val-town) | [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) | [Migrate Access](/migration/cloudflare/migrate-access) |
| [Custom domains](https://docs.val.town/vals/http/custom-domains) | [Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) | [Migrate domains](/migration/cloudflare/migrate-domains) |

</div>

## Cloudflare Migration guides

- [Transfer secrets](/migration/cloudflare/transfer-secrets)

- [Migrate SQLite](/migration/cloudflare/migrate-sqlite)

- [Migrate blobs](/migration/cloudflare/migrate-blobs)

- [Migrate email](/migration/cloudflare/migrate-email)

- [Migrate Access](/migration/cloudflare/migrate-access)

- [Migrate domains](/migration/cloudflare/migrate-domains)

- [Migrate AI](/migration/cloudflare/migrate-ai)

- [Migrate code](/migration/cloudflare/migrate-code)

- [Migrate crons](/migration/cloudflare/migrate-crons)

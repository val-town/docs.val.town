---
title: "Render"
description: "Val Town migration guide: Render"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Pre-requisites for your human fingers

Create a [Render account](https://dashboard.render.com/register), select the workspace, and connect the repo. Choose the [service type](https://render.com/docs/service-types) the app actually needs. Check [pricing](https://render.com/pricing) and [free-service limits](https://render.com/docs/free), including idle spin-down and storage.

## Mapping Val Town to Render

<div class="table-scroll">

| [Val Town](https://docs.val.town/) | [Render](https://render.com/docs) | Guides |
| --- | --- | --- |
| [Source code](https://docs.val.town/) | [GitHub](https://github.com/) | [GitHub](/migration/github) |
| [Env vars](https://docs.val.town/reference/environment-variables) | [Environment variables](https://render.com/docs/configure-environment-variables) | [Transfer env vars](/migration/render/transfer-env-vars) |
| [`https:` imports](https://docs.val.town/reference/import#http-imports) | [Package dependencies](https://nodejs.org/api/packages.html) | [Migrate code](/migration/render/migrate-code) |
| [`esm.town` imports](https://docs.val.town/reference/esm-town) | [Package dependencies](https://nodejs.org/api/packages.html) | [Migrate code](/migration/render/migrate-code) |
| [`npm:` imports](https://docs.val.town/reference/import#npm) | [Package dependencies](https://nodejs.org/api/packages.html) | [Migrate code](/migration/render/migrate-code) |
| [`std/blob`](https://docs.val.town/reference/std/blob) | [Object storage](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) / [disk](https://render.com/docs/disks) | [Migrate blobs](/migration/render/migrate-blobs) |
| [`std/sqlite`](https://docs.val.town/reference/std/sqlite) | [SQLite on disk](https://render.com/docs/disks) / [Postgres](https://render.com/docs/postgresql) | [Migrate SQLite](/migration/render/migrate-sqlite) |
| [`std/openai`](https://docs.val.town/reference/std/openai) | [Provider SDK](https://render.com/docs/web-services) / external gateway | [Migrate AI](/migration/render/migrate-ai) |
| [`std/email`](https://docs.val.town/reference/std/email) | [External email provider](https://render.com/docs/free#outbound-port-blocking) | [Migrate email](/migration/render/migrate-email) |
| [`std/utils.readFile`](https://utilities.val.run/#readFile) | [node:fs.readFile](https://nodejs.org/api/fs.html#fspromisesreadfilepath-options) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.serveFile`](https://utilities.val.run/#serveFile) | [Static files](https://render.com/docs/static-sites) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.listFiles`](https://utilities.val.run/#listFiles), [`std/utils.listFilesByPath`](https://utilities.val.run/#listFilesByPath) | [node:fs.readdir](https://nodejs.org/api/fs.html#fspromisesreaddirpath-options) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.readFileTranspiled`](https://www.val.town/x/std/utils/code/file.ts), [`std/utils.fetchTranspiledJavaScript`](https://utilities.val.run/#fetchTranspiledJavaScript) | [Vite build](https://vite.dev/guide/) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.serveImmutableFile`](https://utilities.val.run/#serveImmutableFile), [`std/utils.immutableFileUrl`](https://utilities.val.run/#immutableFileUrl) | [Hashed assets](https://vite.dev/guide/assets) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.hotReload`](https://utilities.val.run/#hotReload) | [Vite dev](https://vite.dev/guide/) | [Migrate code](/migration/render/migrate-code) |
| [`std/utils.httpEndpoint`](https://utilities.val.run/#httpEndpoint), [`std/utils.emailAddress`](https://utilities.val.run/#emailAddress) | [Explicit configuration](https://render.com/docs/configure-environment-variables) | [Migrate code](/migration/render/migrate-code) |
| [react-hono-starter](https://www.val.town/x/templates/react-hono-starter/code/) | [React + Hono](https://hono.dev/docs/getting-started/nodejs) | [Migrate code](/migration/render/migrate-code) |
| [basic-html-starter](https://www.val.town/x/templates/basic-html-starter/code/) | [Static-site setup](https://render.com/docs/static-sites) | [Migrate code](/migration/render/migrate-code) |
| [hono-jsx-starter](https://www.val.town/x/templates/hono-jsx-starter/code/) | [Hono Node adapter](https://hono.dev/docs/getting-started/nodejs) | [Migrate code](/migration/render/migrate-code) |
| [better-auth-starter](https://www.val.town/x/templates/better-auth-starter/code/) | [Better Auth](https://www.better-auth.com/docs/integrations/hono) | [Migrate code](/migration/render/migrate-code) |
| [Static HTML, CSS, JS](https://docs.val.town/reference/file-io#statichttpserver) | [Static site](https://render.com/docs/static-sites) | [Migrate code](/migration/render/migrate-code) |
| [HTTP vals](https://docs.val.town/vals/http/) | [Web service](https://render.com/docs/web-services) | [Migrate code](/migration/render/migrate-code) |
| [Cron vals](https://docs.val.town/vals/cron/) | [Cron job](https://render.com/docs/cronjobs) | [Migrate jobs](/migration/render/migrate-jobs) |
| [Email vals](https://docs.val.town/vals/email/) | [External email provider](https://render.com/docs/free#outbound-port-blocking) | [Migrate email](/migration/render/migrate-email) |
| [Val Town Access](https://docs.val.town/reference/access), [OAuth](https://docs.val.town/guides/auth#sign-in-with-val-town) | [App auth](https://render.com/docs/web-services) / access gateway | [Migrate Access](/migration/render/migrate-access) |
| [Custom domains](https://docs.val.town/vals/http/custom-domains) | [Custom domains](https://render.com/docs/custom-domains) | [Migrate domains](/migration/render/migrate-domains) |
| Continuous jobs | [Background worker](https://render.com/docs/background-workers) | [Migrate jobs](/migration/render/migrate-jobs) |

</div>

## Render Migration guides

- [Migrate code](/migration/render/migrate-code)

- [Transfer env vars](/migration/render/transfer-env-vars)

- [Migrate SQLite](/migration/render/migrate-sqlite)

- [Migrate blobs](/migration/render/migrate-blobs)

- [Migrate AI](/migration/render/migrate-ai)

- [Migrate jobs](/migration/render/migrate-jobs)

- [Migrate email](/migration/render/migrate-email)

- [Migrate Access](/migration/render/migrate-access)

- [Migrate domains](/migration/render/migrate-domains)

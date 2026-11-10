---
title: "Migrate code"
description: "Val Town migration guide: Migrate code"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Start with the app

Read its entrypoints, imports, assets, and tests. Identify which code runs in the browser and which runs on the server. Preserve the app’s behavior and intended audience.

Use the closest template in the mapping table where it helps. Replace its demo with the app; preserve an existing good structure rather than forcing a rewrite.

Adapt the maintained source directly. Do not keep an old Val Town copy plus scripts that rewrite it into Cloudflare code. Preserve legitimate builds and generated assets. Keep files cohesive, folders understandable, and a concise README with the live URL and working run/test/deploy commands.

## Imports

- **`npm:` and package CDN URLs:** install the underlying package, record it in `package.json`, and use ordinary package imports. Preserve versions until the migration works.
- **`esm.town`:** copy the imported val files and their dependencies into the project, then use relative imports. Preserve licenses and attribution. Bundling a remote URL alone does not make the app independent of Val Town.
- **Other `https:` imports:** inspect what the URL serves. Use an npm package where available; otherwise vendor the required source with attribution or keep an intentional external dependency. Do not treat every URL as a package.
- **Deno APIs:** replace runtime-specific calls with supported Web or Node APIs. Check [Workers Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/); compatibility settings do not provide every Deno or Node feature.

## Files and browser builds

<div class="table-scroll">

| Val Town utility | Migration |
| --- | --- |
| `std/utils.readFile` | At build time, use Node file reads. At runtime, import text/JSON or read a file explicitly included in the Worker bundle using [Workers’ virtual filesystem](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/). |
| `std/utils.listFiles`, `listFilesByPath` | Use `node:fs.readdir` during the build, or list bundled files at runtime. Workers cannot browse the original repository or Val Town project. |
| `std/utils.serveFile` | Put public files in [Static Assets](https://developers.cloudflare.com/workers/static-assets/). Keep private files behind authentication; never expose them through an unprotected assets route. |
| `std/utils.readFileTranspiled`, `fetchTranspiledJavaScript` | Compile browser TypeScript/JSX with [Vite](https://developers.cloudflare.com/workers/vite-plugin/) or the existing build. Reference the resulting asset, not a Val Town transpilation endpoint. |
| `std/utils.serveImmutableFile`, `immutableFileUrl` | Use [build-generated asset hashes](https://vite.dev/guide/assets). Keep HTML references in sync; only mark URLs immutable when their content cannot change. |
| `std/utils.hotReload` | Use the development server’s hot reload. Remove Val Town’s reload script from production. |
| `std/utils.httpEndpoint`, `emailAddress` | Configure the new URL/address explicitly. Update callers, links, and callback registrations. |

</div>

Workers’ filesystem is not your local disk: `/bundle` contains deployed modules, and `/tmp` is temporary. Use D1 or R2 for persistent data.

## Templates and handlers

- **React + Hono:** use the [Vite React template](https://github.com/cloudflare/templates/tree/main/vite-react-template). Move browser components into its frontend and server routes into its Worker. Never bundle secrets or database access into browser code.
- **Basic HTML / static HTML, CSS, JS:** use the [static-site starter](https://developers.cloudflare.com/workers/static-assets/get-started/). Keep a Worker only where server behavior is needed.
- **Hono JSX:** use the [Hono Vite starter](https://github.com/honojs/starter/tree/main/templates/cloudflare-workers%2Bvite). Preserve server-rendered JSX; do not turn it into a React SPA just to fit a template. Retain Hono’s JSX compiler settings.
- **Better Auth:** the [community generator](https://github.com/zpg6/better-auth-cloudflare/tree/main/cli) is a starting point, not a replacement for existing users. Preserve the auth configuration, signing secret, and tables; adapt its database connection to D1. Follow [Migrate SQLite](/migration/cloudflare/migrate-sqlite) and [Transfer secrets](/migration/cloudflare/transfer-secrets). Check the new origin, cookies, trusted origins, and OAuth callback URLs.
- **MCP server:** follow the [Workers MCP guide](https://developers.cloudflare.com/agents/model-context-protocol/). Preserve tools, schemas, authentication, and the transport your clients use. Reconnect an actual client to verify it.
- **HTTP vals:** expose a [Worker `fetch(request, env, ctx)` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/). With Hono, export the app and access bindings through `c.env`. Preserve routes, methods, headers, status codes, and streaming.

If hosting below a path such as `/my-app/`, configure the frontend base path, assets, API calls, and callbacks together.

## Check the result

Run the build and existing tests, then test the deployed app. Check nested routes, asset loads, forms/API calls, and browser console errors. Search source and built output for leftover `esm.town`, `.val.run`, and Val Town service URLs; replace operational dependencies, while preserving intentional attribution links.

Remove template demos and obsolete edit/remix controls. Document bindings and secret names, never values. Before switching users, verify the deployed app, data, and access controls.

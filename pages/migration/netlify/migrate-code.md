---
title: "Migrate code"
description: "Val Town migration guide: Migrate code"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Start with the app

Read entrypoints, assets, imports, and tests. Keep the framework and adapt the maintained source directly; do not retain a Val Town copy plus scripts that rewrite it on deployment.

Use Node Functions when replacing Deno is the goal. [Hono’s Netlify starter](https://hono.dev/docs/getting-started/netlify) uses **Edge Functions and Deno**, a different runtime; choose it deliberately rather than treating it as a Node template.

## HTTP and Hono

A [Netlify Node Function](https://docs.netlify.com/build/functions/api/) accepts a Web Request and returns a Response. An existing Hono app can be called directly. Keep routes in `src/app.ts` and export the Hono instance; save this as `netlify/functions/api.ts`:

```ts
import app from "../../src/app";
import type { Config } from "@netlify/functions";

export default (request: Request) => app.fetch(request);
export const config: Config = {
  path: ["/api", "/api/*"], excludedPath: ["/api/auth/*"],
};
```

If the Val Town file currently exports `app.fetch`, change it to `export default app` for this wrapper. The `/api/auth/*` exclusion reserves that path for the separate auth Function in the Access guide. If Hono already handles auth itself, remove the exclusion and do not add a second auth Function. The Hono app should define its actual `/api/...` paths. Preserve methods, status codes, headers, streaming, and error behavior. Install `hono` and `@netlify/functions` with npm; preserve the original major version while migrating.

For plain HTTP vals, put the original request-handling body in that default function. For Hono JSX, keep server rendering and the `hono/jsx` compiler settings; do not convert it into a SPA just to deploy.

## React and static assets

Use the existing frontend or a [Vite React app](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/). Remove demo components and call server routes such as `fetch("/api/items")`.

Example `netlify.toml` for a Vite frontend plus Node Functions:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  included_files = ["content/templates/**"]

[[redirects]]
  from = "/app/*"
  to = "/index.html"
  status = 200
```

Only add that SPA fallback if the frontend uses client-side routes under `/app/`. It must not swallow API routes. For plain HTML/CSS/JS, publish the source asset directory instead; a build command is unnecessary unless files need compiling.

## Imports and file utilities

<div class="table-scroll">

| Val Town | Replacement |
| --- | --- |
| `npm:` / package CDN imports | Install the package; ordinary imports |
| `esm.town` imports | Copy imported files/dependencies locally, with attribution |
| `std/utils.readFile` | Build-time Node read or bundled runtime file |
| `std/utils.listFiles`, `listFilesByPath` | Build-time `readdir`; runtime only for included files |
| `std/utils.serveFile` | Published static files or an authenticated Function |
| `std/utils.readFileTranspiled`, `fetchTranspiledJavaScript` | Vite/browser build |
| `std/utils.serveImmutableFile`, `immutableFileUrl` | Build-generated hashed URLs |
| `std/utils.hotReload` | Vite dev / Netlify dev |
| `std/utils.httpEndpoint`, `emailAddress` | Explicit URL/address configuration |

</div>

For runtime reads, declare files using [`included_files`](https://docs.netlify.com/build/functions/optional-configuration/), then test the bundled path:

```ts
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
const template = await readFile(resolve("content/templates/mail.txt"), "utf8");
```

Use the included-files setting in the single `netlify.toml` above; do not add a second `[functions]` table. Resolve runtime paths from the project base directory and test the deployed bundle, not only `netlify dev`.

Use Node `process.env` for runtime env vars. Keep credentials, database clients, and private files out of the browser bundle. Function disk is not persistent application storage.

Keep Better Auth with a supported database adapter and preserve account mappings. Follow the database and Access guides for data and login changes. For MCP, preserve the client transport/tools and test a real reconnect; long-lived sessions may need a different host.

## Verify

Run `npm run build`, the existing tests, and `netlify dev`, then deploy a test instance. Check direct nested URLs, refreshes, file reads, SSR, forms, API methods, and browser errors on that deployment. Document the working commands and runtime choice.

---
title: "Migrate code"
description: "Val Town migration guide: Migrate code"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the service

Keep the original framework and browser/server split. Use a [static site](https://render.com/docs/static-sites) for built HTML/CSS/JS; use a [web service](https://render.com/docs/web-services) for APIs, Hono, and server rendering. A React app with an API needs the web service as well, not only static hosting.

Replace template demos with the app. Maintain one source tree; do not keep Val Town code plus scripts that rewrite it into different deployed code.

## Imports and files

<div class="table-scroll">

| Val Town | Render / Node |
| --- | --- |
| `npm:` or package CDN import | Install the package; use its package name |
| `esm.town` import | Copy the source and dependencies locally, preserving attribution |
| `Deno.env.get` | `process.env` |
| `std/utils.readFile`, `listFiles*` | `node:fs/promises` |
| `serveFile` | Static-site publish directory or server static middleware |
| Transpilation helpers / `hotReload` | Existing build or Vite |
| Immutable helpers | Build-generated hashed assets |
| `httpEndpoint`, `emailAddress` | Explicit URL/address configuration |

</div>

Adapt `jsr:` imports to an available npm package or vendored source. Inspect other HTTP imports: not every URL is an npm package. Include runtime-read files in the deployment. Newly written files are ephemeral unless stored on a persistent disk.

## Hono and React

Install `hono` and `@hono/node-server`. Pin a supported Node version in `package.json`. Compile TypeScript/JSX with the existing build or run it with `tsx`; plain Node type stripping does not compile JSX. For Hono JSX, keep `jsxImportSource: "hono/jsx"`. Val Town’s `export default app.fetch` becomes the Node `serve` call. A minimal `server.mjs`:

```javascript
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
app.get("/api/health", c => c.json({ ok: true }));
// Mount the app's API routes above this 404.
app.all("/api/*", c => c.notFound());
app.use("*", serveStatic({ root: "./dist/client" }));
app.get("*", serveStatic({ path: "./dist/client/index.html" }));
serve({ fetch: app.fetch, hostname: "0.0.0.0", port: Number(process.env.PORT || 3000) });
```

Point Vite's output to `dist/client` and use Render Build Command `npm ci && npm run build`, Start Command `node server.mjs`. The final fallback is for an SPA; omit it for a multipage site. For a standalone static SPA, publish `dist` and configure a `/*` → `/index.html` rewrite in Render.

For Hono JSX, keep server rendering and Hono's JSX compiler settings. Better Auth needs its chosen database adapter, stable signing secret, trusted origin, and callback URLs preserved. For MCP, expose the existing HTTP transport through the Node server and reconnect an actual client.

## Verify

Run the build and original tests. Check direct nested links, assets, API status codes, forms, streaming, and browser errors. Test after restart. Remove obsolete Val Town edit controls and operational `esm.town`/`.val.run` dependencies while retaining attribution. Document live URL, commands, storage paths, and env-var names.

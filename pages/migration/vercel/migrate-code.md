---
title: "Migrate code"
description: "Val Town migration guide: Migrate code"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Start with the app

Read entrypoints, imports, assets, and tests. Identify browser code versus server code. Use the closest [Vercel template](https://vercel.com/templates) where useful, but preserve a good existing structure. Replace the demo with the app rather than rewriting the app to fit the demo.

Make runtime changes in maintained source. Avoid a retained Val Town copy plus scripts that turn it into different deployed code. Keep files and folders understandable and document run/test/deploy commands.

## Imports and runtime

- Replace `npm:` and package-CDN imports with installed packages. Preserve working versions.
- Copy imported `esm.town` files and dependencies into the repo, using local imports and retaining attribution.
- Inspect other HTTPS imports individually; not every URL represents an npm package.
- Replace `Deno.env.get` with server-only `process.env`. Replace other Deno APIs with supported Node/Web APIs; do not add `Deno.serve` to a Vercel Function.

For a standalone Hono app, [Vercel detects](https://vercel.com/docs/frameworks/backend/hono) `src/index.ts`:

```ts
import { Hono } from "hono";
const app = new Hono();
app.get("/api/health", c => c.json({ ok: true }));
// Move the app's existing routes here.
export default app;
```

For a single HTTP val, a [Node Function](https://vercel.com/docs/functions/runtimes/node-js) at `api/hello.ts` can use:

```ts
export function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name") ?? "world";
  return new Response("Hello " + name);
}
```

## Files and builds

<div class="table-scroll">

| Val Town utility | Replacement |
| --- | --- |
| `std/utils.readFile` | Node reads of files included in the function bundle, or direct text/JSON imports. |
| `std/utils.listFiles`, `listFilesByPath` | Build-time directory scan; runtime sees only packaged files. |
| `std/utils.serveFile` | Public assets in the deployment; private files through authenticated server routes. |
| `std/utils.readFileTranspiled`, `fetchTranspiledJavaScript` | Vite or existing build output; update browser imports. |
| `std/utils.serveImmutableFile`, `immutableFileUrl` | Hashed build assets with matching HTML references. |
| `std/utils.hotReload` | The framework’s dev server. |
| `std/utils.httpEndpoint`, `emailAddress` | Explicit destination URL/address configuration. |

</div>

Configure [included files](https://vercel.com/docs/functions/runtimes/node-js#including-additional-files) when runtime code reads non-code assets. Hono’s `serveStatic` is ignored in Vercel’s native Hono integration; use its `public/` assets instead. A function’s temporary filesystem is not persistent storage.

## Frameworks

- **React + Hono:** preserve Vite browser components and Hono server routes. For separate frontend/backend services in one project, use [Vercel Services](https://vercel.com/docs/services) and route the backend under the app’s API prefix. Verify routing with the actual framework; a SPA catch-all must not capture APIs.
- **Basic HTML:** deploy the existing static directory; no server is needed unless the app has dynamic behavior.
- **Hono JSX:** retain server rendering and JSX compiler configuration. Do not substitute a React SPA.
- **Better Auth:** keep its routes, signing secret, provider configuration, and user records. Use the chosen database adapter; update trusted origins and callbacks without discarding existing identities.
- **MCP servers:** preserve transport, auth, schemas, and tool behavior. Check long-lived connection/state needs against function limits and reconnect a real client.

## Verify

Run the build and original tests, then check deployed routes, assets, forms, headers, API calls, streaming, and browser errors. Check root and nested URLs. Remove operational `esm.town`/Val Town URLs while preserving intentional source credits. Document env var names, never values, and confirm the repo matches deployed source.

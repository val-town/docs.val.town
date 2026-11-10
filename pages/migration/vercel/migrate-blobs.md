---
title: "Migrate blobs"
description: "Val Town migration guide: Migrate blobs"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the store

Use [Vercel Blob](https://vercel.com/docs/vercel-blob) for runtime uploads; keep public build assets in the static deployment. Create a private or public Blob store deliberately. Public blob URLs are readable by anyone who has them.

Identify Val Town’s scoped/global store and the app’s key prefixes. Use MCP `listblobs` with the correct store and pagination until all app keys are listed. Save the complete key list as `keys.json` outside Git; do not treat a truncated listing as complete.

## Stream bytes from Val Town

Create a temporary source HTTP file with a random `BLOB_EXPORT_TOKEN` env var. Match the import and prefix to the app. Use its actual endpoint from file metadata.

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";
// For account-global blobs, import from https://esm.town/v/std/blob instead.
const prefix = "uploads/"; // Restrict this to the app's keys.

export default async function (request: Request) {
  const token = Deno.env.get("BLOB_EXPORT_TOKEN");
  if (!token || request.headers.get("Authorization") !== "Bearer " + token) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const key = new URL(request.url).searchParams.get("key");
  if (!key || !key.startsWith(prefix)) return new Response("Not found", { status: 404 });
  const result = await blob.get(key);
  if (!result.ok) return new Response("Export failed", { status: 502 });
  return new Response(result.body, {
    headers: {
      "Content-Type": result.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
```

This transfers bytes, including serialized JSON. Retain other application metadata in a database keyed by blob pathname or a JSON sidecar and update the app to read it. Blob does not automatically import arbitrary Val Town metadata.

## Copy and verify

Install `@vercel/blob@2.8.2` locally (the SDK version used for this example). Provide `BLOB_READ_WRITE_TOKEN` for a new empty destination store, `BLOB_EXPORT_URL`, `BLOB_EXPORT_TOKEN`, and an explicit `BLOB_ACCESS` of `private` or `public` to the process without printing values. Save as `copy-blobs.mjs` and run it beside `keys.json`:

```javascript
import { readFileSync, appendFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { put, get } from "@vercel/blob";

const keys = JSON.parse(readFileSync("keys.json", "utf8"));
const endpoint = new URL(process.env.BLOB_EXPORT_URL);
const token = process.env.BLOB_EXPORT_TOKEN;
const access = process.env.BLOB_ACCESS;
if (endpoint.protocol !== "https:" || !token || !["private", "public"].includes(access)) {
  throw new Error("HTTPS endpoint, token, and explicit access mode required");
}
async function hash(stream) {
  const result = createHash("sha256");
  for await (const chunk of stream) result.update(chunk);
  return result.digest("hex");
}
for (const key of keys) {
  const url = new URL(endpoint);
  url.searchParams.set("key", key);
  const source = await fetch(url, {
    headers: { Authorization: "Bearer " + token }, redirect: "error",
  });
  if (!source.ok || !source.body) throw new Error("Source download failed");
  const existing = await get(key, { access });
  if (existing?.statusCode === 200 && existing.stream) {
    const expected = await hash(source.body);
    if (await hash(existing.stream) !== expected) {
      throw new Error("Existing destination differs; reconcile before overwriting");
    }
    appendFileSync("verified.jsonl",
      JSON.stringify({ key, url: existing.blob.url, sha256: expected }) + "\n", { mode: 0o600 });
    continue;
  }
  const digest = createHash("sha256");
  const measured = source.body.pipeThrough(new TransformStream({
    transform(chunk, controller) { digest.update(chunk); controller.enqueue(chunk); },
  }));
  const saved = await put(key, measured, {
    access, addRandomSuffix: false, allowOverwrite: false,
    contentType: source.headers.get("Content-Type") ?? "application/octet-stream",
  });
  const expected = digest.digest("hex");
  const restored = await get(saved.url, { access });
  if (!restored || restored.statusCode !== 200 || !restored.stream ||
      await hash(restored.stream) !== expected) throw new Error("Readback mismatch");
  appendFileSync("verified.jsonl",
    JSON.stringify({ key, url: saved.url, sha256: expected }) + "\n", { mode: 0o600 });
}
```

The script streams one object at a time and records success only after hashing a destination readback. On rerun it verifies and skips matching existing objects, including an upload interrupted before checkpointing. It stops if an existing object differs rather than overwriting it. `verified.jsonl` records verified key/URL/hash mappings; a rerun may append repeat records. Stop on rate limits, honor retry delays, and rerun to continue.

For large objects, use the SDK’s multipart option and current size limits. Do not buffer the whole export or compare ETags as if they were always content hashes.

Use [paginated destination listing](https://vercel.com/docs/vercel-blob/using-blob-sdk#list-blobs) to compare keys and sizes:

```javascript
import { list } from "@vercel/blob";
let cursor;
do {
  const page = await list({ prefix: "uploads/", limit: 100, cursor });
  // Compare these keys/sizes with the source manifest; don't print private data.
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);
```

## Adapt and cut over

Replace blob get/set/list/delete calls with SDK operations. Preserve key-to-URL mappings and JSON serialization. Private downloads go through authenticated server routes using `get()`; keep the read-write token out of browser code.

Test create/read/delete plus denied private access. Stop source writes, copy final changes and deletions, then switch callers. Keep the source backup; delete the temporary endpoint, token, and local private export files after verification.

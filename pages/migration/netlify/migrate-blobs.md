---
title: "Migrate blobs"
description: "Val Town migration guide: Migrate blobs"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the store

Identify the source blob store and key prefixes; do not copy unrelated apps from account-global storage. Use published static files for assets shipped with code and a **site-wide** [Netlify Blobs store](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) for uploads/data that should survive deploys.

Install the SDK:

```bash
npm install @netlify/blobs
```

## Copy actual bytes

Add this temporary HTTP file to the source val. Set a random `BLOB_EXPORT_TOKEN`, select the correct scoped/global import, and limit `prefix` to this app. Its bearer check protects both listing and downloads.

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";
// For legacy account-global storage, import std/blob/global.ts instead.
const prefix = "uploads/"; // Only this app's keys.
export default async function (request: Request) {
  const token = Deno.env.get("BLOB_EXPORT_TOKEN");
  const headers = { "Cache-Control": "no-store" };
  if (!token || request.headers.get("Authorization") !== "Bearer " + token) {
    return new Response("Unauthorized", { status: 401, headers });
  }
  if (request.method !== "GET") return new Response(null, { status: 405, headers });
  const key = new URL(request.url).searchParams.get("key");
  if (key === null) return Response.json(await blob.list(prefix), { headers });
  if (!key.startsWith(prefix)) return new Response(null, { status: 404, headers });
  try {
    const object = await blob.get(key);
    return new Response(object.body, { headers: {
      ...headers, "Content-Type": object.headers.get("Content-Type") ?? "application/octet-stream",
    } });
  } catch {
    return new Response("Read failed", { status: 502, headers });
  }
}
```

Save this local downloader as `download-blobs.mjs`, supply `BLOB_EXPORT_TOKEN` to its process, and run `node download-blobs.mjs https://ACTUAL-EXPORT-ENDPOINT blob-export`. It streams bytes into files named by hashes of keys, so a key such as `../photo.jpg` cannot escape the export directory. The source list and byte sizes are checked; a failure stops the export.

```javascript
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { createHash } from "node:crypto";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { resolve, join } from "node:path";

const endpoint = new URL(process.argv[2]);
const out = resolve(process.argv[3] ?? "blob-export");
const token = process.env.BLOB_EXPORT_TOKEN;
if (endpoint.protocol !== "https:" || !token) throw new Error("HTTPS and token required");
const headers = { Authorization: "Bearer " + token };
const list = await fetch(endpoint, { headers, redirect: "error" });
if (!list.ok) throw new Error("List failed");
const entries = await list.json();
await mkdir(out, { mode: 0o700 }); // New directory; refuses to overwrite an old export.
const manifest = [];
for (const entry of entries) {
  const url = new URL(endpoint);
  url.searchParams.set("key", entry.key);
  const response = await fetch(url, { headers, redirect: "error" });
  if (!response.ok || !response.body) throw new Error("Download failed");
  const file = createHash("sha256").update(entry.key).digest("hex") + ".bin";
  const digest = createHash("sha256");
  let size = 0;
  await pipeline(Readable.fromWeb(response.body), new Transform({
    transform(chunk, encoding, callback) {
      size += chunk.length; digest.update(chunk); callback(null, chunk);
    },
  }), createWriteStream(join(out, file), { flags: "wx", mode: 0o600 }));
  if (entry.size !== undefined && size !== entry.size) throw new Error("Size mismatch");
  manifest.push({ key: entry.key, file, sha256: digest.digest("hex"),
    metadata: { contentType: response.headers.get("Content-Type") ?? "application/octet-stream" } });
}
await writeFile(join(out, "manifest.json"), JSON.stringify(manifest), { mode: 0o600 });
console.log("Downloaded " + manifest.length + " objects.");
```

It writes `blob-export/manifest.json` with entries like:

```json
[
  {
    "key": "uploads/photo.jpg",
    "file": "HASH-OF-KEY.bin",
    "sha256": "SOURCE_BYTES_SHA256",
    "metadata": { "contentType": "image/jpeg" }
  }
]
```

Use original keys. If the source response has only a generic content type, record the type from the app’s file-handling logic in the manifest; do not invent metadata the store never had. A list of URLs alone is not a backup. For a large store, use paginated source listings and a saved checkpoint; never interpret throttling as an empty store.

Save this as `copy-blobs.mjs`. Set `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` in the local process, then run `node copy-blobs.mjs manifest.json`. The script uses local file paths, not arbitrary download URLs.

```javascript
import { getStore } from "@netlify/blobs";
import { dirname, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const store = getStore({
  name: "app-data",
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_AUTH_TOKEN,
  consistency: "strong",
});
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const manifest = resolve(process.argv[2]);
const entries = JSON.parse(await readFile(manifest, "utf8"));
for (const entry of entries) {
  const bytes = await readFile(resolve(dirname(manifest), entry.file));
  if (hash(bytes) !== entry.sha256) throw new Error("Source hash mismatch");
  await store.set(entry.key, bytes, { metadata: entry.metadata });
  const copy = await store.get(entry.key, { type: "arrayBuffer" });
  if (!copy || hash(Buffer.from(copy)) !== entry.sha256) {
    throw new Error("Destination hash mismatch");
  }
}
console.log("Copy verified.");
```

Re-running overwrites matching keys in the chosen store; use a new test store for rehearsal and do not point it at unrelated data.

## Adapt the app

Within a deployed Function, `getStore("app-data")` uses the site context automatically:

```ts
import { getStore } from "@netlify/blobs";
const store = getStore({ name: "app-data", consistency: "strong" });
await store.setJSON("settings", { theme: "dark" });
const settings = await store.get("settings", { type: "json" });
```

Choose strong consistency where the app must read its latest write. Preserve JSON encoding and missing-key behavior. Serve private objects through an authenticated Function; do not copy them into the static publish directory.

When serving bytes, read `getWithMetadata` and explicitly set `Content-Type` from the saved metadata; Blobs does not apply that header automatically.

## Cut over

Verify keys, byte hashes, metadata, and read/write/delete behavior. Stop source writes, copy final changes and deletions, then switch callers to the new store. List destination keys after the final copy and compare them to the source manifest. Delete obsolete keys only within this app’s store/prefix, after verifying the deletion list. Remove the source HTTP file and `BLOB_EXPORT_TOKEN`, test stores, and temporary files after verification; keep the authorized recovery backup.

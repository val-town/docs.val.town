---
title: "Migrate SQLite"
description: "Val Town migration guide: Migrate SQLite"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

Move the app’s [Val Town SQLite](https://docs.val.town/reference/std/sqlite) data into [Cloudflare D1](https://developers.cloudflare.com/d1/), preserving existing users and records.

## 1. Find the database

Read the app’s queries and imports. It may use its own database or the legacy account-global database. A shared database can contain unrelated apps: copy only the tables and dependent records this app needs.

Record the schema, indexes, triggers, row counts, and IDs. Include auth tables and sessions when preserving existing logins. Keep private exports outside Git and out of chat.

## 2. Export

Create a temporary HTTP file in the source val. Protect it with a random bearer token and download over HTTPS. The downloaded SQL contains plaintext data; keep it local and outside Git. Public-key encryption is optional if the export must pass through another service or chat.

### Prepare

- Set `SQLITE_EXPORT_TOKEN` to a randomly generated secret. Keep its value out of source code, URLs, and logs. Use the same bearer-token check for every export, whether the val is public or private.
- Set `tables` below to the app’s tables, with parent tables first. Choose the correct scoped/global import.
- Pause writes and jobs touching these tables while exporting. Streaming pages does not create a database snapshot.

### Temporary HTTP file

This exports ordinary tables, indexes, triggers, and autoincrement counters. Generated columns are recreated by their schema. Virtual tables such as FTS require a separate export/rebuild plan; this script refuses them.

```ts
import { sqlite } from "https://esm.town/v/std/sqlite/main.ts";
// For the legacy account-global database, use std/sqlite/global.ts instead.

const tables = ["users", "posts"]; // Only this app's tables, in dependency order.
const identifier = (s: string) => '"' + s.replaceAll('"', '""') + '"';
const literal = (s: string) => "'" + s.replaceAll("'", "''") + "'";

async function* dump(signal: AbortSignal) {
  yield "PRAGMA defer_foreign_keys=ON;\n";
  const later: string[] = [];
  for (const table of tables) {
    if (signal.aborted) throw new Error("Cancelled");
    const schema = await sqlite.execute({
      sql: "SELECT type, sql FROM sqlite_schema WHERE tbl_name=? AND sql IS NOT NULL",
      args: [table],
    });
    const create = schema.rows.find(r => r.type === "table")?.sql;
    if (typeof create !== "string" || /CREATE\s+VIRTUAL\s+TABLE/i.test(create)) {
      throw new Error("Missing or unsupported table");
    }
    yield create + ";\n";
    later.push(...schema.rows
      .filter(r => r.type === "index" || r.type === "trigger")
      .map(r => String(r.sql) + ";\n"));

    const info = await sqlite.execute("PRAGMA table_xinfo(" + identifier(table) + ")");
    const columns = info.rows.filter(r => Number(r.hidden) === 0);
    const names = columns.map(r => String(r.name));
    const quoted = names.map(identifier);
    const primary = columns.filter(r => Number(r.pk) > 0)
      .sort((a, b) => Number(a.pk) - Number(b.pk)).map(r => identifier(String(r.name)));
    const order = (primary.length ? primary : quoted).join(",");
    // SQLite formats values itself, preserving int64, blobs, and NUL characters.
    const values = quoted.map(c =>
      `CASE WHEN typeof(${c})='text' THEN 'CAST(X''' || hex(${c}) ||
       ''' AS TEXT)' ELSE quote(${c}) END`).join(",");
    let count = 0;
    for (;;) {
      if (signal.aborted) throw new Error("Cancelled");
      const page = await sqlite.execute({
        sql: `SELECT ${values} FROM ${identifier(table)} ORDER BY ${order} LIMIT 100 OFFSET ?`,
        args: [count],
      });
      if (!page.rows.length) break;
      for (const row of page.rows) {
        const cells = page.columns.map(name => String(row[name]));
        yield `INSERT INTO ${identifier(table)} (${quoted.join(",")}) VALUES (${cells.join(",")});\n`;
      }
      count += page.rows.length;
    }
    yield "-- Rows: " + JSON.stringify({ table, count }) + "\n";

    if (/\bAUTOINCREMENT\b/i.test(create)) {
      const sequence = await sqlite.execute({
        sql: "SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name=?",
        args: [table],
      });
      if (sequence.rows.length) {
        const seq = String(sequence.rows[0].seq);
        if (!/^\d+$/.test(seq)) throw new Error("Invalid sequence");
        yield `DELETE FROM sqlite_sequence WHERE name=${literal(table)};\n`;
        yield `INSERT INTO sqlite_sequence(name,seq) VALUES(${literal(table)},${seq});\n`;
      }
    }
  }
  for (const statement of later) yield statement;
  yield "-- Export complete\n";
}

export default async function (request: Request) {
  const token = Deno.env.get("SQLITE_EXPORT_TOKEN");
  const headers = { "Cache-Control": "no-store" };
  if (!token || request.headers.get("Authorization") !== "Bearer " + token) {
    return new Response("Unauthorized", { status: 401, headers });
  }
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers });
  const iterator = dump(request.signal);
  const encoder = new TextEncoder();
  return new Response(new ReadableStream({
    async pull(controller) {
      try {
        const item = await iterator.next();
        if (item.done) controller.close();
        else controller.enqueue(encoder.encode(item.value));
      } catch {
        controller.error(new Error("Export failed; discard partial download"));
      }
    },
    async cancel() { await iterator.return(); },
  }), { headers: {
    ...headers,
    "Content-Type": "application/sql; charset=utf-8",
    "Content-Disposition": 'attachment; filename="app.sql"',
  } });
}
```

### Download locally

Use the file’s actual endpoint from Val Town metadata. Make `SQLITE_EXPORT_TOKEN` available to the local download process without printing it or including its value in command arguments. Save this as `download.mjs` and run `node download.mjs https://YOUR-ENDPOINT`.

```javascript
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const url = new URL(process.argv[2]);
const token = process.env.SQLITE_EXPORT_TOKEN;
if (url.protocol !== "https:" || !token) throw new Error("HTTPS URL and token required");
const response = await fetch(url, {
  headers: { Authorization: "Bearer " + token },
  redirect: "error",
});
if (!response.ok || !response.body) throw new Error("Download failed");
await pipeline(
  Readable.fromWeb(response.body),
  createWriteStream("app.sql", { flags: "wx", mode: 0o600 }),
);
```

If downloading fails, discard the partial file. Check the file ends with `-- Export complete` and record the per-table row counts before importing. Never import a truncated response or an HTML login page.

The script pages reads to limit memory use, but very large rows or long exports can still hit platform limits. Reduce the page size or use resumable exports when needed. On failure, keep writes paused for a consistent retry or take a new export.

After verifying the D1 import, delete the temporary HTTP file, its `SQLITE_EXPORT_TOKEN` secret, and the local token copy. Retain the SQL backup securely only as long as needed.

## 3. Rehearse the import

Create a D1 database and bind it as `DB` in the Worker config. Follow [D1’s import instructions](https://developers.cloudflare.com/d1/best-practices/import-export-data/) to prepare a SQL dump; raw SQLite files cannot be imported directly. Remove dump-level `BEGIN TRANSACTION` and `COMMIT`, and import tables in foreign-key order.

Import into a disposable database first, then the chosen destination:

```bash
npx wrangler d1 execute DATABASE_NAME --remote --file=app.sql
```

Preserve schema, indexes, triggers, and autoincrement state. Rebuild derived search indexes where needed. Do not let app startup insert demo data into the restored database.

## 4. Adapt the queries

Use the app’s existing ORM with its D1 adapter, or [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/):

```ts
const { results } = await env.DB
  .prepare("SELECT * FROM users WHERE id = ?")
  .bind(id)
  .all();
```

D1 is not a drop-in replacement for `sqlite.execute()`. Check result shapes, transactions, and parameter types. Bind SQL NULL as `null`, not `undefined`.

## 5. Verify and switch

Compare source and destination row counts and deterministic hashes of rows ordered by primary key. Check foreign keys, existing logins, and representative records. Test a create/update/delete cycle using disposable records.

For final cutover: stop Val Town writes and schedules, copy the remaining changes—including deletions—and verify again before enabling Cloudflare writes. Only one database should accept writes.

Keep the source backup and rollback instructions. Once Cloudflare has new writes, switching back requires copying those changes back too.

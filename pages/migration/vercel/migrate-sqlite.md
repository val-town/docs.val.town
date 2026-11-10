---
title: "Migrate SQLite"
description: "Val Town migration guide: Migrate SQLite"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the database

Vercel Functions cannot keep a durable local SQLite database. Choose [Turso](https://docs.turso.tech/) to keep SQLite/libSQL, or a [Marketplace Postgres](https://vercel.com/docs/storage) provider if you want to change database engines. Do not convert to Postgres merely because the app is moving to Vercel.

Identify the val-scoped or account-global database and only the app’s tables. Include auth/session data and preserve IDs, indexes, relationships, timestamps, and binary values.

## Export from Val Town

Use **section 2, Export** in [Migrate SQLite](/migration/cloudflare/migrate-sqlite). Its temporary HTTP bearer-token script and local downloader are source-side code and work for Vercel too. Ignore that page’s D1 import steps.

Pause writes during the export. Save the SQL outside Git, check the final completion marker, and retain the per-table counts. The supplied exporter rejects virtual tables; plan a separate FTS rebuild if present.

Restore into a new local file to check the export:

```bash
sqlite3 -bail app.db < app.sql
sqlite3 app.db "PRAGMA integrity_check; PRAGMA foreign_key_check;"
```

Use a new filename for each attempt so a failed restore cannot contaminate the next test.

## Option A: keep SQLite with Turso

With [Turso CLI](https://docs.turso.tech/cli/db/create) authenticated, import into a new rehearsal database:

```bash
sqlite3 app.db "PRAGMA journal_mode=WAL; PRAGMA wal_checkpoint(TRUNCATE);"
turso db create app-rehearsal --from-file ./app.db
```

Use `turso db show app-rehearsal --url` for the URL and `turso db tokens create app-rehearsal` for a database token. Capture the token inside a local process and pipe it to Vercel CLI through stdin; do not print it in chat. Store them as `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the selected Vercel environment. Install `@libsql/client`, then use:

```ts
import { createClient } from "@libsql/client/web";
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  intMode: "string",
});
export function findUser(id: string) {
  return db.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
}
```

This retains the familiar `execute` result shape. Check compatibility with the app’s ORM and SQLite extensions. The snippet returns integers as strings so 64-bit IDs remain exact. Adapt consumers accordingly; do not convert large IDs to JavaScript numbers.

## Option B: move to Postgres

Provision an empty rehearsal database with the chosen provider. Do not send SQLite SQL directly to Postgres.

[pgloader](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html) can convert an ordinary SQLite database. Create a local, mode-600 `migration.load` file outside Git:

```txt
LOAD DATABASE
  FROM sqlite:///absolute/path/to/app.db
  INTO postgresql://USER:PASSWORD@HOST/DATABASE
  WITH include no drop, no truncate, create tables, create indexes, reset sequences;
```

Fill the connection string through a local secret-handling process, then run `pgloader migration.load`. It contains credentials: do not print, commit, or retain it. Use the provider’s supported TLS connection settings.

Review converted types and identifier casing. Rewrite SQLite-specific queries and triggers; test booleans, dates, blobs, JSON, and autoincrement behavior. Use a Postgres driver/ORM adapter and the provider’s serverless connection or pool. Scope production connection strings to Production; give previews a separate database or branch. Review scopes if the Marketplace integration adds credentials automatically.

## Verify and switch

Compare row counts and deterministic values/hashes, then test existing logins and disposable writes through the deployed app. Prevent preview deployments from writing production data.

For final cutover, stop old writes/jobs and take a fresh complete export. Repeat the verified import into a new production database and point production at it; do not reuse stale rehearsal data. This carries deletions as well as updates. Verify before enabling the destination. Preserve a backup and rollback steps; after new writes, rollback needs reconciliation. Remove export endpoints, tokens, and temporary credential files.

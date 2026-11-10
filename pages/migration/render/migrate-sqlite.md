---
title: "Migrate SQLite"
description: "Val Town migration guide: Migrate SQLite"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the destination

<div class="table-scroll">

| Destination | Use when |
| --- | --- |
| [SQLite on a Render disk](https://render.com/docs/disks) | One service instance owns the database |
| [Hosted SQLite, such as Turso](https://docs.turso.tech/) | Multiple services or jobs need the same SQLite data |
| [Render Postgres](https://render.com/docs/postgresql) | You deliberately want PostgreSQL and can adapt its schema and queries |

</div>

Do not automatically convert SQLite to Postgres. Ordinary Render files disappear on redeploy. Local SQLite needs a paid persistent disk, which cannot be shared with cron jobs/other instances and prevents horizontal scaling and zero-downtime deploys.

## Export from Val Town

Use **step 2, Export**, in [Migrate SQLite](/migration/cloudflare/migrate-sqlite): its bearer-protected HTTP script produces ordinary SQL without depending on D1.

Choose the correct scoped/global database and tables. Include users, auth tables, indexes, and dependent rows. Pause writes and jobs touching them: block mutations with a maintenance flag and stop scheduled/inbound writers. Download `app.sql` and check its completion marker. Keep it outside Git/chat. Virtual tables need a separate export/rebuild plan.

## Build and verify locally

For this guide's export, which has no outer transaction, create a new SQLite file:

```bash
sqlite3 app.db ".bail on" "BEGIN;" ".read app.sql" "COMMIT;"
sqlite3 app.db "PRAGMA wal_checkpoint(TRUNCATE); PRAGMA journal_mode=DELETE;"
sqlite3 app.db "PRAGMA integrity_check; PRAGMA foreign_key_check;"
```

Use an empty destination. If another exporter includes `BEGIN/COMMIT`, do not wrap it again. Any failed statement must abort the import; discard the incomplete test database. Compare table counts and values before uploading.

## Put SQLite on a Render disk

Attach a disk at `/var/data` and configure `SQLITE_PATH=/var/data/app.db`. Deploy in maintenance mode so the running process does not open the database; this keeps [SSH/SCP](https://render.com/docs/ssh) available. Do not rely on a SQLite CLI being installed in the service image.

Upload the verified file as `/var/data/app.db.new`, compare its SHA-256, flush the uploaded file to disk, then rename it to `app.db` on that same disk. Only do this with all database clients closed and no stale WAL files; never overwrite a live SQLite database. For an existing target, first checkpoint its WAL, close every database client, and keep a backup before removing obsolete `-wal`/`-shm` sidecars. Plan a maintenance window: disk-backed services do not have zero-downtime deploys.

Open that path from Node using the app's SQLite library. Restart with maintenance mode disabled and verify data persists.

## Or use hosted SQLite

For a new Turso database, [load the SQL dump](https://docs.turso.tech/cli/db/shell) into an empty target:

```bash
turso db shell DATABASE_NAME < app.sql
```

If any statement fails, discard/recreate the incomplete target; do not blindly rerun partial inserts. Set its URL/token in Render env vars and use `@libsql/client`. Check query result shapes and parameter handling against the app.

## Or convert to Postgres

Create the translated Postgres schema first. Check `typeof(column)` counts in SQLite for mixed values before choosing Postgres types. Adapt SQLite-specific types, queries, placeholders, and autoincrement. Do not pass the SQLite dump to `psql`.

For example, after mapping `users.avatar` to `bytea`, Python and [Psycopg COPY](https://www.psycopg.org/psycopg3/docs/basic/copy.html) preserve integers, NULLs, empty strings, and binary values without a lossy CSV step:

```py
import os, sqlite3, psycopg

source = sqlite3.connect("file:app.db?mode=ro", uri=True)
with psycopg.connect(os.environ["DATABASE_URL"]) as target:
    with target.cursor().copy("COPY users (id, name, avatar) FROM STDIN") as copy:
        for row in source.execute("SELECT id, name, avatar FROM users"):
            copy.write_row(row)
source.close()
```

Install `psycopg[binary]`; omit generated columns from COPY, convert 0/1 to booleans and text/epoch timestamps to the chosen date type. The connection context commits on success or rolls back on error. PostgreSQL text cannot contain NUL characters: choose an explicit conversion or binary column rather than silently stripping data. Load parent tables first, preserve IDs, and reset serial/identity sequences afterward with `setval(pg_get_serial_sequence('users', 'id'), max(id))` for each nonempty table. Keep credentials in the environment. Choose a database plan suitable for ongoing use.

## Verify and switch

Compare row counts and deterministic row hashes, including large IDs, binary fields, NULLs, and dates. Test existing accounts and disposable create/update/delete operations. If the hostname changes, existing browser cookies will not move; expect users to sign in again.

Stop old writes/jobs, apply final changes including deletions, verify, then enable Render writes. Delete the temporary exporter and token. Keep a secure backup and rollback plan.

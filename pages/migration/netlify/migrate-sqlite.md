---
title: "Migrate SQLite"
description: "Val Town migration guide: Migrate SQLite"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

Netlify Functions do not provide a persistent local SQLite file. Choose [Turso](https://docs.turso.tech/) to keep SQLite semantics, or [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/) to move to Postgres. The latter requires schema/query conversion.

## 1. Export from Val Town

Identify the app’s database and required tables, including auth/session data. Scoped and account-global databases differ; never export unrelated apps from a shared store.

Follow **section 2, Export** in [Migrate SQLite](/migration/cloudflare/migrate-sqlite). Its bearer-protected HTTP exporter and local downloader run on **Val Town**, not Cloudflare, and produce `app.sql` independent of the destination. Do not follow that page’s D1 import steps.

Pause source writes/jobs for a consistent final export. Verify the completion marker, per-table counts, and local file. Keep the plaintext backup outside Git. Virtual tables need a separate export/rebuild plan.

## 2. Import into Turso

Install and authenticate the [Turso CLI](https://docs.turso.tech/cli/introduction). Create a new disposable database for rehearsal:

```bash
turso db create migration-test
turso db shell migration-test < app.sql
turso db shell migration-test "PRAGMA foreign_key_check;"
turso db shell migration-test "SELECT count(*) FROM users;"
```

Change the database/table names to yours. The [shell accepts SQL on stdin](https://docs.turso.tech/cli/db/shell). Inspect errors; a partial import is not a successful migration. Recreate the disposable destination before retrying rather than appending duplicate rows.

Get the URL with `turso db show migration-test --url`. Create a database token with `turso db tokens create migration-test`, capturing stdout directly into the local transfer process rather than chat/logs. The token belongs to this database, not an entire group. Capture generated credentials inside the local upload process, not tool output:

```javascript
import { execFileSync } from "node:child_process";
const capture = args => execFileSync("turso", args, { encoding: "utf8" }).trim();
const values = {
  TURSO_DATABASE_URL: capture(["db", "show", "migration-test", "--url"]),
  TURSO_AUTH_TOKEN: capture(["db", "tokens", "create", "migration-test"]),
};
```

Use this `values` object in the Netlify env-var API upload step from [Transfer env vars](/migration/netlify/transfer-env-vars), replacing its decrypted source values. Do not print it. Local development should use this disposable database; production gets its own credentials. Install `@libsql/client`:

```ts
import { createClient } from "@libsql/client/web";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function findUser(userId: string) {
  return db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [userId] });
}
```

Replace `std/sqlite` imports with this shared client. Preserve transactions, NULL handling, binary values, and large integer IDs; the default integer mode matches ordinary JavaScript numbers. If the app stores int64 values beyond the safe range, choose `bigint` or `string` explicitly and update every use of those values, including comparisons and JSON serialization.

## Alternative: Netlify Postgres

Create the database under **Data & Storage → Database**. Follow [Switch to Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/switch-to-netlify-database/). Convert SQLite schema into reviewed Postgres migrations, then import converted data using a private production connection:

Set the standard `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and `PGSSLMODE` environment variables from the private connection details, then run:

```bash
psql -v ON_ERROR_STOP=1 --single-transaction -f schema.postgres.sql -f data.postgres.sql
```

These are **converted Postgres files**, not `app.sql`. There is no universal search-and-replace conversion: review autoincrement/sequence values, booleans, timestamps, blobs, SQLite functions, and every changed query. Read the connection details from the chosen production database’s dashboard and populate the local process environment without putting the password in shell history or command arguments. Reset sequences after preserving numeric IDs; for example, if `users.id` has a serial/identity sequence:

```sql
SELECT setval(
  pg_get_serial_sequence('users', 'id'),
  COALESCE(MAX(id), 1), COUNT(*) > 0
) FROM users;
```

Do this for each applicable table, not blindly for IDs without a sequence. Point local/preview testing at a separate disposable database.

## 3. Verify and switch

Compare counts and deterministic row hashes, check relationships, and test existing logins plus disposable writes. Rehearse against the chosen backend before importing production.

Stop old writes/jobs, sync final changes and deletions, verify again, then enable the Netlify app. Keep one writer, a protected backup, and rollback instructions. Delete the temporary source exporter/token and any test database when no longer needed.

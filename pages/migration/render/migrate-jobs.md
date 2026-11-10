---
title: "Migrate jobs"
description: "Val Town migration guide: Migrate jobs"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the process

Use a [cron job](https://render.com/docs/cronjobs) for a command that runs and exits, and a [background worker](https://render.com/docs/background-workers) for a queue consumer or continuous loop. Both use the repository and env vars you configure; neither needs a public HTTP port. Cron jobs are paid services.

Read the old schedule and last-success state. Like Val Town, Render cron uses UTC; distinguish fixed clock times from an elapsed interval.

## Configure it

A cron example in [`render.yaml`](https://render.com/docs/blueprint-spec):

```yaml
services:
  - type: cron
    name: hourly-import
    runtime: node
    schedule: "0 * * * *"
    buildCommand: npm ci
    startCommand: node jobs/import.mjs
    envVars:
      - key: DATABASE_URL
        sync: false
```

Supply the existing database URL through Render's Environment settings. Do not create a second empty database by accident. Add a build step if the job is TypeScript. `sync: false` prompts during initial Blueprint creation; set later changes through Environment settings.

In `jobs/import.mjs`, call the migrated work and let failures exit nonzero:

```javascript
import { runJob } from "./import-work.mjs";
await runJob({ databaseUrl: process.env.DATABASE_URL });
```

For a continuous consumer, use `type: worker` with its own start command and handle `SIGTERM` by finishing or returning in-flight jobs. Close database/client pools in `finally` so one-shot jobs exit. Preserve Val Town’s `lastRunAt` equivalent in shared storage; Render does not supply it. Render runs at most one instance of a given cron job at a time. Cron jobs cannot access a web service's disk.

## Verify and switch

Test once with disposable data, then use Render's **Trigger Run** and inspect both logs and the actual result. Make retries idempotent; avoid duplicate mail, rows, or charges. Check current duration limits and overlapping-run behavior.

Disable the old Val Town job before enabling the replacement. Verify an actual scheduled run or consumed message, not only deployment. Record the last successful run and failures.

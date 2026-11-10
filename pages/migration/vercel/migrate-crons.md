---
title: "Migrate crons"
description: "Val Town migration guide: Migrate crons"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Preserve the schedule

Read the original interval settings and job. Record cadence, UTC/local-time intent, last completed run, and effects such as mail or database changes. An elapsed interval is not always equivalent to a wall-clock schedule.

[Vercel Schedules](https://vercel.com/docs/schedules) is currently beta. Check [limits](https://vercel.com/docs/schedules/limits); Hobby has a 15-minute minimum interval and timing jitter. Legacy Cron Jobs have different limits.

## Configure a private scheduled function

Install `@vercel/schedules` and move the existing work into `lib/job.ts`. For a daily UTC schedule, merge into `vercel.json`:

```json
{
  "functions": {
    "api/cleanup.ts": {
      "experimentalTriggers": [{ "type": "schedule/v1beta" }]
    }
  },
  "schedules": {
    "cleanup": {
      "schedule": "0 2 * * *",
      "timezone": "UTC",
      "function": "api/cleanup"
    }
  }
}
```

Then create `api/cleanup.ts`:

```ts
import { handleSchedule } from "@vercel/schedules";
import { runJob } from "../lib/job";

export const POST = handleSchedule(async metadata => {
  await runJob(metadata.scheduledAt);
});
```

Implement `runJob` with the app’s original logic and migrated database/env vars. The trigger makes this function private; do not add a public rewrite to it.

The [function identifier](https://vercel.com/docs/schedules/configuration) comes from build output, not always the source path. Run `vercel build` and verify the target exists as `.vercel/output/functions/api/cleanup.func`. Adapt to the framework’s actual output.

## Repeats and failures

Keep any last-run timestamp in durable storage. Use unique work IDs or an outbox so retries do not duplicate mail or charges. If jobs overlap, coordinate them in the database. Check function duration limits; use a queue or workflow for work that needs durable retries.

## Test and enable

Use disposable records/controlled recipients, then run the schedule manually from the Vercel dashboard. A manual pass does not prove the cadence fires.

Disable the Val Town job before enabling production work on Vercel. Verify a real scheduled run and its effects. Schedules can also exist in previews: keep preview jobs disabled or isolated from production data.

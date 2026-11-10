---
title: "Migrate crons"
description: "Val Town migration guide: Migrate crons"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Preserve timing and effects

Record the source schedule, timezone, last successful run, and work performed. [Netlify Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/) use UTC. An interval is not necessarily the same as a clock-time cron.

## Add the scheduled handler

Install `@netlify/functions`, move the job into a reusable function, and save this as `netlify/functions/hourly.ts`:

```ts
import type { Config } from "@netlify/functions";
import { runJob } from "../../src/run-job";

export default async (request: Request) => {
  if (process.env.JOBS_ENABLED !== "true") return;
  const { next_run } = await request.json();
  await runJob({ nextRun: next_run });
};
export const config: Config = { schedule: "0 * * * *" };
```

This runs hourly, at minute zero, UTC. Use the actual schedule. `next_run` is the **next** scheduled timestamp, not the last successful run; store your own checkpoint in the database if the job depends on it.

Netlify schedules run automatically only on published deploys. The current scheduled execution limit is 30 seconds. Long tasks may need a [Background Function](https://docs.netlify.com/build/functions/background-functions/) or another job service.

A Background Function is not scheduled directly. If a scheduler dispatches one, protect its public URL with a checked server-side token or use another authenticated queue/job mechanism. Do not expose an unprotected paid-work trigger.

## Make repetition safe

Use a database uniqueness constraint or completed-work record so a repeated invocation cannot resend the same email or duplicate a charge. If runs can overlap, claim work transactionally. Advance the checkpoint only after recording what completed.

## Test and cut over

Run `netlify dev` and use the CLI’s [function invocation](https://cli.netlify.com/commands/functions/) or local Functions UI to trigger the handler with disposable data. Verify the resulting records or delivered test message.

Test locally or on a separate test project. In production, keep `config.schedule` set and leave `JOBS_ENABLED` unset until cutover. Disable the Val Town schedule, set `JOBS_ENABLED=true`, redeploy, and observe a real run. Never publish this handler without its schedule or an auth check; an ordinary Function URL would let anyone trigger the job. Observe an actual scheduled run in Netlify logs and verify its effect; manual execution does not prove scheduling. Keep failure logs free of credentials and private message content.

---
title: "Migrate crons"
description: "Val Town migration guide: Migrate crons"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Preserve the schedule

Read the original interval settings and handler. Record its timezone, frequency, last successful run, and effects: emails, API calls, or database writes.


Like Val Town, [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) use UTC. An elapsed interval is not necessarily equivalent to a wall-clock cron expression.


## Move the handler

Put the work in a function called by a Worker `scheduled()` handler. Configure its cron expression in Wrangler:

```json
{
  "triggers": { "crons": ["0 * * * *"] }
}
```

This example runs hourly, at minute zero, UTC. Use the app’s actual schedule.

```ts
export default {
  async scheduled(event, env, ctx) {
    await runJob(env, event.scheduledTime);
  },
};
```

Implement `runJob` with the migrated bindings and secrets. If the old job used its last-run timestamp, preserve that state in durable storage; it is not passed automatically by Cloudflare.

## Handle repeats and failures

Make retries safe: record processed IDs or completed work so a repeated run does not resend messages or duplicate charges. If runs may overlap, coordinate them with durable state.

Check current [execution limits](https://developers.cloudflare.com/workers/platform/limits/). Use [Queues](https://developers.cloudflare.com/queues/) or [Workflows](https://developers.cloudflare.com/workflows/) if the job needs managed retries or longer, multi-step execution.

## Test and enable

Test the handler locally with [scheduled-event testing](https://developers.cloudflare.com/workers/configuration/cron-triggers/#test-cron-triggers-locally), using disposable data or controlled recipients.

Disable the Val Town schedule before enabling Cloudflare’s. Schedule changes can take time to propagate; verify an actual scheduled run and its effects in production. Record the last successful run and report failures. A deployment alone does not prove the job ran.

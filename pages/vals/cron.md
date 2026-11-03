---
title: Cron
description: Schedules let code on Val Town run every day, every hour, or whenever you'd like
updated: 2026-09-03
---

A cron trigger lets you schedule code to run repeatedly on a schedule. For
example, you could set up a cron to:

- [Deliver a Hacker News daily digest](https://www.val.town/x/snptrs/hn-digest)
- [Get notified when folks update their social bio](https://www.val.town/x/tmcw/bluesky-thinkup-tribute)
- [Send a weekly reminder message](https://www.val.town/x/gladysatienza/weekly-session-reminder)
  or email

Crons can run up to once every 15 minutes on a Free account, or
[once a minute, with the Pro plan](https://www.val.town/pricing).

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/NeTanCOBniY?si=zRO2I4_rNojA2AnQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>

## Adding a cron trigger

To add a cron trigger, click the `+` button in the top right of your val editor
and select `CRON`. You can also use the triple dots menu next to the `Run`
button, or use our [MCP server](/guides/prompting/mcp).

<img
  alt="add a cron trigger"
  src="/images/vals-cron-e1fe2a1b.webp"
  style="border: 2px solid var(--beige)"
/>

Once you've added a cron trigger, you'll see it atop your file editor. You may
edit or pause the cron by selecting the setting icon, or remove it using the
triple dots menu in the top right.

<img
  alt="a cron trigger"
  src="/images/vals-cron-e51ad429.webp"
  style="border: 2px solid var(--beige)"
/>

## Cron schedule types

There are two kinds of cron schedules:

1. Simple intervals like "run every two hours"
2. [Cron syntax](https://en.wikipedia.org/wiki/Cron) like 8pm on Thursdays

You can consult [crongpt.com](https://crongpt.com) for help writing cron
expressions. For example the following cron runs every two hours, on the first
day of the month:

```
0 */2 1 * *
```

> **Crons run in UTC**
>
> Cron expressions are always evaluated in the
> [UTC timezone](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), so
> if you want to specify a certain hour in your local timezone, you may need to
> adjust the cron expression.

## Example

This example polls an RSS feed for new items since the last run. This val runs
every 1 hour.

<iframe src="https://www.val.town/embed/stevekrouse/rssNotifyExample" class="val-embed" loading="lazy"></iframe>

## Type signature

Crons take an `Interval` object as a parameter, and can return anything as a
result. The return value is ignored.

```tsx
export function cronValHandler(interval: Interval) {
  console.log("Cron val ran!");
}
```

The Interval type has the following shape:

```ts
interface Interval {
  lastRunAt: Date | undefined;
}
```
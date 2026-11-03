---
title: What’s a val?
description: Learn about the basics of Vals
updated: 2026-09-03
---

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/rj5mj_onbkk?si=D7sSbjp-Zq-vwGey" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A _val_ is a collaborative, versioned folder of deployed code—like a GitHub repo
that can run. They can be used to create websites, APIs, MCP servers, crons,
agents, slack bots, email handlers and more with JavaScript and SQLite. Vals
come with:

- [HTTP](/vals/http), [Cron](/vals/cron), and [Email](/vals/email) triggers
- [SQLite](/reference/std/sqlite) and [blob](/reference/std/blob) storage
- [Environment variables](/reference/environment-variables/)
- [Import](/reference/import/) from npm, http, node, and more
- [Access controls](/reference/access) for URLs
- [Permissions](/reference/permissions/) for source code (public, private,
  unlisted)
- Version control & collaboration: [branching](/vals/branches),
  [remixes](/vals/remixes), [pull requests](/vals/pull-requests)
- The Deno [runtime](/reference/runtime/)
- Logs & traces
- Analytics for HTTP triggers

## Triggers

A trigger is what causes some code to run (in a file in a val). There are **3
types of triggers** that JavaScript files within a val can have:

- [HTTP](/vals/http) — Triggered by HTTP requests (for APIs, websites, webhooks,
  etc.)
- [Cron](/vals/cron) — Triggered by a timer or cron expression
- [Email](/vals/email) — Triggered by an incoming email

## Versioning & collaboration

Every file change is automatically versioned. Rollbacks are instantaneous. You
can create branches and remixes for development and collaborating.

- [Branches](/vals/branches) — Create branches for feature development, testing,
  and sharing
- [Remixes](/vals/remixes) — Remix another user's val to make changes and send a
  pull request
- [Pull Requests](/vals/pull-requests) — Merge changes from a branch or remix
  back into the parent val
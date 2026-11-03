---
title: SQLite
description: Every Val comes with its own private SQLite database
updated: 2026-09-10
---

[SQLite](https://www.sqlite.org/) is a lightweight, standard database. Every
[val](/vals) comes with its own private SQLite database that is accessible from
any of your vals via [`std/sqlite`](https://www.val.town/v/std/sqlite).

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/tzjgTjHSJVA?si=BJWzNb6_DloNCmo4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

In addition to "scoped" SQLite databases per val, every organization and user
also has their own [global SQLite database](/reference/std/sqlite/global): this
is now a legacy system, but it will continue to work forever. Val-scoped SQLite
databases are the recommended way to interact with SQLite for new vals.

## Further reading

- [Usage](/reference/std/sqlite/usage) — How to use Val Town SQLite in your vals
- [Interface](/reference/std/sqlite/admin) — Admin panel for sqlite
- [Migrations](/reference/std/sqlite/migrations) — How to manage your database
  schema
- [ORMs](/reference/std/sqlite/orms) — How to use ORMs with Val Town SQLite
- [Global](/reference/std/sqlite/global) — Legacy account-scope SQLite database

_Val Town SQLite is powered by [Turso](https://turso.tech/)._

## Limits

You can store 10mb on the free plan and up to 1gb on the paid plan. Contact us
if you need more space.
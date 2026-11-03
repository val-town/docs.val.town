---
title: Migrations
description: How to manage database schema changes with migrations in Val Town SQLite
updated: 2026-09-10
---

Val Town uses standard SQLite (via [Turso](https://turso.tech/)), so you can use
standard SQLite commands to alter tables, add constraints, and write data.

## Single-file migration

One way to run migrations for SQLite in Val Town is to write a single val and
keep updating it with each migration. The version history of that val can act as
a log of schema changes.

Let's look at an example: In our first migration, we create a users table:

```ts
import { sqlite } from "https://esm.town/v/std/sqlite/main.ts";

await sqlite.execute(`
  create table users (
    id integer primary key autoincrement,
    email text not null unique
  )
`);
```

Later, we realize we also want to store names. We can update _the same val_ to
alter the table:

```ts
await sqlite.execute(`
  alter table users
  add column name text
`);
```

## Admin panel

You may also run one-off queries and directly manipulate data in a val's SQLite
[admin panel](/reference/std/sqlite/admin).
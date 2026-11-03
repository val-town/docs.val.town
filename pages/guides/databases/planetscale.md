---
title: PlanetScale
description: How to store data in PlanetScale, a hosted MySQL platform with the ability to scale beyond a single instance and evolve schemas.
updated: 2023-12-22
---

[PlanetScale](https://planetscale.com/) once provided a hosted MySQL database with 5GB
of storage included in the free tier. On April 8, 2024, the free plan was retired and the [cheapest plan](https://planetscale.com/pricing) starts at $39 with 10GB storage.

## 1. Sign up to PlanetScale

Go to
[https://auth.planetscale.com/sign-up](https://auth.planetscale.com/sign-up)

## 2. Create a new database

Select **New database** on the dashboard.

Create a database.

![screenshot_2023-06-25_at_214325.png](/images/guides-databases-planetscale-e1ec11a8.webp)

![screenshot_2023-06-25_at_211501.png](/images/guides-databases-planetscale-140da0ad.webp)

## 3. Create a password

Go to **Settings** → **Passwords** and click **New password**.

![screenshot_2023-06-25_at_211541.png](/images/guides-databases-planetscale-c40f1002.webp)

Save the `host`, `username`, and `password` values as
[Val Town environment variables](https://www.val.town/settings/environment-variables) - use
`planetScaleHost`, `planetScaleUsername`, and `planetScalePassword`
respectively.

![screenshot_2023-06-25_at_211618.png](/images/guides-databases-planetscale-6a6812c5.webp)

## 4. Create your first table

Copy and paste this val to create a table with the given schema.

```ts
import { queryPlanetScale } from "https://esm.town/v/vtdocs/queryPlanetScale";

await queryPlanetScale(
  {
    host: Deno.env.get("planetScaleHost"),
    username: Deno.env.get("planetScaleUsername"),
    password: Deno.env.get("planetScalePassword"),
  },
  `CREATE TABLE stock (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  price varchar(255) NOT NULL
);`
);
```

## 5. Insert an item

Insert one or more items.

```ts
import { queryPlanetScale } from "https://esm.town/v/vtdocs/queryPlanetScale";

await queryPlanetScale(
  {
    host: Deno.env.get("planetScaleHost"),
    username: Deno.env.get("planetScaleUsername"),
    password: Deno.env.get("planetScalePassword"),
  },
  `INSERT INTO stock (name, price) VALUES (?, ?);`,
  ["banana", 15]
);
```

## 6. Query an item

Use the `rows` property to get your query results - or log the entire
`results` object to see what other data is available.

```ts
import { queryPlanetScale } from "https://esm.town/v/vtdocs/queryPlanetScale";

const results = await queryPlanetScale(
  {
    host: Deno.env.get("planetScaleHost"),
    username: Deno.env.get("planetScaleUsername"),
    password: Deno.env.get("planetScalePassword"),
  },
  `SELECT id, name, price FROM stock WHERE name=?`,
  ["banana"]
);
console.log(results.rows[0]);
```

## 7. Do more than queries!

Read the source of the
[@vtdocs/queryPlanetScale](https://www.val.town/v/vtdocs/queryPlanetScale)
helper, see how it uses the `@planetscale/database` SDK, refer to the
[driver's documentation](https://github.com/planetscale/database-js), and extend
it!

<iframe src="https://www.val.town/embed/vtdocs/queryPlanetScale" class="val-embed" loading="lazy"></iframe>
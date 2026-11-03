---
title: Upstash
description: Using Upstash, a hosting provider that provides free 1MB Redis instances.
updated: 2023-12-22
---

Upstash provides a serverless Redis database, which can be used as a key-value
store of up to 1mb with a free account.

## Create an Upstash account

Go to [https://console.upstash.com/](https://console.upstash.com/)

## Create a database

1. Click **Create database**

![untitled.png](/images/guides-databases-upstash-661b40e0.webp)

1. **Name**: whatever you want.
2. **Type**: Regional
3. **Region**: Iowa (us-central1), because it's closest to Val Town's servers.
4. **Enable TLS** for security.

![screenshot_2023-06-08_at_1433262x.png](/images/guides-databases-upstash-580bfef5.webp)

## Add REST credentials to Val Town environment variables

1. Go to [val.town/settings/environment-variables](https://www.val.town/settings/environment-variables)
2. For `UPSTASH_REDIS_REST_URL` and the `UPSTASH_REDIS_REST_TOKEN` each:
   1. Click **New env variable**.
   2. Set the names to `upstashURL` and `upstashToken`, respectively
   3. Copy & paste in the value
   4. Click **Add**

Upstash:

![screenshot_2023-06-08_at_1438012x.png](/images/guides-databases-upstash-1db99765.webp)

Val Town:

![Screenshot of adding a new environment variable to Val Town](/images/guides-databases-upstash-6df4fbe8.webp)

## Set some data

If you set it up correctly, you should be able to _Run_ this Val and have
it return the same results from your own Upstash database

```ts
import { Redis } from "npm:@upstash/redis";

const redis = new Redis({
  url: Deno.env.get("upstashURL"),
  token: Deno.env.get("upstashToken"),
});
console.log(await redis.set("foo", "bar"));
console.log(await redis.get("foo"));
```

## Saving JSON

JSON is automatically stringified and parsed so you can set it and get it
directly. You can store a JSON object of up to 1mb this way with a free account.

```ts
import { Redis } from "npm:@upstash/redis";

const redis = new Redis({
  url: Deno.env.get("upstashURL"),
  token: Deno.env.get("upstashToken"),
});
await redis.set("json-ex-1", { a: { b: "nested json" } });
console.log(((await redis.get("json-ex-1")) as any).a.b);
```

## Further resources

1. [Upstash Redis SDK Docs](https://upstash.com/docs/redis/sdks/ts/overview)
2. [Redis tutorial](https://redis.io/docs/latest/develop/data-types/)

Thanks to [@mattx](https://www.val.town/u/mattx) for contributions to this
resource!
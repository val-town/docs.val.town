---
title: APIs & Routers
description: How to implement routing within HTTP triggers to handle different paths and methods
updated: 2026-09-08
---

Val Town is a great place to serve an API because you can instantly deploy an
API to a public URL and iterate very quickly.

One of the coolest things about using the web standard `Request`/`Response` API
in Val Town is that it works with modern web frameworks, so you can use routing
and their helper methods! When an HTTP file is deployed, it is available at a
subdomain like `example.val.run`, and requests to any subdirectory or path will
be routed to the file.

## Hono

We typically recommend [Hono](https://hono.dev/), a modern alternative to
[Express](https://expressjs.com/).

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Routing/honoExample" class="val-embed" loading="lazy" style="height:240px"></iframe>

## Peko

With [Peko](https://peko.deno.dev/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Routing/pekoExample" class="val-embed" loading="lazy" style="height:300px"></iframe>

## nhttp

With [nhttp](https://github.com/nhttp/nhttp):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Routing/nhttpExample" class="val-embed" loading="lazy" style="height:350px"></iframe>

## itty-router

With [itty-router](https://itty.dev/itty-router):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Routing/ittyExample" class="val-embed" loading="lazy" style="height:250px"></iframe>

## feTS

With [feTS server](https://the-guild.dev/openapi/fets/server/quick-start):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Routing/fetsExample" class="val-embed" loading="lazy"></iframe>

Notice, that it exports the `router`, which allows to use the
[feTS client](https://the-guild.dev/openapi/fets/client/quick-start) to make
routes type safe:

```tsx
import { type router } from "https://esm.town/v/user/fetsServer";
import { createClient } from "npm:fets";

const client = createClient<typeof router>({
  endpoint: "https://user-fetsServer.web.val.run",
});

// The `response` and `greetings` have proper types automatically inferred
const response = await client["/greetings"].get();
const greetings = await response.json();
console.log(greetings);
```

## Missing your favorite framework?

> Are we missing your routing framework of choice? Feel free to
> [ask us](mailto:hi@val.town), or open a branch to
> [update this docs page](/source).
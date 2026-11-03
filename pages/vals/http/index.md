---
title: HTTP
description: A kind of val that can serve a website or an API using web-standard Request & Response objects.
updated: 2026-09-03
---

HTTP triggers give your files a live URL, like
[solitaire-game.val.run](https://solitaire-game.val.run). So you can serve a
website, an API, an MCP server, handle a webhook, and more.

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/EJWBiZVIaik?si=Hw-PPdvcUKXkq7kh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>

## Add an HTTP trigger

To add an HTTP trigger, click the `+ Add trigger` button atop your editor and
select `HTTP`. You can also add/remove triggers from the triple dots menu in the
top right corner, or via our [MCP server](/guides/prompting/mcp).

<img
  alt="add an http trigger"
  src="/images/vals-http-70caafa6.webp"
  style="border: 2px solid var(--beige)"
/>

## Add a custom (sub)domain

Once you've added an HTTP trigger, you can copy its URL and open a preview. You
can also use a [custom domain](/vals/http/custom-domains) like `acme.app` or
[custom subdomain](/vals/http/custom-subdomains), like `jitterbug.val.run`.

<img
  alt="edit an http subdomain"
  src="/images/vals-http-669f78aa.webp"
  style="border: 2px solid var(--beige)"
/>

## Respond to HTTP requests

We use web standard
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects,
so you can use compatible web frameworks like [Hono](https://hono.dev/). The
triggered file's default export takes a `Request` object and returns a
`Response`:

```ts
export default async function (req: Request): Promise<Response> {
  return Response.json("hello, http!");
}
```

## Learn more

To learn more about what you can do with HTTP triggers, read:

- [Basic examples](/vals/http/basic-examples)
- [Routing](/vals/http/routing)
- [Rendering HTML & JSX](/vals/http/jsx)
- [Early-returning responses](/vals/http/early-return)
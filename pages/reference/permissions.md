---
title: Permissions
description: Vals can be private, unlisted, or public, and their endpoints can be restricted
updated: 2026-09-16
---

A val has two independent permission settings:

1. **Code access** controls whether other people can see and import your val's
   _source code_. That's the public / unlisted / private setting described
   below.
2. **[App access](/reference/access)** controls who can reach your val's _HTTP
   endpoints_, on both `val.run` URLs and custom domains.

Neither one implies the other. A val with private code still serves its
endpoints to anyone with the URL until you restrict app access, and a val whose
code is public can have tightly restricted endpoints.

## Code access

There are three privacy settings for a val:

### Public

- Discoverable and visible to everyone on the Val Town website
- Anyone can view the code and import it into their own vals
- HTTP endpoints are reachable by anyone with the URL, unless you restrict
  [app access](/reference/access)

### Unlisted

- Only visible to people who have the direct link
- Won't appear in search results or public listings
- Anyone with the link can view the code and import it
- HTTP endpoints are reachable by anyone with the URL, unless you restrict
  [app access](/reference/access)

### Private

- Only visible to you
- Only your vals can import the code
- HTTP endpoints are reachable by anyone with the URL, unless you restrict
  [app access](/reference/access)

## App access

App access is a setting rather than something you implement in code. You'll find
it under the **App access** header on the **Settings** page of any val owned by
an eligible organization. It has two states:

1. **Anyone with the URL**: Val Town doesn't restrict visitors at all. You can
   still implement your own access controls in your val's code, as described
   below.
2. **Restricted**: only the organizations, users, invited email addresses, and
   allowed email domains you list can reach the val. Visitors are sent to Val
   Town to sign in, and then back to your val.

> **Note:** Restricted access is available on vals owned by an organization on a
> [Business](https://val.town/pricing) account.

A few things that are easy to miss:

- **Programmatic callers need a bypass token.** Webhooks and API clients can't
  complete a sign-in flow, so create a bypass token for them and send it in the
  `X-Val-Town-Access` header.
- **You can read the visitor's identity.** Restricted vals receive a signed
  `x-val-town-user` header on each request, which you exchange with our API for
  the viewer's profile.
- **Custom domains are covered too**, not just `val.run` URLs.

See [Access](/reference/access) for the full details, including how to grant
access by email domain and how bypass tokens behave.

## Exposing your vals to the internet

When a val's app access is set to **Anyone with the URL**, its HTTP endpoints
are reachable by anyone who knows that URL, regardless of the val's code privacy
setting. If your endpoint handles sensitive data, either restrict
[app access](/reference/access) or add authentication in your code.

Since anyone can call your endpoints, if they interact with some data
that should only be changed by yourself, you will need to make sure that those
endpoints check for some kind of secret that only you know.

Here's an example of an HTTP endpoint within a val, using the concepts described in the [HTTP Triggers documentation](/vals/http), secured with an environment variable that only I know:

```ts
export const secretEndpoint = (req: Request) => {
  const secretHeader = req.headers.get("Authorization");

  if (secretHeader !== Deno.env.get("SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("My deepest darkest secret");
};
```

If I called it without supplying the environment variable, I'd be denied access:

```ts
const response = await fetch("https://user-secretEndpoint.web.val.run");
console.log(response);
```

```js
Response {
  body: ReadableStream { locked: false },
  bodyUsed: false,
  headers: Headers { /* omitted */ },
  ok: false,
  redirected: false,
  status: 401,
  statusText: "Unauthorized",
  url: "http://localhost:3001/v1/fetch?url=https%3A%2F%2Fuser-secretEndpoint.web.val.run"
}
```

By supplying the environment variable in a header, I'm allowed access:

```ts
const response = await fetch("https://user-secretEndpoint.web.val.run", {
  headers: { Authorization: "SECRET_123" },
});
console.log(response);
```

```js
Response {
  body: ReadableStream { locked: false },
  bodyUsed: false,
  headers: Headers { /* omitted */ },
  ok: true,
  redirected: false,
  status: 200,
  statusText: "OK",
  url: "http://localhost:3001/v1/fetch?url=https%3A%2F%2Fuser-secretEndpoint.web.val.run"
}
```

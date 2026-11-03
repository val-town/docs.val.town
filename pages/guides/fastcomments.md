---
title: Add comments with FastComments
description: Put a live comment thread under any page of a val, and log readers in with the Val Town account they already have
updated: 2026-09-18
---

[FastComments](https://fastcomments.com) is a hosted live commenting platform.

There are both threaded and streaming style chat widgets with moderation, spam
filtering, and notifications included. A val is a good home for it: anything
that needs a secret, like signing a reader in or verifying a webhook, runs
server-side in the same val as the page. Various examples can be found
[here](https://fastcomments.com/demo).

This guide gets a thread onto a page in a couple of minutes, then covers comment
counts, logging readers in with their Val Town account, and receiving webhooks.

## Quick setup

1. Remix
   [blog-with-comments](https://www.val.town/x/fastcomments/blog-with-comments).
   It is the Val Town blog template with a thread under every post and a comment
   count on the index.

2. Open your val's URL, click a post, and leave a comment. It works right away
   because the remix posts into FastComments' shared `demo` tenant.

3. [Sign up for FastComments](https://fastcomments.com/auth/tenant-signup) and
   copy the **Tenant ID** from the API credentials page. It is a public
   identifier and belongs in browser code. The secret key below it does not, and
   nothing in this section needs it.

4. Add it to your val as an
   [environment variable](/reference/environment-variables) named
   `FASTCOMMENTS_TENANT_ID`.

Reload a post and you have an empty thread of your own.

> **Note** The `demo` tenant is a public sandbox. Everyone trying FastComments
> writes into it and anyone can moderate it, so switch before publishing
> anything you care about. Remixing copies environment variable keys but not
> values, which is why the template reads the tenant from the environment
> instead of a file: your setting stays with your val.

## Customization

FastComments is heavily customizable.
[See here.](https://docs.fastcomments.com/guide-customizations-and-configuration.html)

## Add comments to an existing val

The widget is a script tag and a container element, so it drops into whatever
your val already renders. Here it is in a Hono JSX route, the shape the HTTP
templates use:

```tsx
/** @jsxImportSource npm:hono@4/jsx */
import { Hono } from "npm:hono@4";

const app = new Hono();
const TENANT_ID = Deno.env.get("FASTCOMMENTS_TENANT_ID") ?? "demo";

app.get("/:slug", (c) => {
  const slug = c.req.param("slug");
  const config = JSON.stringify({
    tenantId: TENANT_ID,
    urlId: slug,
    url: c.req.url,
  });

  return c.html(
    <html>
      <body>
        <h1>{slug}</h1>
        <div id="fastcomments-widget"></div>
        <script src="https://cdn.fastcomments.com/js/embed-v2.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html:
              `window.FastCommentsUI(document.getElementById("fastcomments-widget"), ${config});`,
          }}
        />
      </body>
    </html>,
  );
});

export default app.fetch;
```

> **Tip** `urlId` decides which thread a comment lands in. Left unset it
> defaults to the page URL, and on Val Town that changes more than you would
> expect: a val has a long `*.web.val.run` hostname until you claim a subdomain,
> branches get their own URLs, and renaming a page changes the path. Each
> variation silently starts a separate empty thread. Key it to something stable
> like the post slug, and pass `url` too so notification emails link back to the
> real page.

Accounts created on `eu.fastcomments.com` also add `region: "eu"` to the config
and load the scripts from `cdn-eu.fastcomments.com`.

## Comment counts on an index page

Show a count next to each post without one request per row: mark each row with
its thread's `urlId`, then load the bulk count script once for the page.

```tsx
<ul>
  {posts.map((post) => (
    <li>
      <a href={post.slug}>{post.title}</a>{" "}
      <span class="fast-comments-count" data-fast-comments-url-id={post.slug}></span>
    </li>
  ))}
</ul>

<script
  dangerouslySetInnerHTML={{
    __html: `window.FastCommentsBulkCountConfig = ${JSON.stringify({ tenantId: TENANT_ID })};`,
  }}
/>
<script src="https://cdn.fastcomments.com/js/embed-widget-comment-count-bulk.min.js"></script>
```

`data-fast-comments-url-id` has to match the `urlId` that post's widget uses, or
the row shows zero for a thread that has comments.

## Log in with Val Town

If your val already knows who the visitor is, FastComments Secure SSO hands that
identity to the widget so they never see a second login. There is no endpoint to
build and nothing to call at runtime: sign the user on the server and pass three
values in the widget config.

With [`std/oauth`](/guides/auth) the visitor signs in with their Val Town
account, so the whole handoff is a few lines. The SDK from npm runs on Deno
as-is:

```ts
// sso.ts, server-side only
import { SecureSSOPayloadBuilder } from "npm:fastcomments-sdk/server";

export function buildSSOPayload(user) {
  // Must stay stable per person, or they get a new comment identity per login.
  const id = `vt-${user.id}`;

  return new SecureSSOPayloadBuilder(Deno.env.get("FASTCOMMENTS_API_SECRET"), {
    id,
    // email is required and must be unique; Val Town does not always expose one.
    email: user.email ?? `${id}@users.noreply.val.town`,
    // username is required and cannot be an email.
    username: user.username ?? id,
    displayName: user.username ?? undefined,
    avatar: user.links.profileImageUrl ?? undefined,
  }).getPayload();
}
```

```ts
// in your HTTP val
import {
  getOAuthUserData,
  oauthMiddleware,
} from "https://esm.town/v/std/oauth/middleware.ts";
import { buildSSOPayload } from "./sso.ts";

app.get("/", async (c) => {
  const user = (await getOAuthUserData(c.req.raw))?.user;
  const config = {
    tenantId: TENANT_ID,
    urlId: "my-thread",
    sso: user
      ? { ...buildSSOPayload(user), logoutURL: "/logout" }
      : { loginURL: "/auth/login" },
  };
  // render the widget with this config, exactly as above
});

export default oauthMiddleware(app.fetch);
```

`getPayload()` returns `{ userDataJSONBase64, verificationHash, timestamp }`.
Those three values are all that reach the browser. The API secret signs them and
is then dropped, so nothing on the page lets a reader forge a different user.
Logged out, `sso` carries only a `loginURL` and the widget shows a login prompt
instead of an anonymous comment box.

[sso-demo](https://www.val.town/x/fastcomments/sso-demo) is this end to end,
live at [fastcomments-sso.val.run](https://fastcomments-sso.val.run).

> **Note** The API secret belongs in an environment variable, never in a file. A
> val's source is public, and the secret is what lets someone comment as anyone.
> Also leave `isAdmin` and `isModerator` unset here: signing in with a Val Town
> account says nothing about who should moderate your site.

## Receive webhooks

A val is a natural webhook receiver: a stable URL, and SQLite and blob storage
built in. FastComments signs `${timestamp}.${body}` with your API secret and
sends two headers with every delivery:

```
X-FastComments-Timestamp: 1789004710        unix seconds, not milliseconds
X-FastComments-Signature: sha256=<hex>
```

The method carries the event: **PUT** for a created or updated comment,
**DELETE** for a deleted one. Two things bite: verify the raw body bytes, since
parsing and re-serializing the JSON changes the hash, and compare signatures in
constant time. The
[webhook-receiver](https://www.val.town/x/fastcomments/webhook-receiver) val
does both and stores every delivery in SQLite:

<iframe src="https://www.val.town/embed/x/fastcomments/webhook-receiver/verify.ts" class="val-embed" loading="lazy"></iframe>

Remix it, press **Send test event**, and watch a signed delivery verify and land
before you point a real webhook at it.

Answer quickly and do the real work after responding. FastComments retries on a
non-2xx response and eventually disables an endpoint that keeps failing.

## Teach Townie about FastComments

[fastcomments/skills](https://www.val.town/x/fastcomments/skills) is a remixable
library of [agent skills](/guides/prompting/skills) covering the widget, SSO,
the REST API, moderation, and migrating off Disqus. Remix it into your account
and Townie and the Val Town MCP server pick the skills up from `skills/`
automatically, so your agent knows how to wire up comments without you pasting
docs into the chat.

## Learn more

- The
  [FastComments Val Town guide](https://docs.fastcomments.com/guide-installation-val-town.html)
  is the longer version of everything above, including a no-JavaScript fallback
  that renders the thread server-side.
- The [SSO guide](https://docs.fastcomments.com/guide-sso.html) covers badges,
  group-gated threads, and SAML.
- FastComments has a free 30 day trial, then
  [plans from $0.99/mo](https://fastcomments.com/traffic-pricing).

Questions? Ask in [Discord](https://discord.val.town) or
[email us](mailto:hi@val.town).

## Try it on this page

This is the widget from the quick setup. Leave a comment and it shows up for
everyone reading the guide. An email is required to comment, as setting up SSO
would expose our API key to anyone that could remix this doc.

<div id="fastcomments-widget"></div>
<script src="https://cdn.fastcomments.com/js/embed-v2.min.js"></script>
<script>
  (function mount() {
    // Client-side navigation re-inserts this script before the embed has loaded.
    if (!window.FastCommentsUI) return setTimeout(mount, 50);
    window.FastCommentsUI(document.getElementById("fastcomments-widget"), {
      tenantId: "L177BUDVvSe",
      urlId: "valtown-docs-fastcomments-guide",
      url: "https://docs.val.town/guides/fastcomments",
      pageTitle: "Add comments with FastComments",
    });
  })();
</script>
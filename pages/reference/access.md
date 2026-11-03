---
title: Access
description: Control who can use vals
updated: 2026-09-10
---

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/goubWpXZ1xA?si=MP8iZ7nKnzIUW_jz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can limit access to a val to only your organization or particular people.
This doesn’t require any code changes. It’s a setting, under the **App access**
header on the **Settings** page of any val owned by an eligible organization.

![Settings > Access](/images/reference-access-0f42c9ed.webp)

There are two independent settings for privacy in the list:

1. **Code access** controls whether your val’s _source code_ is visible.
2. **App access** controls who can reach the val’s _HTTP endpoints_, on both
   `val.run` URLs and custom domains.

App access has two states:

1. **Anyone with the URL**: Val Town doesn’t restrict visitors at all. You can
   still implement your own access controls in your val’s code.
2. **Restricted**: only the organizations, users, invited email addresses, and
   allowed email domains you list can reach the val.

> **Note:** Restricted access is available on vals owned by an organization on a
> [Business](https://val.town/pricing) account.

## Who you can grant access to

When a val is restricted, you can configure who is allowed to use it:

- **Val Town users and organizations**, added by handle.
- **Email invitations**, for people who may not have a Val Town account yet. The
  recipient gets a link, signs up or signs in, proves they own the invited
  address, and lands on the access list. Invitations expire after 7 days, and
  you can have up to 20 outstanding per val. Invited people get access to the
  val only; they don’t become members of your organization.
- **Email domains**, e.g. `acme.com`, so anyone with a verified email at that
  domain gets in. Existing Val Town users matching the domain are granted access
  immediately, and access is recomputed as people verify, change, or remove
  email addresses. Up to 10 domains per val.

Visitors to a restricted val are sent to Val Town to sign in and then back to
your val. Sessions last 30 days, after which they will re-authenticate, which is
usually transparent and instant.

If an organization is downgraded to free and loses this feature, restricted vals
will produce HTTP 402 errors until they are adjusted to be public or the
organization is upgraded.

## Getting a user’s identity from headers

If your val relies on user identities, say for people creating content or
commenting under their own names, you can read the viewer’s identity from the
request. We inject a signed `x-val-town-user` header into each request, which
you exchange with our API for a user ID and profile information.

Send the header value you received to the
[/v3/val/viewer](https://docs.val.town/openapi#tag/val/GET/v3/val/viewer)
endpoint, authenticated with the val’s own project-scoped API token. It returns
the viewer’s public profile: id, username, bio, profile image, and profile URL.
No email address or account tier is exposed.

```ts
export default async function (req: Request) {
  const identity = req.headers.get("x-val-town-user");
  if (!identity) return new Response("No viewer identity");

  const res = await fetch("https://api.val.town/v3/val/viewer", {
    headers: {
      "x-val-town-user": identity,
      Authorization: `Bearer ${Deno.env.get("valtown")}`,
    },
  });
  const viewer = await res.json();
  return Response.json(viewer);
}
```

Some details worth knowing:

- **Treat the header as optional.** Requests authenticated with a bypass token
  have no viewer, and so carry no identity header.
- **It’s short-lived.** The header is minted fresh for each request and expires
  about a minute later. Exchange it during the request; don’t store it and reuse
  it later.
- **It’s bound to your val.** The signature covers the val’s project ID, so one
  val can’t replay another val’s header. A header can only be resolved by a
  token scoped to the val it was minted for.

## Using bypass tokens

Access works seamlessly for people visiting your val in a browser, but many vals
need _programmatic_ access too:

- REST APIs you call from other software
- Webhooks from other services

Those callers can’t complete a sign-in flow. For them, create a **bypass token**
and include it with the request. Bypass tokens work and look much like API
tokens, and can be sent either in the `X-Val-Town-Access` header or as a
`?val_town_access=` query parameter.

Bypass tokens start with `vtba_`, so they’re easy to detect. Other things to
know:

- They’re shown once, at creation. You can have up to 10 per val.
- They don’t expire. Revoke a token to cut off access.
- They’re scoped to the one val you created them on, and they grant _anonymous_
  access: a request that uses one gets no identity header.
- Val Town strips the header and query parameter before your code runs, so a
  token never leaks into your val’s own logging.
- A request that presents a bypass token alongside another Val Town access
  credential is rejected rather than resolved by precedence.
- Prefer the header. Query parameters can end up in logs, browser history, and
  referrers.

You can create bypass tokens on the Settings page under **App access**, or via
the API and the MCP server’s `create_bypass_token` tool.

## MCP & API support

Controlling val access is fully supported by our
[MCP server](https://docs.val.town/guides/prompting/mcp) and plugin. Just ask
your agent, and it will know how to set a val’s access to restricted.
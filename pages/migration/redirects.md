---
title: Redirecting val.run URLs
description: "Val Town migration guide: Redirects"
updated: 2026-11-10
---

If you'd like your `val.run` URLs to continue working, you can add redirects to their new locations.
You can manually add redirects in your val settings, [account settings][], or [org settings][] pages, use the [plugin][] / [MCP server][], or ask [Townie][] to set it up.

Redirects default to keeping the path and query string, so `https://bloggy.val.run/hello-world?ref=home` goes to `https://example.com/hello-world?ref=home`. You can turn this off to send every request to the exact URL you set instead.

As soon as a redirect is set up, the val stops receiving requests. We recommend adding redirects after you have completely migrated the val off of Val Town.
If your val is a webhook, many webhooks will not follow redirects. Instead, we recommend updating the URLs with each webhook provider that you are using.

Note that this only covers URLs that end in `.val.run`.
If you're using a custom domain on Val Town, you'll need to update your DNS settings with your domain provider to point to the new location.

## Adding redirects with Townie

Open [Townie][] and start a new thread to ask Townie to add redirects for any `val.run` URLs you have on Val Town.
Townie can list out your existing HTTP endpoints and keep track of any redirects you have set up.
Once a redirect is set, you can see where it points to in your val settings page or in your [account settings][] or [org settings][] under _Custom Domains_.

## Adding redirects with the MCP server

You can also manage redirects from our [MCP server][] or with the Val Town [plugin][].
Once your MCP client is connected to the MCP server, ask your agent to add redirects for any `val.run` URLs you have on Val Town.
The MCP server provides tools to view and manage redirects across all your accounts.

## Adding redirects manually

Redirects can be managed in your val settings, [account settings][], or [org settings][].

### Val settings

Scroll to the _HTTP_ section of your val's settings to see a list of HTTP endpoints.
Click the arrow button next to an endpoint to add or edit its redirect location.

### Account and org settings

In your account or org settings, navigate to the _Custom Domains_ section.
Scroll to the section named _Val.run redirects_ to add or edit any HTTP endpoint's redirect location.

## Timeline

You can add and edit your redirects until January 9, 2027.
These redirects will be temporary redirects until then.
On January 10, 2027 any redirects that you have set will become permanent.

[account settings]: https://val.town/settings/domains
[org settings]: https://val.town/orgs/_/settings/domains
[townie]: /guides/prompting/townie
[plugin]: /guides/prompting/plugin
[mcp server]: /guides/prompting/mcp

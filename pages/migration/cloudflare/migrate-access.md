---
title: "Migrate Access"
description: "Val Town migration guide: Migrate Access"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Preserve who can enter

Distinguish a private repository, a restricted website, and accounts inside an app. They protect different things.

For an owner/team gate, use [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/). Preserve the allowed people or groups. Keep application login where it manages user accounts or per-user data; Access does not replace that.

## Protect the whole app

Configure Access before exposing private content. Cover pages, APIs, files, and alternate hostnames—including `workers.dev` and previews—or disable unused routes.

Use the platform’s verified Access identity context where supported. Otherwise [validate the Access JWT](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), including signature, issuer, audience, and expiry. An email header alone is not authentication.

Check how static assets are protected; a guard inside the Worker does not necessarily run before asset delivery. Keep private R2 objects behind authenticated routes.

If Access replaces an old shared password, remove the redundant password prompt only after the new gate works.

## Allow machines deliberately

Webhooks and other callbacks cannot complete an interactive login. Use a narrowly scoped [service-token policy](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) for clients that support it, or a dedicated endpoint with provider signature/token validation. Do not bypass authentication for the whole app.

## Verify

Test an allowed user, a signed-out visitor, and a disallowed user. Request private files and APIs directly. Test logout, expired sessions, and real callbacks without browser cookies.

For agent testing, use an authorized browser session or a dedicated service token. Machine access does not replace testing the human login flow. Never publish private content in test artifacts.

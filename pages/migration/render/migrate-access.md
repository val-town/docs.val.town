---
title: "Migrate Access"
description: "Val Town migration guide: Migrate Access"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Preserve access and identity

A private GitHub repo does not protect a Render website. Render [private services](https://render.com/docs/private-services) are internal network services, not browser login.

For a user-facing app, choose application authentication or an access gateway such as [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/). Preserve the allowed people/groups. If Val Town OAuth supplied user identity, replace that provider and map existing ownership IDs; an email gate alone does not migrate accounts.

## Protect the origin

Configure the new gate before serving private records. If a gateway protects a custom hostname, validate the gateway JWT in the application on every request. Disabling `onrender.com` alone is not origin protection: a client may reach the origin using the custom Host header. Do not put private content on a Render static site that cannot perform this check. JWT-based gateways require signature, issuer, audience, and expiry validation; never trust an arbitrary email header.

For Cloudflare Access, use its [JWT validation procedure](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/) and team public keys. Keep expected issuer/audience in server configuration. Protect data routes and private file downloads as well as pages.

For a Cloudflare Access gateway, a Node/Hono middleware can use [jose](https://github.com/panva/jose) to verify its JWT:

```javascript
import { createRemoteJWKSet, jwtVerify } from "jose";
const issuer = process.env.ACCESS_ISSUER;
const audience = process.env.ACCESS_AUDIENCE;
if (!issuer || !audience) throw new Error("Access configuration required");
const keys = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer));
app.use("*", async (c, next) => {
  try {
    const token = c.req.header("Cf-Access-Jwt-Assertion");
    if (!token) return c.text("Unauthorized", 401);
    await jwtVerify(token, keys, { issuer, audience, requiredClaims: ["exp"], algorithms: ["RS256"], clockTolerance: 5 });
  } catch {
    return c.text("Unauthorized", 401);
  }
  await next();
});
```

Install this before private routes and static middleware. `createRemoteJWKSet` caches keys and refreshes when a new key ID appears. The gateway's policies choose allowed users; use verified claims for any additional app authorization. Do not accept identity headers without the JWT check.

Application sessions should use secure, HTTP-only cookies and the correct trusted origin. Preserve per-user authorization after login. If the hostname changes, expect users to sign in again: old cookies are scoped to the old host. Preserve users/ownership even when sessions cannot carry over. Remove an old shared password only when the new gate provides the same required protection.

## Machines and verification

Give inbound callbacks a narrow path and verify provider signatures or dedicated service credentials; do not make the whole app public. Test with no browser cookies.

Verify an allowed user, a disallowed user, signed-out access, expired/logout sessions, direct APIs/files, the default hostname, and the custom hostname. Agent service-token tests do not replace a human login test. Keep private records out of screenshots and logs.

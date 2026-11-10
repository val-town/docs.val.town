---
title: "Migrate Access"
description: "Val Town migration guide: Migrate Access"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Decide what is being protected

Val Town Access is a gate around an app. Val Town OAuth also identifies individual users. A private GitHub repo replaces neither.

For a small private team site, check [Netlify project visibility](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/) or [Password Protection](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/). In the project’s access settings, choose production and non-production coverage, then select invited visitors, team login, or a shared password where the plan supports it. Do not silently replace individual access with a shared password.

If the app has accounts and user-owned data, retain application authentication. Choose a replacement identity provider and map existing users to it; matching display names is not sufficient. Preserve stable user IDs and authorization rules.

## Gate server routes

With an existing [Better Auth](https://www.better-auth.com/docs/integrations/hono) instance configured for the destination database and origin, a Netlify Function can check the session:

```ts
import { auth } from "../../src/auth";

export default async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });
  // Check session.user.id against this resource's owner/allowed users.
  return Response.json({ signedIn: true });
};
```

This assumes `src/auth` is the app’s configured auth instance, not a new permissive login stub. Keep its auth routes available and update trusted origins, OAuth callback URLs, and secure cookie settings. A session check alone does not authorize every user's records.

Serve private files through similarly authorized Functions. Do not place them in the static publish directory. Machine callbacks need their own signature/token checks rather than an interactive login.

Keep the auth endpoints available, for example in `netlify/functions/auth.ts`. The code guide excludes `/api/auth/*` from its general API Function so the two do not overlap. If Hono already owns these auth routes, keep that handler instead and omit this separate Function:

```ts
import { auth } from "../../src/auth";
import type { Config } from "@netlify/functions";
export default (request: Request) => auth.handler(request);
export const config: Config = { path: "/api/auth/*" };
```

Set Better Auth’s `baseURL` / `BETTER_AUTH_URL` to the actual production origin. Never trust a wildcard covering all `*.netlify.app` sites. Use exact approved origins and separate preview credentials/data. When changing identity providers, link accounts using verified identity evidence; unverified email/display-name matches are not enough.

## Verify the boundary

Test a permitted user, signed-out visitor, and different user. Request APIs and private files directly. Check logout, expired sessions, OAuth callback, and any webhook without browser cookies.

Repeat on the production hostname, `.netlify.app`, deploy permalinks, and previews. Do not rely on a hidden URL or UI-only guard. Keep the original protection until the new checks pass; remove a redundant password only after its replacement works.

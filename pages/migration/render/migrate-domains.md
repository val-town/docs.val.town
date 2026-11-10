---
title: "Migrate domains"
description: "Val Town migration guide: Migrate domains"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Separate the changes

<div class="table-scroll">

| Change | What changes |
| --- | --- |
| Render service/domain settings | Which app serves the hostname |
| DNS records | Where the hostname points |
| Registrar transfer | Registration, renewal, billing |
| Redirects | Where old URLs send visitors |

</div>

Moving to Render does not require moving the registrar or DNS provider. Record existing records and choose a canonical URL first.

## Connect the domain

Deploy and test the `onrender.com` URL. In the Render service's **Settings → Custom Domains**, add the domain, then follow its exact [DNS instructions](https://render.com/docs/custom-domains) and verify it. Render provisions TLS. If CAA records exist, allow Render’s documented certificate authorities. With a Cloudflare-proxied hostname, use Full (strict) TLS.

Configure both apex and `www` intentionally. For a subdomain, use the CNAME target Render displays; for an apex, follow its provider-specific instructions instead of guessing an IP. Preserve MX, TXT, verification, and unrelated subdomain records. Update OAuth callbacks and links to the canonical URL.

For a static site, add redirects in its Redirects/Rewrites settings. An SPA rewrite such as `/*` → `/index.html` is not a canonical-host redirect. For a web service, handle application redirects in the server while preserving paths and query strings.

## Verify and retire old routes

Test HTTPS, apex/`www`, nested paths, queries, redirects, and email delivery. If using an access gateway, verify the application rejects requests without the gateway’s valid JWT; disabling the default hostname alone is insufficient.

Stop old writes/jobs and sync final data before switching traffic.
To redirect custom subdomains on `val.run`, [add redirects](/migration/redirects) once the migrated app is verified.
Transfer registration only if requested and track it separately.

Keep prior DNS settings and backups. Rolling back after new data is written requires reconciliation.

---
title: "Migrate domains"
description: "Val Town migration guide: Migrate domains"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Separate the changes

<div class="table-scroll">

| Change | What it controls |
| --- | --- |
| Worker routing | Which app handles a URL |
| DNS hosting | Where DNS records are managed |
| Registrar transfer | Registration, renewal, and billing |
| Redirects | Where old links send visitors |

</div>

A working website does not mean its registrar has moved. Transfer registration only if requested; it is not required just to host on Workers.

## Prepare

Record the current registrar, DNS provider, destination account, DNS records, and working app URL. Include apex, `www`, and other aliases.

Decide the final URL before configuring assets and callbacks. Several Workers can use paths on one domain.

## Connect the Worker

Use a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) for a whole hostname, or a [Worker route](https://developers.cloudflare.com/workers/configuration/routing/routes/) for selected paths.

If moving DNS to Cloudflare, copy and verify records before changing nameservers. Preserve mail, verification, and other services. Follow [DNSSEC migration guidance](https://developers.cloudflare.com/dns/dnssec/) so stale signing records do not break resolution.

## Transfer registration, if requested

Follow [Cloudflare’s transfer procedure](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/): check eligibility, unlock the domain, obtain authorization, and complete checkout. Track completion separately from DNS activation. Check renewal settings and applicable contact privacy.

## Verify

Check HTTPS, apex/`www`, paths, queries, redirects, and mail delivery. Redirect aliases to the chosen canonical URL without losing path/query information.

To redirect custom subdomains on `val.run`, [add redirects](/migration/redirects) once the migrated app is verified.

Keep prior DNS records and rollback steps.

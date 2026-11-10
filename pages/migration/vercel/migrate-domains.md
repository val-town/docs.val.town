---
title: "Migrate domains"
description: "Val Town migration guide: Migrate domains"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Separate the changes

<div class="table-scroll">

| Change | Controls |
| --- | --- |
| Vercel project domain | Which deployment serves the hostname |
| DNS hosting | Who manages DNS records |
| Registrar transfer | Registration, renewal, billing |
| Redirects | Where old URLs send visitors |

</div>

A site can run on Vercel while its DNS and registrar remain elsewhere.

## Prepare and connect

Record the current registrar, DNS provider, records, and old app URL. Include apex, `www`, mail, and verification records. Agree the canonical hostname and path before changing callbacks or asset paths.

Run [Vercel CLI](https://vercel.com/docs/cli/domains) from the linked project, or use Project Settings → Domains:

```bash
vercel domains add example.com
vercel domains inspect example.com
```

Use the **actual DNS records Vercel reports**, not copied IP addresses from an old tutorial. Update them with the current DNS provider and complete ownership verification. You do not need to move nameservers or transfer registration simply to connect the site.

If DNS hosting is also moving, copy all existing records and handle DNSSEC correctly before changing nameservers. If registration is explicitly moving, track its separate approval, completion, renewal, and contact-privacy status.

## Redirects and old URLs

Set the preferred apex/`www` redirect in Vercel’s domain settings. For app route redirects, use the framework or [Vercel redirects](https://vercel.com/docs/redirects), preserving paths and query parameters. Do not use a broad redirect that captures APIs or login callbacks.

To redirect custom subdomains on `val.run`, [add redirects](/migration/redirects) once the migrated app is verified.

## Verify and recover

Inspect the domain again, then test HTTPS, both hostnames, deep links, queries, callbacks, and email delivery. Check private protection on custom and generated URLs.

Keep prior DNS/routing values and the working source version. If users have written new data on Vercel, reconcile it before rolling back. Remove temporary domains after verification.

---
title: "Migrate domains"
description: "Val Town migration guide: Migrate domains"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Keep the changes separate

Hosting, DNS, registration/renewal, and old-URL redirects are separate. A working Netlify site does not mean the domain’s registrar moved.

Record the current DNS records and registrar before changing anything. Include apex, `www`, mail records, verification records, and other subdomains. Choose the canonical hostname and destination Netlify project.

## Add the domain

In Netlify **Domain management → Production domains**, add the domain and choose the primary hostname. Follow [Netlify’s external-DNS instructions](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/) or use Netlify DNS.

For external DNS, a subdomain normally uses:

```txt
Type   Name   Target
CNAME  www    YOUR-SITE.netlify.app
```

For the apex, use the ALIAS/ANAME/flattened-CNAME target shown by Netlify or its documented A-record alternative. Do not copy another project’s target. Keep MX, SPF, DKIM, DMARC, and unrelated records. If CAA records restrict certificate issuers, ensure they permit Netlify’s documented issuer. Lower DNS TTLs ahead of the cutover when practical.

If changing nameservers, create and verify the complete replacement zone first. Handle DNSSEC at the registrar before delegating; stale DS records can break all resolution. Moving nameservers is not a registrar transfer.

## Verify TLS and redirects

Netlify attempts certificate issuance after DNS is correct. Check Domain management for its status, then verify the ordinary URL:

```bash
curl -sS -o /dev/null -D - https://example.com/
curl -sS -o /dev/null -D - 'https://www.example.com/existing/path?check=1'
```

Replace the domain/path with yours. Check the primary host, alias redirects, path/query preservation, certificate validity, and application behavior—not just an HTTP 200.

Update OAuth callbacks and external webhooks.
To redirect custom subdomains on `val.run`, [add redirects](/migration/redirects) once the migrated app is verified.

## Finish

Switch only after data/auth checks pass. Keep old DNS values and a rollback plan. Treat any requested registrar transfer as separate work with its own completion, renewal settings, and costs. Confirm mail still arrives after the DNS change.

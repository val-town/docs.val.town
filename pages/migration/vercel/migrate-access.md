---
title: "Migrate Access"
description: "Val Town migration guide: Migrate Access"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Decide what must stay private

A private repo, a restricted website, and user accounts are different controls.

- **Val Town Access:** replace the owner/team gate with Vercel Deployment Protection or equivalent app authentication.
- **Val Town OAuth:** preserve the application’s users, ownership IDs, and permissions. A Vercel team login does not recreate those accounts. Choose an app auth provider and map existing identities before moving private records.

## Configure the gate before publishing

In Project Settings → [Deployment Protection](https://vercel.com/docs/deployment-protection), choose **All Deployments** for a wholly private app. Standard Protection excludes production domains. Check generated URLs and old deployments as well as the custom domain.

Vercel Authentication with All Deployments is available on all plans; shared-password protection is separately priced. Confirm the allowed audience fits the user’s needs. Keep app-level auth where users own distinct records.

Authorize private API and file requests in their handlers. A page redirect does not protect the underlying data. Serve private Blob objects through an authenticated route; never expose the storage token to browsers.

## Allow callbacks and agents narrowly

Use [Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) for authorized machine clients that can set its header. For example, the request header is `x-vercel-protection-bypass`; keep the value in secret storage.

A third-party webhook may not be able to set that header. Use a supported narrowly scoped exception or a separately routed endpoint, then validate the provider signature there. Never remove the whole app’s gate to make one callback work.

## Verify

Test an allowed account, a signed-out visitor, and a disallowed account. Request private APIs and files directly. Check logout and expired sessions. Test genuine provider callbacks without browser cookies.

For agent testing, use an authorized browser session or automation bypass credential. Bypass access tests the app’s behavior, not the human login flow. Remove temporary bypass credentials afterward.

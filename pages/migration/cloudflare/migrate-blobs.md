---
title: "Migrate blobs"
description: "Val Town migration guide: Migrate blobs"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose what to move

Identify the app’s blob store and key prefixes. Val-scoped and account-global storage are different; a shared store may contain unrelated data.

Use [Static Assets](https://developers.cloudflare.com/workers/static-assets/) for public files shipped with the code. Use [R2](https://developers.cloudflare.com/r2/) for uploads and other stored data. Keep private objects private.

## Copy the data

Enable R2, create a bucket, and add an [R2 binding](https://developers.cloudflare.com/r2/get-started/workers-api/) to the Worker.

List source keys with pagination. Copy the actual bytes, not just metadata or download URLs. Preserve keys, content types, and any metadata the app uses. If the app stored JSON, keep its serialization consistent when replacing blob helpers.

Use bounded concurrency, retries, and a saved checkpoint. A failed or rate-limited listing does not mean the store is empty. Keep credentials and private content out of logs and public exports.

## Adapt the app

Replace blob reads, writes, deletes, and listings with the [R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/). R2 reads return objects or streams; adapt callers expecting parsed JSON or text.

Serve private objects through an authenticated route. For public objects, choose a public URL deliberately and update stored references or redirects. Configure CORS only for the browser access the app needs.

## Verify and cut over

Compare key counts, sizes, and hashes of downloaded source and destination bytes. R2 ETags are not always content hashes. Test uploads, reads, deletes, and denied private access.

Stop old writes, copy final changes and deletions, then switch the app. Keep the source backup until the new store is verified.

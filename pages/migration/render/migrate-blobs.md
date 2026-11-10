---
title: "Migrate blobs"
description: "Val Town migration guide: Migrate blobs"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose storage

Static assets that ship with the code can use the site's publish directory. For uploads, choose [S3-compatible object storage](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) or a [Render persistent disk](https://render.com/docs/disks). Object storage is easier to share across web services and jobs; a disk belongs to one instance.

List the Val Town store and prefixes the app actually uses. Account-global storage may include unrelated apps. Use `blob.list(prefix)` to list keys and `blob.get(key)` to read each object’s bytes in the source val. Use the scoped/global import the app uses. Copy keys and bytes; preserve content types/metadata where present or derive them from app records/file types. Do not copy only download URLs.

## Copy and use objects

Set the bucket and provider credentials as Render env vars. For a small file, `@aws-sdk/client-s3` can upload it:

```javascript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
await s3.send(new PutObjectCommand({
  Bucket: process.env.S3_BUCKET, Key: "uploads/example.png",
  Body: await readFile("example.png"), ContentType: "image/png",
}));
const object = await s3.send(new GetObjectCommand({
  Bucket: process.env.S3_BUCKET, Key: "uploads/example.png",
}));
const downloaded = await object.Body.transformToByteArray();
```

Set the actual region and endpoint for the provider (`auto` is an R2 value, not a generic default). Use path-style addressing if the provider requires it. For large files, stream or use multipart upload rather than reading everything into memory. Replace Val Town's JSON helpers with explicit serialization/parsing.

For disk storage, write beneath its mount path and serve through the application. Other services cannot access that disk.

## Verify

Keep private objects private; use authenticated routes or short-lived signed URLs. Update stored URLs and CORS where required. Copy in bounded batches with checkpoints and retries.

Compare counts, sizes, and content hashes from destination readback. Test read/write/delete and denied private access. Pause old writes, copy final changes and deletions, then cut over.

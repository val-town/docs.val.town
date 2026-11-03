---
title: Blob storage
description: Store and retrieve binary data with Val Town's blob storage system
updated: 2026-09-10
---

Val Town comes with blob storage built-in. It allows for storing any data, like
text, JSON, or images. You can access it via
[`std/blob`](https://www.val.town/v/std/blob).

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/i6mlnbaj2iw?si=RDDaLdk6kQD5qghS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Blob storage comes in two flavors: scoped & global.

## Scoped

Scoped blob storage should be your default for new vals: it's scoped to the val,
so more secure and flexible. Scoped storage is available behind the
`https://esm.town/v/std/blob/main.ts` export and is backed by Amazon S3.

## Global

Global blob storage was the norm before scoped blob storage was introduced: it's
available to any val in your account. It's available at
`https://esm.town/v/std/blob` and backed by Cloudflare R2.

## Usage

The API for scoped blob storage and global storage is the same: to use these
examples with global val storage, import from `https://esm.town/v/std/blob`
instead.

### Get JSON

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

let blobDemo = await blob.getJSON("myKey");
console.log(blobDemo); // returns `undefined` if not found
```

### Set JSON

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

await blob.setJSON("myKey", { hello: "world" });
```

### Set any content

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

await blob.set("myKey", "String, stream, etc");
```

### Get any content

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

// Exposes a Response object with the same methods as a response from
// fetch: .json(), .text(), etc.
const text = await blob.get("myKey").then((response) => response.text());
```

### List keys

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

let allKeys = await blob.list();
console.log(allKeys);

const appKeys = await blob.list("app_");
console.log(appKeys); // all keys that begin with `app_`
```

### Delete by key

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

await blob.delete("myKey");
```

### Copy & move

We also include `copy()` and `move()` couple utility functions to make working
with blobs easier.

```ts
import { blob } from "https://esm.town/v/std/blob/main.ts";

await blob.copy("myKey", "myKeyCopy");
await blob.move("myKey", "myKeyNew");
```

## Examples

- [Counter](https://www.val.town/v/std/docsBlobCounterDemo)
- [RSS Notifications](https://www.val.town/v/stevekrouse/rssNotifyExample)
  (saving the last run time)
- Picture: [Save](https://www.val.town/v/andreterron/blobSavePictureExample) &
  [Read](https://www.val.town/v/andreterron/blobReadPictureExample)

## Error Handling

- `blob.get` can throw
  [`ValTownBlobNotFoundError`](https://val.town/v/std/ValTownBlobNotFoundError)
- Any method can throw
  [`ValTownBlobError`](https://val.town/v/andreterron/ValTownBlobError) for
  unexpected errors.

## Admin panels

For scoped blob storage, there's a Blob Storage option in the sidebar of vals
you own, that allows you to list, create, delete, and download blobs.

For global blog storage, there is a
[blob storage settings](https://www.val.town/settings/blob) where you can list,
download, and delete blobs. You can also create your own blob storage interface
in userspace, like this
[blob admin](https://www.val.town/v/stevekrouse/blob_admin) val to search, view,
edit, and upload blobs.

## Lower-level API

We provide access to the lower-level getter and setters, which are useful if you
are storing non-JSON or binary data, need to stream in your response or request
data, or do anything else lower-level.

- `async get(key: string)`: Retrieves a blob for a given key.
- `async set(key: string, value: string | BodyInit)`: Sets the blob value for a
  given key. See [BodyInit](https://deno.land/api@v1.38.1?s=BodyInit).

## Limitations

- Blob-stored data counts towards your total Val Town storage – 10mb on the free
  plan and 1gb on pro. Check our [pricing page](https://val.town/pricing) to
  learn more.
- Keys for blobs can be up to 512 characters long.
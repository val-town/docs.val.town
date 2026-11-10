---
title: "Transfer env vars"
description: "Val Town migration guide: Transfer env vars"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Export only the required values

List the app's env vars, including attached groups. Do not export the whole runtime or Val Town-injected credentials.

Use steps **2–3** of [Transfer secrets](/migration/cloudflare/transfer-secrets) to generate a local key and encrypt selected values inside Val Town. Those export steps are provider-independent. Do not run its Cloudflare upload step.

Keep `private.pem` local and save the returned envelope as `secrets.encrypted.json`. This keeps plaintext out of the conversation, not out of the local process's memory.

## Upload to Render

Confirm the workspace and service ID. Create a [Render API key](https://render.com/docs/api). Use scoped access if available; scoped keys are currently early access. Otherwise the key may reach other workspaces/services, so treat it accordingly and revoke a temporary key after use. Make it available locally as `RENDER_API_KEY`, and set `RENDER_SERVICE_ID`. Never paste either into code, chat, or command arguments.

Save this as `install-render-env.mjs` and run `node install-render-env.mjs /path/to/transfer-directory`:

```javascript
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { privateDecrypt, createDecipheriv, constants } from "node:crypto";

const dir = process.argv[2];
const service = process.env.RENDER_SERVICE_ID;
const apiKey = process.env.RENDER_API_KEY;
if (!dir || !/^(srv|crn)-[a-z0-9]+$/.test(service ?? "") || !apiKey) {
  throw new Error("Transfer directory, Render service ID, and API key required");
}
let key, plaintext;
try {
  const envelope = JSON.parse(readFileSync(join(dir, "secrets.encrypted.json")));
  key = privateDecrypt({
    key: readFileSync(join(dir, "private.pem")),
    padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",
  }, Buffer.from(envelope.wrapped, "base64"));
  const bytes = Buffer.from(envelope.encrypted, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(bytes.subarray(-16));
  plaintext = Buffer.concat([decipher.update(bytes.subarray(0, -16)), decipher.final()]);
  const values = JSON.parse(plaintext.toString("utf8"));
  for (const [name, value] of Object.entries(values)) {
    if (typeof value !== "string") throw new Error("Expected string value");
    const response = await fetch(
      `https://api.render.com/v1/services/${service}/env-vars/${encodeURIComponent(name)}`,
      {
        method: "PUT", redirect: "error", signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      },
    );
    if (!response.ok) throw new Error(`Upload failed: HTTP ${response.status}`);
    // The response can echo the secret. Never log it.
    await response.body?.cancel();
    console.log("Updated " + name);
  }
} finally {
  key?.fill(0);
  plaintext?.fill(0);
}
```

This uses Render's [per-key update API](https://api-docs.render.com/reference/update-env-var); it preserves unrelated env vars. It writes service-level values, which override same-named values from groups. Choose an environment group instead when sharing values is intended. If interrupted, some keys may already be updated; inspect names and finish the remaining updates without exposing values.

## Activate and verify

[Deploy the service](https://render.com/docs/deploys) after updating env vars; saving values alone does not prove the running process uses them. Rebuild if the values are needed at build time. Cron jobs use updated values on their next run. Keep credentials out of public frontend build variables.

Test the actual login or provider call. Remove the temporary Val Town script, local keys, envelope, and temporary API key when verified. Retain original provider credentials until cutover works.

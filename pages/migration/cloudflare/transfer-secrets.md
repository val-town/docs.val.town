---
title: "Transfer secrets"
description: "Val Town migration guide: Transfer secrets"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

Move selected Val Town secrets into [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/) without putting their values in chat, logs, Git, or plaintext files.

Val Town’s MCP lists secret names, not values. Its `run_file` tool can execute code that reads them. Encrypt the values inside Val Town, then decrypt locally and send them to Wrangler through stdin. This keeps the secrets out of the agent converstaion.

## 1. Choose the secrets

Inspect the app’s imports and environment-variable names, including attached environment groups. Transfer only what it needs. Do not export the entire environment or copy Val Town’s injected `valtown` platform credentials.

Confirm the destination account, Worker, and environment. The upload below updates secrets on the deployed Worker; use a test Worker for a rehearsal.

## 2. Generate a key locally

Save as `make-transfer-key.mjs` and run `node make-transfer-key.mjs`. It prints a temporary directory path. Keep that directory local and outside Git.

```javascript
import { generateKeyPairSync } from "node:crypto";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "val-secrets-"));
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 3072,
});
writeFileSync(join(dir, "private.pem"), privateKey.export({
  type: "pkcs8", format: "pem",
}), { mode: 0o600 });
writeFileSync(join(dir, "public.json"),
  JSON.stringify(publicKey.export({ format: "jwk" })));
console.log(dir);
```

## 3. Encrypt inside Val Town

Create a temporary **script file in the source val**. Paste the contents of `public.json` into `PASTE_PUBLIC_JSON`, change `names`, then run it with MCP `run_file`. Never send `private.pem` to Val Town.

```ts
const publicKeyJwk = JSON.parse('PASTE_PUBLIC_JSON');
const names = ["OPENAI_API_KEY", "BETTER_AUTH_SECRET"];
const secrets = Object.fromEntries(names.map(name => {
  const value = Deno.env.get(name);
  if (value === undefined) throw new Error(`Missing secret: ${name}`);
  return [name, value];
}));
const rsa = await crypto.subtle.importKey(
  "jwk", publicKeyJwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["wrapKey"],
);
const aes = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 }, true, ["encrypt"],
);
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv }, aes, new TextEncoder().encode(JSON.stringify(secrets)),
);
const wrapped = await crypto.subtle.wrapKey("raw", aes, rsa, "RSA-OAEP");
const base64 = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(Array.from(new Uint8Array(bytes), byte => String.fromCharCode(byte)).join(""));
export default { iv: base64(iv), wrapped: base64(wrapped), encrypted: base64(encrypted) };
```

Save the returned object as `secrets.encrypted.json` in the temporary directory. Capture all three fields exactly; do not use a truncated result or print plaintext for debugging.

## 4. Upload locally

Save as `install-secrets.mjs`. From the destination repo, with Wrangler installed and authenticated, run:

```bash
node /path/to/install-secrets.mjs /path/to/temporary-directory ./wrangler.jsonc
```

For a named Wrangler environment, add `"--env", "ENVIRONMENT"` to the arguments below before running.

```javascript
import { readFileSync } from "node:fs";
import { privateDecrypt, createDecipheriv, constants } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const [dir, config] = process.argv.slice(2);
if (!dir || !config) throw new Error("Usage: node install-secrets.mjs DIR CONFIG");
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
  const result = spawnSync(resolve("node_modules/.bin/wrangler"),
    ["secret", "bulk", "--config", resolve(config)],
    { input: plaintext, stdio: ["pipe", "ignore", "ignore"] });
  if (result.status !== 0) throw new Error("Upload failed");
  console.log("Secrets uploaded.");
} catch {
  console.error("Transfer failed. Check the envelope, key, account, and Worker config.");
  process.exitCode = 1;
} finally {
  key?.fill(0);
  plaintext?.fill(0);
}
```

If the upload fails, check authentication and configuration using commands that do not handle secret values. Do not print decrypted data or enable verbose logging around the upload.

## 5. Verify and clean up

Use `wrangler secret list` with the same config/environment to check names, then test the app’s actual login or provider call. Names alone do not verify values.

After success, delete the temporary Val Town script and local transfer directory, including both keys and ciphertext. Retain the original service credentials until cutover is verified; rotate them if they were exposed.

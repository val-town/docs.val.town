---
title: "Transfer env vars"
description: "Val Town migration guide: Transfer env vars"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

Move only the env vars the app needs, including those from attached Val Town environment groups. Do not copy Val Town’s injected platform credentials. Its MCP lists names, not values; code run inside the val can read them.

## 1. Prepare Vercel

Install [Vercel CLI](https://vercel.com/docs/cli) locally with `npm install --save-dev vercel`, then run `npx vercel login` and `npx vercel link` in the destination repo. Confirm the selected team/project and keep `.vercel` out of Git.

The uploader below adds sensitive variables to **production** or **preview**, one at a time. It stops on errors rather than silently overwriting existing variables. If some were added before failure, inspect names and resolve the remaining entries; do not blindly rerun over a partial result.

Never use browser prefixes such as `VITE_` or `NEXT_PUBLIC_` for secrets.

## 2. Generate a local key

Save as `make-transfer-key.mjs` and run it with Node. It prints a temporary directory, containing a private key and public JWK. Keep that directory outside the repo.

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

## 3. Encrypt inside the source val

Create a temporary script file in the original val. Replace `PASTE_PUBLIC_JSON` with the contents of `public.json` and set the required names. Run it with Val Town’s `run_file`.

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

Save the returned object as `secrets.encrypted.json` beside `private.pem`. Check that none of the three fields was truncated. Only ciphertext crosses the conversation; the private key stays local. This prevents accidental plaintext in chat, not access by an agent controlling that computer.

## 4. Upload through stdin

Save as `upload-env.mjs`. Run it from the linked project:

```bash
node /path/to/upload-env.mjs /path/to/temporary-directory production
```

For an isolated preview branch, append `preview migration-test` instead. The uploader requires a branch for preview to avoid an interactive branch prompt. [Vercel CLI](https://vercel.com/docs/cli/env) receives each value through stdin; no value is written to a plaintext env file or passed as a command argument.

```javascript
import { readFileSync } from "node:fs";
import { privateDecrypt, createDecipheriv, constants } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const [dir, target = "production", branch] = process.argv.slice(2);
if (!dir || !["production", "preview"].includes(target) || (target === "preview" && !branch)) {
  throw new Error("Usage: node upload-env.mjs DIRECTORY production|preview [PREVIEW_BRANCH]");
}
let key, plaintext;
let failure = "Transfer stopped. Check the key, linked project, and existing env var names.";
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
  const values = JSON.parse(plaintext);
  for (const [name, value] of Object.entries(values)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) || typeof value !== "string") {
      throw new Error("Invalid env var");
    }
    const input = Buffer.from(value);
    try {
      const result = spawnSync(resolve("node_modules/.bin/vercel"),
        ["env", "add", name, target, ...(branch ? [branch] : []), "--sensitive"],
        { input, stdio: ["pipe", "ignore", "ignore"] });
      if (result.error) {
        failure = "Vercel CLI could not start. Install it as a local dependency.";
        throw new Error("CLI unavailable");
      }
      if (result.status !== 0) throw new Error("Upload failed");
    } finally { input.fill(0); }
    console.log("Added " + name);
  }
} catch {
  console.error(failure);
  process.exitCode = 1;
} finally {
  key?.fill(0);
  plaintext?.fill(0);
}
```

If replacing an existing value is intended, use `vercel env update NAME TARGET --sensitive --yes` through the same stdin mechanism. Verify the exact project/scope before replacement.

For a branch-specific Preview transfer, connect the project to Git and use an existing branch. Push that branch or run `vercel deploy` from its checkout. Check `vercel env ls preview BRANCH` and confirm the deployment details show that branch; preview-wide variables must not contain production database, Blob, AI, or mail credentials.

## 5. Verify and clean up

Run `vercel env ls production` (or preview) to check names. Redeploy, then test the actual login or provider call. Existing deployments do not pick up changed env vars.

Delete the temporary Val Town script and local key/ciphertext directory after success. Keep original credentials working until cutover is verified.

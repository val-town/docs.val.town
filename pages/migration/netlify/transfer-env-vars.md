---
title: "Transfer env vars"
description: "Val Town migration guide: Transfer env vars"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

Move required Val Town env vars into Netlify without printing their values. The MCP lists names; a script in the source val can read and encrypt values. Only the local process decrypts them before sending them to Netlify over HTTPS.

## 1. Choose the variables

Inspect imports and attached env groups. Transfer only required keys—not Val Town’s injected platform credentials. Select the destination team, site, production context, and runtime. This example creates **new Node Functions variables**, with Functions scope and secret values. Granular scope/secret controls depend on the plan; check [Netlify’s environment-variable API](https://open-api.netlify.com/#tag/Environment-variables) before adapting it. If the plan cannot apply these controls, agree with the user whether to upgrade or use the plan’s available settings; do not silently broaden credentials. Use separate non-production credentials for local/preview tests. Preserve intentional empty values.

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

## 4. Upload to Netlify

Create a Netlify personal access token or use an authorized local credential. Supply `NETLIFY_AUTH_TOKEN`, `NETLIFY_ACCOUNT_ID`, and `NETLIFY_SITE_ID` to the local process without printing them or passing their values as command arguments. The account ID can also be the team slug.

Save this as `install-netlify-env.mjs` and run `node install-netlify-env.mjs /path/to/transfer-directory`. It uses Netlify’s API directly; it never writes plaintext variables to disk or logs the API response.

```javascript
import { readFileSync } from "node:fs";
import { privateDecrypt, createDecipheriv, constants } from "node:crypto";
import { join } from "node:path";

const [dir] = process.argv.slice(2);
const { NETLIFY_AUTH_TOKEN, NETLIFY_ACCOUNT_ID, NETLIFY_SITE_ID } = process.env;
if (!dir || !NETLIFY_AUTH_TOKEN || !NETLIFY_ACCOUNT_ID || !NETLIFY_SITE_ID) {
  throw new Error("Transfer directory and Netlify account/site/token required");
}
let key, plaintext;
let stage = 'read';
try {
  const envelope = JSON.parse(readFileSync(join(dir, "secrets.encrypted.json"), "utf8"));
  stage = "decrypt";
  key = privateDecrypt({
    key: readFileSync(join(dir, "private.pem")),
    padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",
  }, Buffer.from(envelope.wrapped, "base64"));
  const bytes = Buffer.from(envelope.encrypted, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(bytes.subarray(-16));
  plaintext = Buffer.concat([decipher.update(bytes.subarray(0, -16)), decipher.final()]);
  const values = JSON.parse(plaintext);
  const body = Object.entries(values).map(([key, value]) => ({
    key, scopes: ["functions"], is_secret: true,
    values: [{ context: "production", value }],
  }));
  const url = new URL(
    "https://api.netlify.com/api/v1/accounts/" +
    encodeURIComponent(NETLIFY_ACCOUNT_ID) + "/env",
  );
  url.searchParams.set("site_id", NETLIFY_SITE_ID);
  stage = "check existing names";
  const headers = { Authorization: "Bearer " + NETLIFY_AUTH_TOKEN, "Content-Type": "application/json" };
  const existing = await fetch(url, { headers, redirect: "error" });
  if (!existing.ok) throw new Error("HTTP " + existing.status);
  const names = new Set((await existing.json()).map(item => item.key));
  const overlaps = body.filter(item => names.has(item.key)).map(item => item.key);
  if (overlaps.length) throw new Error("Existing keys: " + overlaps.join(", "));
  stage = "upload";
  const response = await fetch(url, {
    method: "POST", redirect: "error",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  console.log("Env vars uploaded.");
} catch (error) {
  const safeDetail = error instanceof Error && /^(HTTP \d{3}|Existing keys:)/.test(error.message)
    ? ": " + error.message : "";
  console.error("Transfer failed at " + stage + safeDetail);
  process.exitCode = 1;
} finally {
  key?.fill(0); plaintext?.fill(0);
}
```

If a key already exists, inspect its contexts and use the API’s update operation or Netlify UI to change only the intended value; do not delete/recreate all site variables. If an upload outcome is uncertain, check names/context before retrying.

## 5. Verify and clean up

Deploy the site after changing variables. Node Functions read them with `process.env.KEY`; `netlify.toml` values are not automatically Function variables. Test a real provider call or login without returning credentials. Keep production values out of untrusted Deploy Previews and browser builds.

Delete the temporary Val Town script and local key/encrypted files after success. Retain old provider keys until cutover is verified.

For Lambda compatibility Functions, [env vars have a combined 4KB limit](https://docs.netlify.com/build/functions/environment-variables/); modern Node Functions remove that particular limit. Do not overwrite reserved AWS variable names. Rename conflicting application keys and update their uses.

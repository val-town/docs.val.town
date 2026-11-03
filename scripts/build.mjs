import * as fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { toSSG } from "hono/ssg";

await fs.mkdir("generated", { recursive: true });
const pages = {};
for (const file of (await fs.readdir("pages", { recursive: true })).filter(file => file.endsWith(".md")).sort()) {
  pages[`pages/${file}`] = await fs.readFile(`pages/${file}`, "utf8");
}
await fs.writeFile("generated/pages.json", JSON.stringify(pages) + "\n");
await build({
  entryPoints: ["scripts/assets.ts"], outfile: "generated/build-assets.mjs",
  bundle: true, platform: "node", format: "esm", packages: "external",
  loader: { ".css": "text" },
});
const { default: app } = await import("../generated/build-assets.mjs");
await fs.rm("static", { recursive: true, force: true });
const result = await toSSG(app, fs, { dir: "static" });
if (!result.success) throw result.error ?? new Error("Asset generation failed");
const assets = {};
for (const [key, file] of Object.entries({ styles: "styles.css", search: "search-index.json" })) {
  const content = await fs.readFile(`static/${file}`);
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 12);
  const dot = file.lastIndexOf(".");
  const name = `${file.slice(0, dot)}.${hash}${file.slice(dot)}`;
  await fs.rename(`static/${file}`, `static/${name}`);
  assets[key] = `/${name}`;
}
await fs.writeFile("generated/assets.json", JSON.stringify(assets, null, 2) + "\n");
await fs.cp("public", "static", { recursive: true });
await fs.writeFile("static/_headers", "/styles.*.css\n  Cache-Control: public, max-age=31536000, immutable\n/search-index.*.json\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=86400\n");
console.log("Built CSS and search index:", assets);

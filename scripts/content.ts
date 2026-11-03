import { readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";

export async function readAllPages() {
  const files = (await readdir("pages", { recursive: true })).filter((file) => file.endsWith(".md") && file !== "404.md").sort();
  return Promise.all(files.map(async (file) => {
    const raw = await readFile(`pages/${file}`, "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "").replace(/\/index$/, "");
    return { urlPath: slug === "index" ? "/" : `/${slug}`, data, content };
  }));
}

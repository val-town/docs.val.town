import matter from "gray-matter";
import files from "../generated/pages.json";

export type Page = {
  path: string;
  urlPath: string;
  raw: string;
  data: { title?: string; description?: string; updated?: Date | string } & Record<string, unknown>;
  content: string;
  updatedAt?: string;
};

export function fileToUrlPath(path: string): string {
  const slug = path.replace(/^pages\//, "").replace(/\.md$/, "").replace(/\/index$/, "");
  return slug === "index" ? "/" : `/${slug}`;
}

export async function readPage(urlPath: string) {
  const slug = urlPath.replace(/^\/+|\/+$/g, "") || "index";
  for (const path of [`pages/${slug}.md`, `pages/${slug}/index.md`]) {
    const raw = (files as Record<string, string>)[path];
    if (raw !== undefined) return { path, raw };
  }
  return null;
}

export async function readAllPages(): Promise<Page[]> {
  return Object.entries(files).filter(([path]) => path !== "pages/404.md").map(([path, raw]) => {
    const { data, content } = matter(raw);
    return { path, urlPath: fileToUrlPath(path), raw, data, content };
  });
}

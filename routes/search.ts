import MiniSearch from "minisearch";
import { type Context } from "hono";
import { SEARCH_OPTIONS } from "../lib/search-options";
import { readAllPages } from "../scripts/content";

/*
 * Human-readable section label from the first URL segment.
 */
function sectionLabel(urlPath: string): string {
  if (urlPath === "/") return "Getting started";
  const first = urlPath.slice(1).split("/")[0];
  return first
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/*
 * Strip markdown down to searchable prose. Code blocks are dropped (noisy),
 * link/image syntax is unwrapped to its text, and structural punctuation is
 * removed while word-internal hyphens are preserved.
 */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/<!--[\s\S]*?-->/g, " ") // html comments
    .replace(/<[^>]+>/g, " ") // html tags
    .replace(/^#{1,6}\s+/gm, " ") // heading markers
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, " ") // list markers
    .replace(/^\s{0,3}>+\s?/gm, " ") // blockquotes
    .replace(/^\s*\|.*$/gm, " ") // table rows
    .replace(/[*_~]+/g, "") // emphasis
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Collect h1–h6 heading text from raw markdown (before stripping).
 */
function extractHeadings(content: string): string {
  const headings: string[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^#{1,6}\s+(.*)$/);
    if (match) headings.push(match[1].replace(/[*_`~]+/g, "").trim());
  }
  return headings.join(" ");
}

type SearchDoc = {
  id: string;
  path: string;
  title: string;
  section: string;
  description: string;
  headings: string;
  body: string;
};

/*
 * Read every markdown page and turn it into a search document.
 */
async function collectDocs(): Promise<SearchDoc[]> {
  const pages = await readAllPages();

  return pages.map(({ urlPath, data, content }) => ({
    id: urlPath,
    path: urlPath,
    title: data.title ?? urlPath,
    section: sectionLabel(urlPath),
    description: data.description ?? "",
    headings: extractHeadings(content),
    body: toPlainText(content),
  }));
}

/*
 * Serialized MiniSearch index over every page, fetched lazily by the client
 * search box. Generated at build time and served as a content-hashed static asset.
 */
export async function searchIndex(c: Context) {
  const docs = await collectDocs();
  const mini = new MiniSearch(SEARCH_OPTIONS);
  mini.addAll(docs);

  return c.body(JSON.stringify(mini), 200, {
    "content-type": "application/json; charset=utf-8",
  });
}

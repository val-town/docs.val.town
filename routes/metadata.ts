import { type Context } from "hono";
import { nav, type NavItem } from "../components/SIDEBAR.ts";
import { type Page, readAllPages, toIsoDate } from "./pages.tsx";

/*
 * Machine-readable descriptions of the site: robots.txt, sitemap.xml, and the
 * two llms.txt files. All take their origin from the request, so branch
 * previews emit self-consistent URLs.
 */

const TEXT = { "content-type": "text/plain; charset=utf-8" };

/* --------- */
/* robots.txt */
/* --------- */

export function robots(c: Context) {
  const { origin } = new URL(c.req.url);
  return c.body(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    200,
    TEXT,
  );
}

/* ----------- */
/* sitemap.xml */
/* ----------- */

/*
 * Every page, in the canonical no-trailing-slash form the router serves
 * directly. Unlike llms.txt this covers all pages, not just the ones in the
 * nav, since they're all public and indexable.
 */
export async function sitemap(c: Context) {
  const { origin } = new URL(c.req.url);
  const pages = await readAllPages();
  const urls = pages
    .map(({ urlPath, data }) => {
      const updated = toIsoDate(data.updated);
      const lastmod = updated ? `<lastmod>${updated}</lastmod>` : "";
      return `  <url><loc>${origin}${urlPath}</loc>${lastmod}</url>`;
    })
    .sort()
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8" });
}

/* ---------------------------- */
/* llms.txt and llms-full.txt   */
/* ---------------------------- */

/*
 * Group every nav href under its top-level section, depth-first. Nested
 * sub-groups are flattened into their top-level section's list, so llms.txt
 * stays two levels deep (## section, then links).
 *
 * Nav is the source of truth rather than the filesystem: pages deliberately
 * left out of the sidebar (deprecated and upgrade guides) stay out of here too,
 * so agents aren't fed superseded patterns as if they were current.
 */
function navSections(): Array<{ label: string; hrefs: string[] }> {
  const collect = (item: NavItem, out: string[]) => {
    if ("items" in item) item.items.forEach((child) => collect(child, out));
    else out.push(item.href);
  };

  return nav.map((item) => {
    const hrefs: string[] = [];
    collect(item, hrefs);
    return { label: item.label, hrefs };
  });
}

/*
 * URL of a page's raw markdown, served by the .md route.
 * The index page lives at /index.md, since "/" + ".md" isn't a route.
 */
const markdownUrl = (origin: string, urlPath: string) =>
  `${origin}${urlPath === "/" ? "/index" : urlPath}.md`;

/*
 * Rough token count, so agents can budget context before fetching a page.
 * Deliberately a heuristic rather than a real tokenizer: every model tokenizes
 * differently, so a precise number would be false precision for all but one of
 * them. ~4 characters per token, rounded to hide the imprecision.
 *
 * Measured against the raw file, frontmatter included — that's what an agent
 * actually pays for when it fetches the .md URL.
 */
function estimateTokens(text: string): string {
  // Round before choosing the unit, so 970 reads "~1.0k" and not "~1000"
  const tokens = Math.max(100, Math.round(text.length / 400) * 100);
  return tokens >= 1000
    ? `~${(tokens / 1000).toFixed(1)}k tokens`
    : `~${tokens} tokens`;
}

/*
 * The parenthetical after a page's link: token estimate, plus the last-updated
 * date when the page declares one. Only some pages carry a date — the ported
 * ones that had a curated date in the legacy docs — so this stays optional
 * rather than falling back to a guess.
 */
function pageMeta(page: Page): string {
  const updated = toIsoDate(page.data.updated);
  const parts = [estimateTokens(page.raw)];
  if (updated) parts.push(`updated ${updated}`);
  return ` (${parts.join(", ")})`;
}

/*
 * Walk the nav sections, resolving each href to its page. Hrefs with no
 * matching file are skipped.
 */
async function sectionsWithPages(): Promise<
  Array<{ label: string; pages: Page[] }>
> {
  const byUrlPath = new Map((await readAllPages()).map((p) => [p.urlPath, p]));

  return navSections()
    .map(({ label, hrefs }) => ({
      label,
      pages: hrefs
        .map((href) => byUrlPath.get(href))
        .filter((p): p is Page => Boolean(p)),
    }))
    .filter(({ pages }) => pages.length > 0);
}

/*
 * llms.txt — an index of every page, linking to its markdown source.
 * https://llmstxt.org
 */
export async function llmsTxt(c: Context) {
  const { origin } = new URL(c.req.url);
  const sections = await sectionsWithPages();

  // Sized on the bodies, since llms-full.txt strips frontmatter
  const fullSize = estimateTokens(
    sections.flatMap(({ pages }) => pages.map((p) => p.content)).join(""),
  );

  const lines = [
    "# Val Town Documentation",
    "",
    "> Documentation for humans and agents building on Val Town, a platform for",
    "> writing and running TypeScript on Deno, always deployed in 100ms.",
    "",
    `- [Full documentation in one file](${origin}/llms-full.txt) (${fullSize})`,
    "",
  ];

  for (const { label, pages } of sections) {
    lines.push(`## ${label}`);
    for (const page of pages) {
      const title = page.data.title ?? page.urlPath;
      const description = page.data.description
        ? `: ${page.data.description}`
        : "";
      lines.push(
        `- [${title}](${markdownUrl(origin, page.urlPath)})${
          pageMeta(page)
        }${description}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Optional",
    "- [Discord](https://discord.gg/dHv45uN5RY)",
    "- [Email](mailto:hi@val.town)",
    "- [Blog](https://blog.val.town/)",
    "",
  );

  return c.body(lines.join("\n"), 200, TEXT);
}

/*
 * llms-full.txt — every page's markdown concatenated in nav order. Frontmatter
 * is replaced by an h1 and a source URL so each page is self-identifying.
 */
export async function llmsFull(c: Context) {
  const { origin } = new URL(c.req.url);
  const sections = await sectionsWithPages();

  const parts = ["# Val Town Documentation", ""];

  for (const { pages } of sections) {
    for (const page of pages) {
      parts.push(
        "---",
        "",
        `# ${page.data.title ?? page.urlPath}`,
        "",
        `Source: ${markdownUrl(origin, page.urlPath)}`,
        "",
        page.content.trim(),
        "",
      );
    }
  }

  return c.body(parts.join("\n"), 200, TEXT);
}
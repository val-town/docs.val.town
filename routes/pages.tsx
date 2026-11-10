/** @jsxImportSource hono/jsx */

import { type Context, type Next } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import matter from "gray-matter";
import { Marked, Parser, TextRenderer, type Tokens } from "marked";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import diff from "highlight.js/lib/languages/diff";
import markdown from "highlight.js/lib/languages/markdown";
import { readPage } from "../lib/content";
export { readPage, readAllPages, type Page } from "../lib/content";
import notFoundMarkdown from "../pages/404.md";
import Layout from "../components/Layout.tsx";
import type { Heading } from "../components/Toc.tsx";

export function toIsoDate(value: Date | string | undefined): string | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/*
 * Render raw markdown to HTML and wrap it in the site Layout.
 * Each heading gets a slug id; h2/h3 are collected for the TOC.
 */
export function renderPage(
  c: Context,
  raw: string,
  pathname: string,
  status: ContentfulStatusCode = 200,
) {
  const { data, content } = matter(raw);
  const updated = data.updated ? toIsoDate(data.updated) : null;

  const headings: Heading[] = [];
  const textParser = new Parser();
  const textRenderer = new TextRenderer();
  const usedSlugs = new Set<string>();
  const slugify = (text: string) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-") || "section";
    let slug = base;
    for (let i = 1; usedSlugs.has(slug); i++) slug = `${base}-${i}`;
    usedSlugs.add(slug);
    return slug;
  };

  const marked = new Marked();
  marked.use({
    renderer: {
      code(token: Tokens.Code) {
        const lang = (token.lang || "").trim().split(/\s+/)[0];
        const body = lang && hljs.getLanguage(lang)
          ? hljs.highlight(token.text, { language: lang }).value
          : escapeHtml(token.text);
        const langClass = lang ? ` language-${lang}` : "";
        return `<div class="code-block"><button class="copy-code" type="button" aria-label="Copy code">Copy</button><pre><code class="hljs${langClass}">${body}</code></pre></div>\n`;
      },
      heading(
        this: { parser: { parseInline(t: unknown[]): string } },
        token: Tokens.Heading,
      ) {
        const slug = slugify(token.text);
        if (token.depth === 2 || token.depth === 3) {
          headings.push({
            id: slug,
            level: token.depth,
            text: textParser.parseInline(token.tokens, textRenderer),
          });
        }
        const inner = this.parser.parseInline(token.tokens);
        if (token.depth === 1) {
          return `<h${token.depth} id="${slug}">${inner}</h${token.depth}>\n`;
        }
        return `<h${token.depth} id="${slug}"><a class="permalink" href="#${slug}">${inner}<span class="permalink-hash" aria-hidden="true">#</span></a></h${token.depth}>\n`;
      },
    },
  });
  const html = marked.parse(content) as string;

  return c.html(
    <Layout
      title={data.title}
      description={data.description}
      updated={updated}
      headings={headings}
      pathname={pathname}
      origin={new URL(c.req.url).origin}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>,
    status,
  );
}

/* -------- */
/* Handlers */
/* -------- */

/*
 * Raw markdown source at <path>.md
 */
export async function rawMarkdown(c: Context) {
  const path = (c.req.param("path") ?? "").replace(/\.md$/, "");
  const page = await readPage(path);
  if (!page) return c.notFound();
  return c.body(page.raw, 200, {
    "content-type": "text/markdown; charset=utf-8",
  });
}

/*
 * Every markdown file in /pages, rendered as HTML. Falls through to the 404
 * handler when there's no matching file.
 */
export async function htmlPage(c: Context, next: Next) {
  const { path } = c.req.param(); // e.g. "/" or "/vals" or "/vals/http/jsx"
  const normalized = path.replace(/\/+$/, "") || "index"; // trim trailing slash; default to index
  const pathname = normalized === "index" ? "/" : `/${normalized}`; // matches SIDEBAR.ts hrefs

  const page = await readPage(path);
  if (!page) return next();

  return renderPage(c, page.raw, pathname, 200);
}

/*
 * pages/404.md for any unmatched path
 */
export async function notFound(c: Context) {
  const raw = notFoundMarkdown;
  return renderPage(c, raw, c.req.path, 404);
}


hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("diff", diff);
hljs.registerLanguage("markdown", markdown);
hljs.registerAliases(["tsx"], { languageName: "typescript" });

import { type Context, type Next } from "hono";

/*
 * Redirects from legacy docs (_redirects)
 * <old>: <new>
 */

const redirects: Record<string, string> = {
  "/api": "/reference/api/",
  "/api/aliases": "/openapi#tag/alias",
  "/api/authentication": "/reference/api/authentication/",
  "/api/esm-town": "/reference/esm-town",
  "/api/eval": "/openapi#tag/vals",
  "/api/index": "/reference/api/index/",
  "/api/my-resources": "/openapi#tag/me",
  "/api/overview": "/api/",
  "/api/run": "/openapi#tag/vals/GET/v1/run/{valname}",
  "/api/sdk": "/reference/api/sdk/",
  "/api/users": "/openapi#tag/users",
  "/api/vals": "/openapi#tag/vals",
  "/create-a-discord-welcome-bot": "/guides/discord/bot",
  "/demo": "https://www.youtube.com/watch?v=v6qt5aa_um4",
  "/discord-bot-that-replies-to-slash-commands":
    "/guides/discord/how-to-make-a-discord-bot-24-7",
  "/guides/prompting/claude-code-mcp": "/guides/prompting/claude-code",
  "/integrations/databases/neon-postgres": "/guides/databases/neon-postgres/",
  "/integrations/databases/planetscale": "/guides/databases/planetscale/",
  "/integrations/databases/supabase": "/guides/databases/supabase/",
  "/integrations/databases/upstash": "/guides/databases/upstash/",
  "/integrations/discord/bot": "/guides/discord/bot/",
  "/integrations/discord/how-to-make-a-discord-bot-hosted-24-7-for-free-in-":
    "/guides/discord/how-to-make-a-discord-bot-24-7",
  "/integrations/discord/send-message": "/guides/discord/send-message/",
  "/integrations/github/get-a-github-user": "/guides/github/get-a-github-user/",
  "/integrations/github/github-users-stars-pagination":
    "/guides/github/github-users-stars-pagination/",
  "/integrations/github/receiving-a-github-webhook":
    "/guides/github/receiving-a-github-webhook/",
  "/integrations/slack/bot": "/guides/slack/bot/",
  "/integrations/slack/send-messages-to-slack":
    "/guides/slack/send-messages-to-slack/",
  "/integrations/airtable": "/guides/airtable/",
  "/integrations/browserbase": "/guides/browser-automation/browserbase/",
  "/integrations/browserless": "/guides/browser-automation/browserbase",
  "/guides/hosted-puppeteer-browserless":
    "/guides/browser-automation/browserbase",
  "/integrations/gmail": "/guides/gmail/",
  "/integrations/google-sheets": "/guides/google-sheets/",
  "/integrations/kernel": "/guides/browser-automation/kernel/",
  "/integrations/s3": "/guides/s3/",
  "/integrations/sqlite-wasm": "/guides/sqlite-wasm/",
  "/integrations/steel": "/guides/browser-automation/steel/",
  "/integrations/stripe": "/guides/stripe/",
  "/integrations/supabase": "/guides/supabase/",
  "/integrations/telegram": "/guides/telegram/",
  "/planetscale": "/guides/databases/planetscale/",
  "/pricing": "https://www.val.town/pricing",
  "/quickstarts/first-cron": "/guides/first-cron",
  "/quickstarts/prompting": "/guides/prompting",
  "/quickstarts/first-website": "/guides/first-website",
  "/secrets": "/reference/environment-variables/",
  "/std/sqlite": "/reference/std/sqlite/",
  "/std/sqlite/migrations": "/reference/std/sqlite/migrations/",
  "/std/sqlite/orms": "/reference/std/sqlite/orms/",
  "/std/sqlite/usage": "/reference/std/sqlite/usage/",
  "/std/blob": "/reference/std/blob/",
  "/std/email": "/reference/std/email/",
  "/std/fetch": "/reference/std/fetch/",
  "/std/openai": "/reference/std/openai/",
  "/tips": "/",
  "/types/scheduled": "/types/cron",
  "/types/web": "/types/http",
  "/web-scraping": "/guides/web-scraping/",
  "/reference/custom-domains": "/types/http/custom-domains/",
  "/openapi.json": "https://api.val.town/openapi.json",
  "/openapi.html": "/openapi",
  "/reference/bot-rate-limiting": "/troubleshooting/bot-rate-limiting/",
  "/sdk": "https://sdk.val.town",
  /* Starlight generated a sitemap index; we serve a single sitemap. */
  "/sitemap-index.xml": "/sitemap.xml",
  "/sitemap-0.xml": "/sitemap.xml",
};

const prefixRedirects: Array<[string, string]> = [["/types/", "/vals/"]];

/*
 * Send legacy URLs to their current home (301). Exact matches win; otherwise
 * the first matching prefix rule rewrites the leading segment. Any query string
 * is carried over unless the target already has one.
 */
export async function legacyRedirects(c: Context, next: Next) {
  const url = new URL(c.req.url);
  const path = url.pathname === "/"
    ? "/"
    : url.pathname.replace(/\/+$/, "") || "/";

  let target = redirects[path];
  if (!target) {
    const rule = prefixRedirects.find(([from]) => path.startsWith(from));
    if (rule) target = rule[1] + path.slice(rule[0].length);
  }
  if (!target) return next();

  if (url.search && !target.includes("?")) target += url.search;
  return c.redirect(target, 301);
}
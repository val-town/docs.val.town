import { migrationNav } from "./MigrationNav.ts";

export type NavItem =
  | { label: string; href: string }
  | { label: string; items: NavItem[]; collapsed?: boolean };

export const nav: NavItem[] = [
  { label: "Getting started", href: "/" },
  migrationNav,
  {
    label: "Vals",
    items: [
      { label: "What’s a val?", href: "/vals" },
      {
        label: "Http",
        collapsed: true,
        items: [
          { label: "Overview", href: "/vals/http" },
          { label: "Basic examples", href: "/vals/http/basic-examples" },
          { label: "Custom domains", href: "/vals/http/custom-domains" },
          {
            label: "Custom subdomains",
            href: "/vals/http/custom-subdomains",
          },
          { label: "HTML & JSX", href: "/vals/http/jsx" },
          { label: "APIs & Routers", href: "/vals/http/routing" },
          { label: "CDNs, caching", href: "/vals/http/cdns" },
          { label: "Early return", href: "/vals/http/early-return" },
        ],
      },
      { label: "Cron", href: "/vals/cron" },
      { label: "Email", href: "/vals/email" },
    ],
  },
  {
    label: "Reference",
    collapsed: true,
    items: [
      {
        label: "Standard library",
        items: [
          { label: "Email", href: "/reference/std/email" },
          {
            label: "SQLite",
            collapsed: true,
            items: [
              { label: "Overview", href: "/reference/std/sqlite" },
              { label: "Admin", href: "/reference/std/sqlite/admin" },
              { label: "Global", href: "/reference/std/sqlite/global" },
              { label: "Migrations", href: "/reference/std/sqlite/migrations" },
              { label: "ORMs", href: "/reference/std/sqlite/orms" },
              { label: "Usage", href: "/reference/std/sqlite/usage" },
            ],
          },
          { label: "Blob storage", href: "/reference/std/blob" },
        ],
      },
      {
        label: "Platform",
        collapsed: true,
        items: [
          {
            label: "Access",
            href: "/reference/access",
          },
          {
            label: "Environment variables",
            href: "/reference/environment-variables",
          },
          {
            label: "Environment groups",
            href: "/reference/environment-groups",
          },
          { label: "Imports", href: "/reference/import" },
          { label: "Runtime", href: "/reference/runtime" },
          { label: "Interop", href: "/guides/interop" },
          { label: "Deno LSP", href: "/reference/deno-lsp" },
          { label: "esm.town", href: "/reference/esm-town" },
          { label: "File I/O", href: "/reference/file-io" },
          { label: "Images", href: "/reference/images" },
          { label: "Permissions", href: "/reference/permissions" },
          { label: "Keyboard shortcuts", href: "/reference/shortcuts" },
          { label: "Version control", href: "/reference/version-control" },
        ],
      },
      {
        label: "API",
        collapsed: true,
        items: [
          { label: "Overview", href: "/reference/api" },
          { label: "OAuth", href: "/reference/api/oauth" },
          { label: "Authentication", href: "/reference/api/authentication" },
          { label: "JavaScript SDK", href: "/reference/api/sdk" },
        ],
      },
    ],
  },
  {
    label: "Guides",
    collapsed: true,
    items: [
      { label: "Auth", href: "/guides/auth" },
      {
        label: "AI",
        collapsed: true,
        items: [
          { label: "Overview", href: "/guides/prompting" },
          { label: "Townie", href: "/guides/prompting/townie" },
          { label: "Plugin", href: "/guides/prompting/plugin" },
          { label: "Skills", href: "/guides/prompting/skills" },
          { label: "MCP", href: "/guides/prompting/mcp" },
          { label: "vt CLI", href: "/guides/prompting/cli" },
          { label: "Claude", href: "/guides/prompting/claude" },
          { label: "Claude Code", href: "/guides/prompting/claude-code" },
          { label: "ChatGPT", href: "/guides/prompting/chatgpt" },
          { label: "Codex", href: "/guides/prompting/openai-codex" },
          { label: "Cursor", href: "/guides/prompting/cursor" },
          { label: "GitHub Copilot", href: "/guides/prompting/github-copilot" },
          { label: "Warp", href: "/guides/prompting/warp" },
          { label: "Windsurf", href: "/guides/prompting/windsurf" },
          { label: "Zed", href: "/guides/prompting/zed" },
        ],
      },
      {
        label: "Collaboration",
        collapsed: true,
        items: [
          { label: "Organizations", href: "/vals/organizations" },
          { label: "Branches", href: "/vals/branches" },
          { label: "Remixes", href: "/vals/remixes" },
          { label: "Pull Requests", href: "/vals/pull-requests" },
          { label: "History", href: "/vals/history" },
        ],
      },
      {
        label: "Use cases",
        collapsed: true,
        items: [
          {
            label: "Build an MCP server",
            href: "/guides/how-to-build-an-mcp-server",
          },
          {
            label: "Deploy Claude Artifact",
            href: "/guides/deploy-a-claude-artifact",
          },
          { label: "Webhooks", href: "/guides/creating-a-webhook" },
          {
            label: "APIs",
            href: "/guides/deploy-an-api-endpoint",
          },
          {
            label: "Email",
            href: "/guides/email-address-that-runs-code",
          },
          { label: "Cron", href: "/guides/first-cron" },
          { label: "Website", href: "/guides/first-website" },
          { label: "PDF", href: "/guides/generate-pdfs" },
          { label: "QR code", href: "/guides/qr-code" },
          { label: "Push notifications", href: "/guides/push-notifications" },
          { label: "RSS", href: "/guides/rss" },
          {
            label: "RSS-to-email",
            href: "/guides/rss-daily-email-digest",
          },
          {
            label: "HTML form",
            href: "/guides/put-a-form-online",
          },
          {
            label: "Scraping",
            href: "/guides/scrape-website-daily-email",
          },
          {
            label: "Downtime alerts",
            href: "/guides/website-down-email-alert",
          },
          { label: "Embedding vals", href: "/guides/embed" },
          {
            label: "Rate-limit cache",
            href: "/guides/cache-rate-limited-api",
          },
        ],
      },
      {
        label: "Integrations",
        collapsed: true,
        items: [
          {
            label: "Slack",
            collapsed: true,
            items: [
              { label: "Agent", href: "/guides/slack/agent" },
              { label: "Bot", href: "/guides/slack/bot" },
              {
                label: "Send messages",
                href: "/guides/slack/send-messages-to-slack",
              },
            ],
          },
          {
            label: "Github",
            collapsed: true,
            items: [
              {
                label: "Syncing",
                collapsed: true,
                items: [
                  { label: "Overview", href: "/guides/github-sync" },
                  {
                    label: "GH actions + vt CLI",
                    href: "/guides/github-sync/github-actions",
                  },
                  {
                    label: "Sync code",
                    href: "/guides/github-sync/val-town-code",
                  },
                ],
              },
              {
                label: "Get a user",
                href: "/guides/github/get-a-github-user",
              },
              {
                label: "Get stars",
                href: "/guides/github/github-users-stars-pagination",
              },
              {
                label: "Star catcher",
                href: "/guides/github-star-notifications",
              },
              {
                label: "Webhooks",
                href: "/guides/github/receiving-a-github-webhook",
              },
            ],
          },
          { label: "OpenRouter", href: "/guides/openrouter" },
          { label: "Stripe", href: "/guides/stripe" },
          {
            label: "Databases",
            collapsed: true,
            items: [
              {
                label: "Neon Postgres",
                href: "/guides/databases/neon-postgres",
              },
              { label: "PlanetScale", href: "/guides/databases/planetscale" },
              {
                label: "Prisma Postgres",
                href: "/guides/databases/prisma-postgres",
              },
              {
                label: "Supabase",
                collapsed: true,
                items: [
                  { label: "Postgres", href: "/guides/databases/supabase" },
                  { label: "Webhooks", href: "/guides/supabase" },
                ],
              },
              { label: "Upstash", href: "/guides/databases/upstash" },
            ],
          },
          {
            label: "Browser automation",
            collapsed: true,
            items: [
              {
                label: "Browserbase",
                href: "/guides/browser-automation/browserbase",
              },
              { label: "Kernel", href: "/guides/browser-automation/kernel" },
              { label: "Steel", href: "/guides/browser-automation/steel" },
            ],
          },
          {
            label: "Discord",
            collapsed: true,
            items: [
              { label: "Discord welcome bot", href: "/guides/discord/bot" },
              {
                label: "Discord bot",
                href: "/guides/discord/how-to-make-a-discord-bot-24-7",
              },
              {
                label: "Send Discord message via webhook",
                href: "/guides/discord/send-message",
              },
            ],
          },
          { label: "Airtable", href: "/guides/airtable" },
          { label: "AWS S3", href: "/guides/s3" },
          { label: "Gmail", href: "/guides/gmail" },
          { label: "Google Sheets", href: "/guides/google-sheets" },
          { label: "Octolens", href: "/guides/octolens" },
          { label: "FastComments", href: "/guides/fastcomments" },
          { label: "Telegram", href: "/guides/telegram" },
        ],
      },
    ],
  },
  {
    label: "Troubleshooting",
    collapsed: true,
    items: [
      { label: "Blocked bots", href: "/troubleshooting/bot-rate-limiting" },
      { label: "CORS", href: "/troubleshooting/cors" },
      { label: "Exports", href: "/troubleshooting/exports" },
      {
        label: "Permissions",
        href: "/troubleshooting/permission-errors",
      },
      { label: "Serialization", href: "/troubleshooting/serialization" },
      { label: "Limitations", href: "/vals/limitations" },
    ],
  },
  {
    label: "Contact",
    collapsed: true,
    items: [
      { label: "Contact us", href: "/contact-us/contact-us" },
      {
        label: "Vulnerability disclosure policy",
        href: "/contact-us/security",
      },
    ],
  },
  { label: "FAQ", href: "/faq" },
];

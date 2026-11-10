import type { NavItem } from "./SIDEBAR.ts";

function provider(label: string, path: string): NavItem {
  const base = `/migration/${path}`;
  const variables = path === "cloudflare"
    ? { label: "Transfer secrets", href: `${base}/transfer-secrets` }
    : { label: "Transfer env vars", href: `${base}/transfer-env-vars` };
  const jobs = path === "render"
    ? { label: "Migrate jobs", href: `${base}/migrate-jobs` }
    : { label: "Migrate crons", href: `${base}/migrate-crons` };

  return {
    label,
    collapsed: true,
    items: [
      { label: "Overview", href: base },
      { label: "Migrate code", href: `${base}/migrate-code` },
      variables,
      { label: "Migrate SQLite", href: `${base}/migrate-sqlite` },
      { label: "Migrate blobs", href: `${base}/migrate-blobs` },
      { label: "Migrate AI", href: `${base}/migrate-ai` },
      jobs,
      { label: "Migrate email", href: `${base}/migrate-email` },
      { label: "Migrate Access", href: `${base}/migrate-access` },
      { label: "Migrate domains", href: `${base}/migrate-domains` },
    ],
  };
}

export const migrationNav: NavItem = {
  label: "Migration",
  items: [
    { label: "Overview", href: "/migration" },
    { label: "Where to migrate", href: "/migration/where-to-migrate" },
    { label: "Store code on GitHub", href: "/migration/github" },
    { label: "Redirect val.run URLs", href: "/migration/redirects" },
    provider("Cloudflare", "cloudflare"),
    provider("Vercel", "vercel"),
    provider("Netlify", "netlify"),
    provider("Render", "render"),
  ],
};

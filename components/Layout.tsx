/** @jsxImportSource hono/jsx */
import assets from "../generated/assets.json";
import type { Child } from "hono/jsx";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import Content from "./Content.tsx";
import Toc, { type Heading } from "./Toc.tsx";
import Footer from "./Footer.tsx";
import Router from "./Router.tsx";

export default function Layout({
  title,
  description,
  updated,
  headings = [],
  pathname = "/",
  origin,
  children,
}: {
  title: string;
  description?: string;
  updated?: string | null;
  headings?: Heading[];
  pathname?: string;
  origin: string;
  children?: Child;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://docs.val.town${pathname}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Val Town Docs" />
        <meta
          property="og:image"
          content={`${origin}/images/val-town-logo-490813f7.webp`}
        />
        {updated && (
          <meta property="article:modified_time" content={updated} />
        )}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={`https://docs.val.town${pathname}`} />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={assets.styles} />
        <link
          rel="icon"
          type="image/png"
          href="/images/val-town-logo-490813f7.webp"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(${restoreSidebar.toString()})()`,
          }}
        />
      </head>

      <body>
        <Header />
        <Sidebar pathname={pathname} />
        <Content title={title} updated={updated}>
          {children}
        </Content>
        <Toc headings={headings} />
        <Footer />
        <Router />
      </body>
    </html>
  );
}

/*
 * Restores/persists the sidebar's collapsed state from localStorage.
 */
function restoreSidebar() {
  try {
    if (localStorage.getItem("sidebar") === "collapsed") {
      document.documentElement.classList.add("sidebar-collapsed");
    }
  } catch (_e) {}
  document.addEventListener("click", function (e: Event) {
    const target = e.target as Element | null;
    if (!target?.closest("#sidebar-toggle")) return;
    const c = document.documentElement.classList.toggle("sidebar-collapsed");
    try {
      localStorage.setItem("sidebar", c ? "collapsed" : "expanded");
    } catch (_e) {}
  });
}

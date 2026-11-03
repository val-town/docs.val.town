/** @jsxImportSource hono/jsx */
import { revealCurrent } from "./Sidebar.tsx";

/*
 * Client-side navigation.
 *
 * Renders one <script> that upgrades same-origin doc links into in-page swaps:
 * fetch the target page, replace <main id="content"> and the TOC, sync <head>,
 * push history. Header, sidebar and footer are byte-identical on every page, so
 * leaving them alone is both faster and the reason the sidebar keeps its scroll
 * position and open sections as you click around.
 *
 * Everything degrades. With JS off, on a fetch failure, on a mid-session
 * deploy, or on any markup we don't recognize, the link is just a link and the
 * browser does a full navigation.
 */
export default function Router() {
  return (
    <>
      {/* Decorative: the router announces loading via aria-busy on <body>. */}
      <div id="nav-progress" aria-hidden="true" />
      <script
        dangerouslySetInnerHTML={{
          __html: `(${clientNav.toString()})(${revealCurrent.toString()})`,
        }}
      />
    </>
  );
}

function clientNav(reveal: () => void) {
  const parser = new DOMParser();
  /* href -> in-flight or settled fetch. Also serves the hover prefetch. */
  const cache = new Map<string, Promise<{ html: string; url: string } | null>>();
  const MAX_CACHE = 20;
  let currentPath = location.pathname;

  /*
   * We swap content ourselves, so the browser's idea of "the scroll position
   * for this history entry" is always stale. Take it over: each entry carries
   * its own y in history.state.
   */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const stylesheet = () =>
    document.querySelector('link[rel="stylesheet"]')?.getAttribute("href") ?? "";

  /* The doc URL this link points at, or null if we shouldn't handle the click. */
  function docUrl(link: HTMLAnchorElement): URL | null {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return null;

    const url = new URL(link.href);
    if (url.origin !== location.origin) return null;
    if (link.target && link.target !== "_self") return null;
    if (link.hasAttribute("download")) return null;
    /* /page.md, /llms.txt, /sitemap.xml … — not Layout pages. */
    if (/\.\w+$/.test(url.pathname)) return null;
    /* Not Layout pages either: one is Scalar, the other a redirect. */
    if (url.pathname === "/openapi" || url.pathname === "/source") return null;

    return url;
  }

  function load(href: string) {
    let pending = cache.get(href);
    if (!pending) {
      pending = fetch(href, { headers: { accept: "text/html" } })
        .then(async (res) => {
          const type = res.headers.get("content-type") ?? "";
          if (!res.ok || !type.includes("text/html")) return null;
          /* res.url, not href: legacy redirects may have moved us. */
          return { html: await res.text(), url: res.url || href };
        })
        .catch(() => null);
      cache.set(href, pending);
      if (cache.size > MAX_CACHE) {
        cache.delete(cache.keys().next().value as string);
      }
    }
    return pending;
  }

  /*
   * <script> elements inserted as parsed markup never run. Swap each one for a
   * fresh element so the scripts a component ships with (copy-as-markdown, and
   * anything added later) get to initialize for the new page. Anything that
   * registers a document-level listener has to be idempotent — see
   * initCodeCopy in Content.tsx.
   */
  function runScripts(root: Element) {
    root.querySelectorAll("script").forEach((old) => {
      const script = document.createElement("script");
      for (const attr of Array.from(old.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }
      script.textContent = old.textContent;
      old.replaceWith(script);
    });
  }

  /* The TOC is absent on pages with no h2/h3, so all four cases are real. */
  function syncToc(doc: Document) {
    const next = doc.getElementById("toc");
    const current = document.getElementById("toc");
    if (next && current) current.replaceWith(next);
    else if (next) document.getElementById("content")?.after(next);
    else current?.remove();
  }

  const HEAD_SYNC: [string, string][] = [
    ['link[rel="canonical"]', "href"],
    ['meta[name="description"]', "content"],
    ['meta[property="og:title"]', "content"],
    ['meta[property="og:description"]', "content"],
    ['meta[property="og:url"]', "content"],
  ];

  function syncHead(doc: Document) {
    document.title = doc.title;
    for (const [selector, attr] of HEAD_SYNC) {
      const next = doc.querySelector(selector);
      const current = document.querySelector(selector);
      if (next && current) {
        current.setAttribute(attr, next.getAttribute(attr) ?? "");
      }
    }
  }

  /* Move the sidebar's highlight without re-rendering (and re-scrolling) it. */
  function markCurrent(pathname: string) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    sidebar
      .querySelectorAll('a[aria-current="page"]')
      .forEach((a) => a.removeAttribute("aria-current"));
    const match = Array.from(sidebar.querySelectorAll("a")).find(
      (a) => new URL((a as HTMLAnchorElement).href).pathname === pathname,
    );
    match?.setAttribute("aria-current", "page");
    reveal();
  }

  function settle(hash: string, y: number) {
    const id = hash ? decodeURIComponent(hash.slice(1)) : "";
    const anchor = id ? document.getElementById(id) : null;
    if (anchor) anchor.scrollIntoView();
    else globalThis.scrollTo(0, y);
  }

  /*
   * Progress bar. Most clicks resolve from the hover prefetch and finish in a
   * few ms, so showing anything immediately would just be a flicker — nothing
   * appears unless the page is still in flight after GRACE ms.
   */
  const GRACE = 120;
  function startProgress() {
    const bar = document.getElementById("nav-progress");
    let shown = false;
    const timer = setTimeout(() => {
      shown = true;
      document.body.setAttribute("aria-busy", "true");
      bar?.classList.remove("done", "loading");
      void bar?.offsetWidth; /* flush, so the bar grows from 0 rather than resuming */
      bar?.classList.add("loading");
    }, GRACE);

    return function stopProgress() {
      clearTimeout(timer);
      if (!shown) return;
      document.body.removeAttribute("aria-busy");
      bar?.classList.remove("loading");
      bar?.classList.add("done");
      setTimeout(() => bar?.classList.remove("done"), 400);
    };
  }

  function closeOverlays() {
    const sidebar = document.getElementById("sidebar");
    try {
      /* Mobile: the nav is a popover, and it should close behind you. */
      if (sidebar?.matches(":popover-open")) sidebar.hidePopover();
    } catch (_e) { /* not showing */ }
    const dialog = document.getElementById(
      "search-dialog",
    ) as HTMLDialogElement | null;
    if (dialog?.open) dialog.close();
  }

  async function navigate(url: URL, push: boolean, y: number) {
    /*
     * On the bail-out paths below we hand off to a real browser navigation, so
     * the bar is left running on purpose — the browser's own is about to take
     * over and hiding ours first would read as "finished".
     */
    const stopProgress = startProgress();

    const page = await load(url.href);
    if (!page) return void (location.href = url.href);

    const doc = parser.parseFromString(page.html, "text/html");
    const next = doc.getElementById("content");
    const nextStyles =
      doc.querySelector('link[rel="stylesheet"]')?.getAttribute("href") ?? "";
    /*
     * No <main>, or a deploy landed mid-session (styles.css is version-busted):
     * hand the navigation back to the browser rather than mixing versions.
     */
    if (!next || nextStyles !== stylesheet()) {
      return void (location.href = url.href);
    }

    const final = new URL(page.url);
    final.hash = url.hash;

    const render = () => {
      /*
       * History first: the scripts we re-run below read location.pathname.
       */
      if (push) {
        history.replaceState({ y: globalThis.scrollY }, "");
        history.pushState({ y: 0 }, "", final.href);
      }
      currentPath = final.pathname;
      document.getElementById("content")?.replaceWith(next);
      runScripts(next);
      syncToc(doc);
      syncHead(doc);
      markCurrent(final.pathname);
      settle(final.hash, y);
      stopProgress();
    };

    const reduced = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      }
    ).startViewTransition;
    if (startViewTransition && !reduced) startViewTransition.call(document, render);
    else render();
  }

  document.addEventListener("click", (e: MouseEvent) => {
    /* Leave modified clicks alone: new tab, new window, download, save. */
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    const link = (e.target as Element | null)?.closest?.(
      "a[href]",
    ) as HTMLAnchorElement | null;
    if (!link) return;

    const url = docUrl(link);
    if (!url) return;

    if (url.pathname === location.pathname) {
      /* In-page anchors: the browser does this better than we would. */
      if (url.hash) return;
      e.preventDefault();
      globalThis.scrollTo(0, 0);
      return;
    }

    e.preventDefault();
    closeOverlays();
    navigate(url, true, 0);
  });

  /*
   * Warm the cache before the click lands, so most navigations resolve from
   * memory. pointerover covers mice; pointerdown is the touch equivalent and
   * still buys the ~100ms between finger-down and finger-up.
   */
  const prefetch = (e: Event) => {
    const link = (e.target as Element | null)?.closest?.(
      "a[href]",
    ) as HTMLAnchorElement | null;
    if (!link) return;
    const url = docUrl(link);
    if (url && url.pathname !== location.pathname) load(url.href);
  };
  document.addEventListener("pointerover", prefetch, { passive: true });
  document.addEventListener("pointerdown", prefetch, { passive: true });

  globalThis.addEventListener("popstate", (e: PopStateEvent) => {
    const y = (e.state as { y?: number } | null)?.y ?? 0;
    /* Hash-only traversal within the page we've already rendered. */
    if (location.pathname === currentPath) return settle(location.hash, y);
    navigate(new URL(location.href), false, y);
  });

  /*
   * scrollRestoration is manual, so restoring on reload is on us too. Stash the
   * offset on the way out; put it back on the way in.
   */
  globalThis.addEventListener("pagehide", () => {
    history.replaceState({ y: globalThis.scrollY }, "");
  });
  const initialY = (history.state as { y?: number } | null)?.y;
  if (initialY && !location.hash) globalThis.scrollTo(0, initialY);
}

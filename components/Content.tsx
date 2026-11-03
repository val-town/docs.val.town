/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx";

/*
 * "2026-06-10" -> "June 10, 2026". Pinned to UTC so the rendered day matches
 * the date written in frontmatter regardless of where this runs.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function Content({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string | null;
  children?: Child;
}) {
  return (
    <main id="content">
      <menu>
        <a href="/source" target="_blank">
          Edit on val.town ↗
        </a>
        <button id="copy">Copy as markdown ✧</button>
      </menu>
      <script
        dangerouslySetInnerHTML={{ __html: `(${copyMarkdown.toString()})()` }}
      />
      <script
        dangerouslySetInnerHTML={{ __html: `(${initCodeCopy.toString()})()` }}
      />
      <h1>{title}</h1>
      {children}
      {updated && (
        <p class="last-updated">
          Last updated <time datetime={updated}>{formatDate(updated)}</time>
        </p>
      )}
    </main>
  );
}

function copyMarkdown() {
  const btn = document.getElementById("copy");
  if (!btn) return;
  const label = btn.textContent;
  const path = location.pathname === "/"
    ? "/index"
    : location.pathname.replace(/\/+$/, "");

  // Prefetch raw markdown on load
  const mdPromise = fetch(`${path}.md`)
    .then((res) => (res.ok ? res.text() : null))
    .catch(() => null);

  btn.addEventListener("click", async () => {
    const md = await mdPromise;
    try {
      if (md == null) throw new Error("unavailable");
      await navigator.clipboard.writeText(md);
      btn.textContent = "Copy as markdown ✦";
      btn.classList.add("copied");
    } catch (_e) {
      btn.textContent = "Copy as markdown Ⓧ";
      btn.classList.add("failed");
    }
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove("copied", "failed");
    }, 1000);
  });
}

// Copy a code block's text (delegated, so it covers every block on the page).
function initCodeCopy() {
  /*
   * Delegated on document, so it already covers content swapped in by
   * components/Router.tsx — which re-runs this script on every page. Register
   * the listener once or every swap would add another copy.
   */
  const w = globalThis as typeof globalThis & { __codeCopy?: boolean };
  if (w.__codeCopy) return;
  w.__codeCopy = true;

  document.addEventListener("click", async (e) => {
    const target = e.target as Element | null;
    const btn = target?.closest(".copy-code");
    if (!btn) return;
    const code = btn.parentElement?.querySelector("code");
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent ?? "");
      btn.textContent = "Copied";
      btn.classList.add("copied");
    } catch (_e) {
      btn.textContent = "Error";
    }
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 1000);
  });
}

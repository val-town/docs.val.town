/** @jsxImportSource hono/jsx */

/*
 * Shared MiniSearch config. Used by routes/search.ts to build the index AND to
 * rehydrate it on the client (MiniSearch.loadJSON needs the same fields), so
 * initSearch below receives this object as an argument to stay in sync.
 */
import { SEARCH_OPTIONS } from "../lib/search-options";
import assets from "../generated/assets.json";

export default function Search() {
  const indexUrl = assets.search;
  return (
    <>
      <button id="search-trigger" type="button" aria-label="Search docs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>Search</span>
        <kbd>⌘ K</kbd>
      </button>

      <dialog id="search-dialog" aria-label="Search docs">
        <div class="search-box">
          <input
            id="search-input"
            type="search"
            placeholder="Search the docs…"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck={false}
            role="combobox"
            aria-expanded="false"
            aria-controls="search-results"
            aria-autocomplete="list"
          />
          <ul id="search-results" role="listbox" aria-label="Search results" />
          <p id="search-empty" hidden>
            No results.
          </p>
        </div>
      </dialog>

      <script
        dangerouslySetInnerHTML={{
          __html: `(${initSearch.toString()})(${JSON.stringify(SEARCH_OPTIONS)}, ${JSON.stringify(indexUrl)})`,
        }}
      />
    </>
  );
}

/*
 * Client-side search. Lazily loads MiniSearch + the prebuilt index on first
 * open, then renders ranked results with keyboard navigation.
 */
function initSearch(
  options: {
    fields: string[];
    storeFields: string[];
    searchOptions: Record<string, unknown>;
  },
  indexUrl: string,
) {
  const trigger = document.getElementById("search-trigger");
  const dialog = document.getElementById("search-dialog") as HTMLDialogElement;
  const input = document.getElementById("search-input") as HTMLInputElement;
  const results = document.getElementById("search-results") as HTMLUListElement;
  const empty = document.getElementById("search-empty") as HTMLElement;
  if (!trigger || !dialog || !input || !results || !empty) return;

  let mini: any = null;
  let loading: Promise<void> | null = null;
  let active = -1;

  const escapeHtml = (s: string) =>
    s.replace(/[&<>"]/g, (ch) =>
      ch === "&"
        ? "&amp;"
        : ch === "<"
          ? "&lt;"
          : ch === ">"
            ? "&gt;"
            : "&quot;",
    );

  // Wrap query terms in <mark> for a lightweight highlight.
  function highlight(text: string, terms: string[]): string {
    let out = escapeHtml(text);
    for (const term of terms) {
      if (!term) continue;
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
    }
    return out;
  }

  async function ensureLoaded() {
    if (mini) return;
    if (!loading) {
      loading = (async () => {
        const mod = await import("https://esm.sh/minisearch@7.2.0");
        const MiniSearch = mod.default;
        const res = await fetch(indexUrl);
        const json = await res.text();
        mini = MiniSearch.loadJSON(json, options);
      })();
    }
    await loading;
  }

  function render(query: string) {
    const q = query.trim();
    if (!q || !mini) {
      results.innerHTML = "";
      empty.hidden = true;
      input.setAttribute("aria-expanded", "false");
      active = -1;
      return;
    }
    const hits = mini.search(q).slice(0, 12);
    active = -1;
    if (hits.length === 0) {
      results.innerHTML = "";
      empty.hidden = false;
      input.setAttribute("aria-expanded", "false");
      return;
    }
    empty.hidden = true;
    input.setAttribute("aria-expanded", "true");
    results.innerHTML = hits
      .map((hit: any, i: number) => {
        const terms: string[] = hit.terms || [];
        const title = highlight(hit.title || hit.path, terms);
        const section = escapeHtml(hit.section || "");
        const desc = hit.description
          ? `<span class="search-desc">${highlight(hit.description, terms)}</span>`
          : "";
        return `<li role="option" id="search-opt-${i}" aria-selected="false"><a href="${escapeHtml(hit.path)}"><span class="search-hit-head"><span class="search-title">${title}</span><span class="search-section">${section}</span></span>${desc}</a></li>`;
      })
      .join("");
  }

  function setActive(next: number) {
    const opts = results.querySelectorAll("li");
    if (opts.length === 0) return;
    active = (next + opts.length) % opts.length;
    opts.forEach((li, i) => {
      const on = i === active;
      li.setAttribute("aria-selected", on ? "true" : "false");
      if (on) {
        li.scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", `search-opt-${i}`);
      }
    });
  }

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    ensureLoaded().then(() => render(input.value));
    input.focus();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  trigger.addEventListener("click", open);

  input.addEventListener("input", () => {
    ensureLoaded().then(() => render(input.value));
  });

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    const opts = results.querySelectorAll("li");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(active - 1);
    } else if (e.key === "Enter") {
      const target =
        active >= 0
          ? opts[active]?.querySelector("a")
          : opts[0]?.querySelector("a");
      if (target) {
        e.preventDefault();
        /* click() rather than location.href, so the router can intercept it. */
        target.click();
      }
    }
  });

  // Close when clicking the backdrop (outside the search box).
  dialog.addEventListener("click", (e: MouseEvent) => {
    if (e.target === dialog) close();
  });

  // Global ⌘K / Ctrl+K to open, "/" when not already typing.
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    } else if (
      e.key === "/" &&
      !dialog.open &&
      !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as Element)?.tagName || "")
    ) {
      e.preventDefault();
      open();
    }
  });
}

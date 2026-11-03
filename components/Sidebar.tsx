/** @jsxImportSource hono/jsx */
import { nav, type NavItem } from "./SIDEBAR.ts";
import Search from "./Search.tsx";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Sidebar({ pathname = "/" }: { pathname?: string }) {
  return (
    <nav id="sidebar" popover="auto" aria-label="Docs navigation">
      <div class="nav-scroll">
        <Search />

        <Tree items={nav} pathname={pathname} keyPrefix="" />
      </div>

      <button id="sidebar-toggle" type="button" aria-label="Toggle sidebar">
        <PanelLeftClose data-icon="panel-left-close" />
        <PanelLeftOpen data-icon="panel-left-open" />
      </button>

      <script
        dangerouslySetInnerHTML={{
          __html:
            `(${restoreNavState.toString()})(${revealCurrent.toString()})`,
        }}
      />
    </nav>
  );
}

function Tree({
  items,
  pathname,
  keyPrefix,
}: {
  items: NavItem[];
  pathname: string;
  keyPrefix: string;
}) {
  return (
    <ul>
      {items.map((item) => (
        <Leaf
          key={item.label}
          item={item}
          pathname={pathname}
          keyPrefix={keyPrefix}
        />
      ))}
    </ul>
  );
}

function Leaf({
  item,
  pathname,
  keyPrefix,
}: {
  item: NavItem;
  pathname: string;
  keyPrefix: string;
}) {
  const navKey = (keyPrefix ? keyPrefix + "/" : "") + slug(item.label);
  return (
    <li>
      {"items" in item ? (
        <details open={!item.collapsed} data-nav-key={navKey}>
          <summary>{item.label}</summary>
          <Tree items={item.items} pathname={pathname} keyPrefix={navKey} />
        </details>
      ) : (
        <a
          href={item.href}
          aria-current={item.href === pathname ? "page" : undefined}
        >
          {item.label}
        </a>
      )}
    </li>
  );
}

function PanelLeftClose({ "data-icon": dataIcon }: { "data-icon"?: string }) {
  return (
    <svg
      data-icon={dataIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  );
}

function PanelLeftOpen({ "data-icon": dataIcon }: { "data-icon"?: string }) {
  return (
    <svg
      data-icon={dataIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  );
}

/*
 * Scrolls the nav so the current page's entry is in view, opening any collapsed
 * sections above it on the way. Only ever scrolls .nav-scroll — never the
 * window — so it can run mid-parse without moving the page out from under you.
 *
 * Exported because components/Router.tsx inlines it into its own script and
 * calls it after each client-side page swap.
 */
export function revealCurrent() {
  const sidebar = document.getElementById("sidebar");
  const scroller = sidebar?.querySelector(".nav-scroll") as HTMLElement | null;
  const link = sidebar?.querySelector(
    'a[aria-current="page"]',
  ) as HTMLElement | null;
  if (!sidebar || !scroller || !link) return;

  for (
    let el = link.parentElement;
    el && el !== sidebar;
    el = el.parentElement
  ) {
    if (el.tagName === "DETAILS") (el as HTMLDetailsElement).open = true;
  }

  const linkBox = link.getBoundingClientRect();
  const navBox = scroller.getBoundingClientRect();
  /* Collapsed sidebar, or the mobile drawer while closed: nothing to scroll. */
  if (!navBox.height) return;

  if (linkBox.top < navBox.top || linkBox.bottom > navBox.bottom) {
    scroller.scrollTop += linkBox.top - navBox.top -
      (navBox.height - linkBox.height) / 2;
  }
}

/*
 * Restores/persists each nav section's open/closed state from localStorage,
 * then brings the current page into view.
 */
function restoreNavState(reveal: () => void) {
  const KEY = "nav-open";
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const read = (): Record<string, boolean> => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "") || {};
    } catch (_e) {
      return {};
    }
  };

  const state = read();
  sidebar.querySelectorAll("details[data-nav-key]").forEach((el) => {
    const details = el as HTMLDetailsElement;
    const key = details.getAttribute("data-nav-key")!;
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      details.open = state[key];
    }
  });

  sidebar.addEventListener(
    "toggle",
    (e: Event) => {
      /* The nav itself is a popover on mobile; it toggles too. */
      if (e.target === sidebar) {
        if ((e as Event & { newState?: string }).newState === "open") reveal();
        return;
      }
      const details = e.target as HTMLDetailsElement;
      if (
        details.tagName !== "DETAILS" ||
        !details.hasAttribute("data-nav-key")
      ) {
        return;
      }
      const next = read();
      next[details.getAttribute("data-nav-key")!] = details.open;
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch (_e) {}
    },
    true,
  );

  reveal();

  /* The nav has no size while collapsed, so re-run once it's expanded again. */
  document.addEventListener("click", (e: Event) => {
    if ((e.target as Element | null)?.closest?.("#sidebar-toggle")) {
      requestAnimationFrame(reveal);
    }
  });
}

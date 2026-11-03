/** @jsxImportSource hono/jsx */
import Lockup from "./Lockup.tsx";

export default function Header() {
  return (
    <header id="header">
      {/* Mobile only: open the nav drawer */}
      <button
        type="button"
        popovertarget="sidebar"
        aria-label="Open navigation"
      >
        <svg
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
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      <Lockup />
    </header>
  );
}

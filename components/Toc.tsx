/** @jsxImportSource hono/jsx */

export interface Heading {
  id: string;
  level: number;
  text: string;
}

export default function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <aside id="toc" aria-label="On this page">
      <p class="toc-title">On this page</p>
      <ul>
        {headings.map((h) => (
          <li class={`toc-item toc-h${h.level}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

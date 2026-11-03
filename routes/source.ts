import { type Context } from "hono";
import { readPage } from "./pages.tsx";

/*
 * "View source" — redirect to the current page's markdown file in GitHub,
 * based on the referring page. Falls back to the repository.
 */
export async function source(c: Context) {
  const SOURCE = "https://github.com/val-town/docs.val.town";
  const referer = c.req.header("referer");
  if (!referer) return c.redirect(SOURCE);

  const page = await readPage(new URL(referer).pathname);
  if (!page) return c.redirect(SOURCE);

  return c.redirect(`${SOURCE}/blob/main/${page.path}`);
}

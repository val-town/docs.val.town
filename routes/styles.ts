import { type Context } from "hono";
import { cssFiles } from "../components/index.ts";
import baseCSS from "../base.css";

/*
 * Bundle base.css + every co-located components/*.css into one stylesheet.
 * The build writes this response to a content-hashed static asset.
 */
export function styles(c: Context) {
  return c.body([baseCSS, ...cssFiles].join("\n\n"), 200, {
    "content-type": "text/css; charset=utf-8",
  });
}

import { type Context } from "hono";
import openapiHtml from "./openapi.html";

/*
 * REST API reference, rendered by Scalar from the live OpenAPI spec.
 * Template is colocated in routes/openapi.html.
 */
export function openapi(c: Context) {
  return c.html(openapiHtml);
}
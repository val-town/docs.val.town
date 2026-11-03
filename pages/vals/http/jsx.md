---
title: HTML & JSX
description: Use JSX syntax in Val Town to render HTML using React, Preact, Vue, Solid, Hono, etc.
updated: 2026-09-08
---

Use JSX in Val Town with modern frontend frameworks like React, Preact, Vue,
Solid, and Hono.

To use JSX, you'll need to insert what TypeScript calls a
"[per-file pragma](https://www.typescriptlang.org/tsconfig#jsxImportSource)" - a
comment that uses `@jsxImportSource` to specify where the JSX methods are going
to come from. For example, if you're implementing JSX with Preact, the pragma
will look like this at the top of your file:

```tsx
/** @jsxImportSource https://esm.sh/react */
```

## React

With [React](https://react.dev/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/react" class="val-embed" loading="lazy" style="height:300px"></iframe>

## Preact

With [Preact](https://preactjs.com/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/preact" class="val-embed" loading="lazy" style="height:300px"></iframe>

## Vue

With [Vue](https://vuejs.org/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/vue" class="val-embed" loading="lazy" style="height:300px"></iframe>

## Solid

With [Solid](https://www.solidjs.com/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/solid" class="val-embed" loading="lazy" style="height:300px"></iframe>

## Hono

With [Hono](https://hono.dev/):

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/hono" class="val-embed" loading="lazy" style="height:340px"></iframe>

## Missing your favorite framework?

> Are we missing your JSX framework of choice? Feel free to
> [ask us](mailto:hi@val.town), or open a branch to
> [update this docs page](/source).
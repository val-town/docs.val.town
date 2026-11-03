---
title: Importing
description: Import code from vals, NPM, JSR, and URLs
updated: 2026-09-09
---

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/vmTJS_kmQSo?si=XnvDG1Pa7zMrw-lR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

One of the best features of Val Town is the ability to import modules. There are
thousands of modules written in JavaScript and TypeScript that you can instantly
import to extend and supercharge your vals.

Val Town supports importing code from a variety of sources, including other vals
on Val Town, [NPM](https://www.npmjs.com/), [JSR](https://jsr.io),
[esm.sh](https://esm.sh/), [deno.land](https://deno.land/x). You can also import
code from arbitrary URLs if they provide the correct `Content-Type` header and
contain JavaScript or TypeScript. Imports in Val Town work the same as in Deno,
so you can
[learn more from their docs](https://docs.deno.com/runtime/manual/basics/modules/).

## NPM

To import an npm module, like [zod](https://www.npmjs.com/package/zod), add
`npm:` in front of the name. So,

```ts
import { z } from "npm:zod";
```

> **NPM compatibility and the sandbox:** Most NPM modules are supported and will
> work great in Val Town. However, we do run in a security sandbox: a val can't
> access the filesystem. Some NPM modules try to do that, and won't be able to.
> Using esm.sh is often an effective workaround for these modules. See
> [permissions errors](/troubleshooting/permission-errors/) for more
> information.

## JSR

Val Town supports importing [JSR](https://jsr.io) modules. Simply add `jsr:` and
`@` in front of the module name:

```ts
import { concat } from "jsr:@std/bytes";
```

## HTTP imports

To import from a URL, like from `esm.sh`, you just specify the full url. For
example, to import `zod` from `esm.sh`:

```ts
import { z } from "https://esm.sh/zod";
```

## Node builtins

If you want to import a Node.js built-in module, add `node:` in front of its
name. For example, to import the
[crypto](https://nodejs.org/dist/latest-v20.x/docs/api/crypto.html) module, use
this, which is the same as what Node.js themselves officially recommend:

```ts
import { createHmac } from "node:crypto";
```

## Importing vals

Within vals, you can import files and folders relative to the val root (e.g.,
`./home`), which means you don't have to update your imports when you branch,
remix, or rename a val.

Between different vals, you can still import code freely. In the **⋮** menu in
the top-right of the val code editor, go to **Copy → Copy module URL** to copy
the module URL. Then you can import from that URL from another val.

Val source code hosted on [esm.town](/reference/esm-town), and are available for
import on Val Town, Deno, Node, the browser, and anywhere else https-imports are
supported. In this way, Val Town builds upon the new http-style imports, to make
a lightweight package registry, but where each snippet of code is a package.

Private vals are only importable with the `DENO_AUTH_TOKEN` environment variable
set, which we automatically set for you, allowing only you to import your
private vals.

## Importing text files

[As of Deno 2.8](https://docs.deno.com/examples/importing_text/), Val Town
supports importing text files like HTML, CSS, JSON, Markdown, CSV, TXT, etc.

```ts
import text from "./logs.txt" with { type: "text" };
import html from "./index.html" with { type: "text" };
import styles from "./styles.css" with { type: "text" };
import markdown from "./blog.md" with { type: "text" };
```

You can also dynamically import text files inline:

```ts
const data = (await import("./data.csv", {
  with: { type: "text" },
})).default;
```

And you can import json in Deno as text or JSON, which will parse it into a
JavaScript object:

```ts
import config from "./data.json" with { type: "json" };
```

## Debugging imports

### Look for examples

Whenever you go to use a new npm library, we recommend first searching to see if
anyone has used that library before.
[You can find the most common packages here](https://www.val.town/examples/packages).

Or you could look for examples related to `cheerio` by searching for it or even
more pointedly by searching for
[`"npm:cheerio"`](https://www.val.town/search?q=%22npm:cheerio%22).

### Log keys

It's often not clear how a library will expose its methods. It can be helpful to
log the keys of whatever object they return to you. That will tell you if you
need to import it off of default or not, and what is available to you.

```ts
import * as cheerio from "npm:cheerio";

console.log(Object.keys(cheerio));
```

```txt
[
  'contains', 'default',
  'html',     'load',
  'merge',    'parseHTML',
  'root',     'text',
  'xml'
]
```

### Look for Deno compatibility

Not all modules are compatible with Deno. Some modules are written with only
Node.js or a browser environment in mind, and won't work with Deno. While Deno
implements most of the functionality of Node.js and some of the functionality of
browsers - so many modules will "just work" in it, some won't.

Also, some modules are written with the assumption that they can access system
resources, compile C code, and more, so they won't work in a secure environment
like Val Town.

> **We're here to help** As always,
> [ask in our Discord if you want help](https://discord.val.town/).
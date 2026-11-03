---
title: Basic examples
description: Examples of basic HTTP triggers for common use cases
updated: 2026-09-08
---

HTTP triggers create a URL on the public internet, like `example.val.run`. Copy
a URL by opening a file with an HTTP trigger and clicking the copy button, or by
opening the menu for that file in the file tree.

> By default, URLs will be a long mess of characters, but you can easily add
> [custom subdomains](/vals/http/custom-subdomains).

## Return JSON

The simplest endpoint returns a simple JSON message:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Basic_examples/jsonOkExample" class="val-embed" loading="lazy" style="height:160px"></iframe>

## Return HTML

Or return HTML with the corresponding Content-Type header:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Basic_examples/htmlExample" class="val-embed" loading="lazy" style="height:230px"></iframe>

## Return JSX

You can also use JSX, like React:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/HTML_JSX/react" class="val-embed" loading="lazy" style="height:300px"></iframe>

[See more examples of returning HTML and JSX](/vals/http/jsx).

## Reading POST request body

You can also get the body of POST requests:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Basic_examples/jsonBodyParsing" class="val-embed" loading="lazy"></iframe>

## Reading headers & query parameters

This echoes request headers back in the response:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Basic_examples/headersExample" class="val-embed" loading="lazy" style="height:180px"></iframe>

We can get and return the request URL's query parameters:

<iframe src="https://www.val.town/embed/x/valdottown/HTTP_examples/Basic_examples/queryParams" class="val-embed" loading="lazy" style="height:180px"></iframe>
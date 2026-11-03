---
title: How to build an MCP server
description: Build and host an MCP server on Val Town
updated: 2026-09-02
---

This guide walks you through creating an MCP server in 1 minute on a Free
account. Feel free to [jump to Step 1](#how-to-build-and-host-an-mcp-server)
(i.e. “I already trust Val Town and know what an MCP server is, just show me how
to do it”).

<iframe width="100%" height="376px" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/sO6-Wl5fy7g?si=wIHkyI8fRpr75I_8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

> Looking for the Val Town MCP server? [Here you go](/guides/prompting/mcp).

## Why build an MCP server on Val Town

We have it on good authority that Val Town is a great—maybe the best—place to
build an MCP server:
[**the MCP Core Maintainer team themselves use Val Town to create and test MCP servers**](https://blog.val.town/mcp-core-maintainers).
Here are a couple quotes from Paul Carleton, Technical Staff at Anthropic and
MCP Core Maintainer:

> _“The way I build MCP servers most of the time is in Val Town. It’s great. A
> GET request returns some JSON that renders here [on the frontend], and I can
> also just query the MCP server directly to see what that example server
> does.”_

> _“With Val Town I can just get an HTTPS URL that has an MCP, and I can tweak
> that really quickly, and then **I can put that MCP into
> [claude.ai](https://claude.ai) and have our real production backend hit it**
> and test a whole bunch of stuff, which is really nice.”_

Paul said lots of other nice stuff and shared neat things about the new MCP 2.0
(the 2026-07-28 specification).
[Read the full case study](https://blog.val.town/mcp-core-maintainers) if you’re
interested.

All that said, there are reasonable [alternatives](#alternatives) that we list
below where you can host your MCP server, like Cloudflare.

## What is an MCP server?

The
[Model Context Protocol](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro),
MCP, is a standard way for LLMs and agents to connect to data sources and tools.

An MCP _client_ is whatever LLM/agent you already use—Claude, ChatGPT, etc. The
client connects to an MCP _server_, which provides the data and/or tools. For
example, we have a [Val Town MCP server](/guides/prompting/mcp) that lets your
agent do pretty much everything you can do by hand on Val Town (edit and run
code, schedule crons, read and write to SQLite and blob storage, etc.).

MCP servers can either use STDIO as the transport layer for passing data, or
streamable HTTP. We’ll be creating an HTTP server, which is what most remote MCP
servers use (i.e. not on your local computer).

## Why build an MCP server?

Many software companies with APIs now also ship MCP servers: GitHub, Slack,
Notion, Sentry, Vercel, Cloudflare, Resend, Figma, Linear, and many more. MCP is
becoming a more and more popular pattern as people increasingly ask AI agents to
answer questions and complete tasks on their behalf.

It’s also possible to build your own MCP server on top of an API, even if you
aren’t the API owner. You could build an MCP server for your favorite movie or
book tracking tool for example to easily rate and review what movies/books
you’ve watched/read.

You may also want to connect to your own data source or internal tools, for your
company or personal use.

## How to build and host an MCP server

To build and host your own MCP server:

1. Remix our [mcp-server](https://www.val.town/x/templates/mcp-server) template

What about step 2? For a bare bones MCP server that works, there isn’t a step 2!
You now have a working MCP server that you can connect to whichever MCP client
you like (ChatGPT, Claude, Cursor, Gemini, et al.).

An easy way to test your MCP server is by copy-pasting its URL (from `main.ts`
in your val) into
[Cloudflare’s AI playground](https://playground.ai.cloudflare.com/models) and
ask for the current time somewhere in the world. You’ll be able to see the model
call the MCP server then answer your question.

![example chat "what time is it in madrid"](/images/guides-how-to-build-an-mcp-server-123dcdf9.webp)

### Customizing your MCP server

To customize your MCP server:

1. Replace the `server.registerTool` call on line 10 with your own tool
2. Add more tools!

It’s just JavaScript, so you can import npm libraries, call APIs, do math, or
whatever you’d like for your server. The template uses the
[official TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).
You could even use [our MCP server](/guides/prompting/mcp) to build your MCP
server.

You may also want to add a [custom subdomain](/vals/http/custom-subdomains),
like `my-mcp-server.val.run`, for convenience.

### Authentication - Protecting your MCP server

To protect your MCP server or restrict access, you can add an authentication
mechanism. For reference, see Paul Carleton’s example vals
[mcp-oauth-ex1](https://www.val.town/x/pcarleton/mcp-oauth-ex1),
[mcp-oauth-ex2](https://www.val.town/x/pcarleton/mcp-oauth-ex2), and
[mcp-oauth-ex3](https://www.val.town/x/pcarleton/mcp-oauth-ex3).

### Testing your MCP server

As mentioned the
[Cloudflare AI playground](https://playground.ai.cloudflare.com/models) is a
quick and easy way to test an MCP server.

In “Model mode,” select “MCP Servers” and copy-paste your URL. You can add a
header with a Bearer token if your server includes authentication. You should
see a green "Ready" marker next to your MCP server once it’s connected.

Try sending a message related to your server’s tools. You’ll be able to see the
tool calls in the chat.

## Alternatives

Val Town’s architecture prioritizes development speed. You do not have to clone
a repo, install dependencies, push changes, and wait for a build step. Your MCP
server is live after every edit the moment you save, which is the primary
advantage to building an MCP server on Val Town. That’s why it takes literally
one step and one minute to deploy a simple MCP server.

That said, there are other reasonable alternatives to consider.

<!-- TODO: add a comparison table -->

### Vercel

Vercel published their own guide to
[Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel).
If you’d like to stay in the Vercel ecosystem, that’s probably a good choice. If
you want to prioritize a faster iteration feedback loop, Val Town is probably
the better choice.

### Cloudflare

Cloudflare published their own guide to
[Build a Remote MCP server](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/).
Like Vercel, hosting an MCP server on Cloudflare requires a build step, so the
iteration feedback loop would take a bit longer than Val Town, but it’s
definitely a reasonable choice.

### More

Really any hosting provider that can host a regular web server can host an MCP
server. Railway, Render, Fly.io, Netlify, et al.

## Questions

If you’d like a hand setting up your MCP server, we are responsive on
[email](mailto:hi@val.town) and [discord](https://discord.val.town). And we’d
love to see your MCP server built in Val Town!
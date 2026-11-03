---
title: Deploy a Claude Artifact
description: Deploy your website or app from Claude to a custom URL on Val Town
updated: 2026-09-16
---

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/uU-3mPbtMQM?si=cKTVw5b-zZbDjjdn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Claude Artifacts](https://code.claude.com/docs/en/artifacts) are live
pages—mini websites—that Claude publishes from a chat to a `claude.ai` URL. They
are very useful for quick throwaway documents and minisites, but sometimes you
need a bit more: a backend, data storage, a custom domain, multiple pages, et
cetera. Val Town is a good fit to host your Claude Artifacts.

## How to host a Claude Artifact on Val Town

1. Connect to the Val Town MCP server via the official Claude marketplace
2. Ask Claude to deploy your Artifact to Val Town

We recommend installing the Val Town MCP server using our
[agent plugin](/guides/prompting/plugin), which includes skills.

## Keep your Artifact private

Just like a Google Doc, Claude Artifacts can be kept private, shared with your
organization, or published to a public URL. [Val Town Access](/reference/access)
is the same thing for teams using Val Town. You can share a URL with your
organization, specific people, or make it public. For Pro and Free plans, we
also have an [authentication guide](/guides/auth) explaining other ways to limit
access to your val.

## Alternatives

There are plenty of places to host websites and tools, of course. Some
alternatives to consider include:

- Cloudflare Workers
- GitHub Pages
- Vercel
- Netlify

Each tool comes with its tradeoffs. Val Town doesn't require storing any files
locally on your computer or waiting for a build step to deploy, so it's a good
fit when you want Claude to “just give me a live URL.”
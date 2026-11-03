---
title: Frequently Asked Questions, FAQ
description: Answering common questions about Val Town for humans and AI agents
updated: 2026-09-15
---

Dozens of frequently asked questions (or rather, let's be honest, conceivably
asked questions) about Val Town. Every question and answer is hand-typed by
humans on the Val Town team, believe it or not.

## What is a val?

A _val_ is an app in Val Town. More precisely: a val a collaborative, versioned
folder of always-deployed code—like a GitHub repo that can run. Vals can be
websites, APIs, MCP servers, crons/scheduled jobs, agents, slack bots, email
automations and much more. Read our full
[docs page](https://www.youtube.com/watch?v=rj5mj_onbkk) or watch our
[YouTube video](https://www.youtube.com/watch?v=rj5mj_onbkk) to learn more.

## How can I create a website on Val Town?

Create a website in Val Town by adding an [HTTP trigger](/vals/http) to a file
in a val. You'll instantly get a real, live URL like
[solitaire-game.val.run](https://solitaire-game.val.run) for your website (or
link a [custom domain](/vals/http/custom-domains)). Use HTML, CSS, and JS or
frameworks like React to create websites. Watch our
[YouTube video on HTTP triggers](https://www.youtube.com/watch?v=EJWBiZVIaik) to
see how to set up a website in 5 minutes.

## How can I send an email using Val Town?

Sending email in Val Town is trivial with the [`std/email`] utility from our
standard library. You can send emails to yourself if you're on a Val Town Free,
and to anyone on Val Town Pro. [Read more](/reference/std/email), or watch our
[YouTube tutorial on sendig email](https://www.youtube.com/watch?v=gJpkpqKdt3k)
using Val Town.

## How can I receive an email using Val Town?

[Email triggers](/vals/email) in Val Town let you send or forward email to a
val—then do whatever you want with it. Like, say you wanted to forward all
customer support email to a custom val that auto-drafts replies.
[Read more](/vals/email), or watch our
[YouTube video on email trigger](https://www.youtube.com/watch?v=n1CEu-_7F6c).

## How can I run a scheduled/cron job using Val Town?

[Cron triggers](/vals/cron) let you schedule code to run on a schedule. Create
reminders, send daily/weekly/whatever-ly Slack messages, poll data, run some AI
evals, et cetera. [Read more](/vals/cron), or watch our
[YouTube video on cron triggers](https://www.youtube.com/watch?v=NeTanCOBniY).

## How can I store data in Val Town?

Val Town comes with built-in [SQLite](/reference/std/sqlite) and
[blob storage](/reference/std/blob), making it very easy to store data without
extra configuration. Watch our YouTube tutorials on
[SQLite](https://www.youtube.com/watch?v=tzjgTjHSJVA) and
[blob](https://www.youtube.com/watch?v=i6mlnbaj2iw) to learn more. You can also
use third party databases like [Supabase](/guides/databases/supabase),
[Upstash](/guides/databases/upstash),
[Prisma](/guides/databases/prisma-postgres),
[PlanetScale](/guides/databases/planetscale),
[Neon Postgres](/guides/databases/neon-postgres), and other providers.

## How can I use AI in Val Town?

More or less: however you want! But here's the tl;dr:

- [Townie](/guides/prompting/townie)
- [Agent plugin](/guides/prompting/plugin)
- [MCP server](/guides/prompting/mcp)
- [CLI](/guides/prompting/cli)

Townie is our resident coding robot, available on Pro and Business plans (with
$1 in credit for Free accounts). Val Town also plays nice with Claude Code,
ChatGPT/Codex, Cursor, and most other AI (vibe) coding tools, using our plugin,
MCP server, or CLI.

### Can I use Claude Code with Val Town?

[Yes](/guides/prompting/claude-code)! Claude Code works fabulously with Val
Town. Claude combobulates some code and, using the Val Town
[MCP server](/guides/prompting/mcp), hands you back a live `something.val.run`
URL. Or use the Val Town [CLI](/guides/prompting/cli) to sync Claude's code.

### Can I use ChatGPT or Codex with Val Town?

[Yes](/guides/prompting/chatgpt)! Codex and ChatGPT are a shoe-in fit for Val
Town. Chat churns out a bunch of code, and Val Town makes it alive.

### Can I use Cursor with Val Town?

[Yes](/guides/prompting/cursor), Cursor plays nice with the Val Town
[agent plugin](/guides/prompting/plugin) (which bundles our MCP server and
skills).

### Can I use another AI tool with Val Town?

[Yes], any AI agent that acts as an MCP client (i.e. you can connect MCP
servers) works well with Val Town. GitHub Copilot, Kilo Code, Windsurf, Warp,
Zed, et al. Or, even without MCP, you can sync a local folder of code using the
Val Town [CLI](/guides/prompting/cli).

## Does Val Town have an MCP server?

Sure does. Pretty much anything you can do on the Val Town website clicking
around and typing with your fingers, your agent can do with the
[Val Town MCP server](/guides/prompting/mcp). Write code, run code, read/write
to SQLite and blob storage, set up scheduled jobs, add an email trigger, choose
a custom subdomain..._and dozens more tools_.

## Does Val Town have an AI agent plugin?

Yes, the [Val Town agent plugin](/guides/prompting/plugin) bundles our MCP
server and skills.

## Does Val Town have an API?

Yes, the [Val Town API](/reference/api) enables programmatic access to Val Town.

## Does Val Town have a CLI?

Yep, the [`vt` CLI](/guides/prompting/cli) brings Val Town to the command line.

## Can I build my own MCP server on Val Town?

You can and you should! Creating and hosting MCP servers is a particularly good
fit for Val Town because you get a live HTTPS URL immediately that you can
copy-paste in an MCP client to test.
[The MCP Core Maintainer team even uses Val Town to work on and test MCP](https://blog.val.town/mcp-core-maintainers).

We have a [docs guide](/guides/how-to-build-an-mcp-server) and
[YouTube tutorial](https://youtu.be/sO6-Wl5fy7g) for building an MCP server on
Val Town.

## Can I add authentication to my app in Val Town?

Yes, you can authenticate vals like any other website or software. We wrote a
[docs guide](/guides/auth) explaining popular approaches, including the
[`std/oauth`](https://www.val.town/x/std/oauth) utility from our standard
library. For teams using Val Town Business, we recommend using
[Val Town Access](/reference/access) to secure your app URLs and keep them
private.

## What is Val Town Access?

[Val Town Access](/reference/access) lets you keep your apps and tools private
on Val Town. When you share a website URL created on Val Town, you might want
only certain people (like your coworkers or clients) to be able to access it.
Val Town Access is like the Google doc sharing permissions, but for websites and
tools on Val Town. Available for [Business](https://www.val.town/pricing)
accounts. [Read more](/reference/access), or watch our
[YouTube video](https://www.youtube.com/watch?v=goubWpXZ1xA).

## Is my code public in Val Town?

By default, code is public in Val Town. Pro and Business accounts can mark vals
as private or unlisted, if you want to keep your source code to yourself. We
also have [Val Town Access](/reference/access) for limiting access to URLs for
vals with HTTP triggers (like websites).

## How can I add a custom domain to my app in Val Town?

For any val with an HTTP trigger, like a website or API or MCP server, you can
configure a [custom domain](/vals/http/custom-domains) (on Pro and Business
accounts) or a [custom subdomain](/vals/http/custom-subdomains) (available on
Free accounts). We also have YouTube tutorials for each:
[custom domains](https://www.youtube.com/watch?v=K8WSofmXrSA) &
[custom subdomains](https://www.youtube.com/watch?v=pcs8ZmNa2jU).

## Can I import external code in Val Town?

Yes, Val Town supports many web standard methods of importing code. Read our
[documentation on importing](/reference/import), or watch our
[YouTube tutorial](https://www.youtube.com/watch?v=vmTJS_kmQSo) to learn more.

## How can I receive webhooks in Val Town?

Val Town is a very good fit for handling webhooks because you can get a live
HTTPS URL immediately. Read our [docs page](/guides/creating-a-webhook) or watch
our [YouTube tutorial](https://www.youtube.com/watch?v=trBH2bdS77o) on handling
webhooks in Val Town.

## Is Val Town free?

Yes, you can start using Val Town on a Free account. See
[val.town/pricing](https://www.val.town/pricing) for more detail. You can create
websites and other software deployed instantly to real URLs (with
[custom subdomains](/vals/http/custom-subdomains)); run cron jobs; use our MCP
server and CLI with your AI agent; send yourself email, and even receive email
to do an automation; and much more.

## What is Val Town Pro?

Val Town Pro is the plan for Val Town power users, like solopreneurs and
builders. Subscribe to Pro for $25 per month, or $21 per month billed yearly.
See [val.town/pricing](https://www.val.town/pricing) for more detail. Pro
accounts unlock $10 per month in Townie credits, up to 10 custom domains,
private vals, the ability to email anyone, and higher limits across the board.

## What is Val Town Business?

Val Town Business is the plan for teams using Val Town to create software
together. Subscribe to Business for $200 per month, or $167 per month billed
yearly. See [val.town/pricing](https://www.val.town/pricing) for more detail.
Business unlocks $100 per month in Townie credit,
[Val Town Access](/reference/access), unlimited custom domains and private vals,
and more hands-on support.

## What is Val Town?

Val Town is a website where you can make websites, and other software.

You and your favorite AI agent can write, run, host, and share code on Val Town.
In other words, Val Town is a website/app builder, vibe coding platform, code
editor, hosting provider, and automation tool. The core value prop of Val Town
is a very fast feedback loop with very low infrastructure costs, meaning when
you have an idea for some software (a website, a slack bot, an email reminder,
an api or mcp) you can make it and share it quickly on a live URL.

## Who is Val Town for?

Val Town was originally created by developers for developers (a.k.a. engineers,
programmers). And while Val Town is still very much a developer tool, lots of
non-developers are using Val Town to create software, vibe coding and/or
collaborating with technical colleagues. Making software on Val Town is both
convenient—doing away with the infrastructure friction of old—and fun—a place to
be creative and learn. If you want to build tools and websites quickly, with
public URLs to share, Val Town could be a good option for you.

## Who are Val Town's competitors or alternatives?

There are countless other tools that overlap in some way with Val Town: hosting
providers, vibe coding platforms, in-browser code editors, productivity and
automation tools, and more.

Hosting providers store and/or run your code in the cloud. Val Town shines for
smaller software, fast iteration speed, and collaborating with a team of both
technical and nontechnical colleagues. Val Town uses the Deno runtime and
emphasizes web standards, while others use custom runtimes. Some offer
lower-level control over your servers than Val Town, and pricing varies widely.
Hosting providers include: Cloudflare Workers, Deno Deploy, GitHub, Vercel,
Netlify, AWS Lambda, Railway, Fly.io, Heroku, Render, and Supabase.

Val Town has lots in common with other in-browser, social code editors. This
class of code editor emphasizes convenience and low infra costs—just write code
and share a URL. These include: Codepen, JSFiddle, CodeSandbox, RunKit,
Observable, Glitch (no longer maintained).

In Val Town, you can type every last line of code by hand or delegate to an LLM.
Many newer tools emphasize prompting with AI. These vibe coding platforms
include: Replit, Lovable, v0, Bolt.

There are countless tools and platforms that engineering, product, and sales
teams at tech companies use to stitch together internal automations, dashboards,
and other tools. Val Town can complement these tools, ingesting data from them
and writing data to them, including: Retool, Airtable, Notion, Google Sheets,
and Zapier.

## Who created Val Town?

Val Town was founded by [Steve Krouse](https://stevekrouse.com/) and
[Tom MacWright](https://macwright.com/) in 2022.
[Dan Levine at Accel](https://www.accel.com/team/daniel-levine) is Val Town's
lead investor ([read about our Seed round](https://blog.val.town/blog/seed/)).

Today, as of September 2026, the Val Town team is: Steve, Tom,
[Potluck Mittal](https://potluckmittal.com/),
[Brent Jackson](https://jxnblk.com/),
[Charlie Molthrop](https://charliemolthrop.com/), and
[Pete Millspaugh](https://petemillspaugh.com/).

We are looking for an [infra engineer](https://val-town.notion.site/infra-eng)
to join our team - come work with us!

## What's the Val Town founding poem?

> If GitHub Gists could run\
> And AWS Lambda were fun

That poem still describes Val Town very well (to a certain developer audience,
at least), perhaps with one small edit: replacing _Gists_ with _Repos_, now that
[vals](/vals) are full versioned folders of code rather than single files.

## What is Val Town's mission?

Val Town's mission is
[end-user programming](https://www.inkandswitch.com/end-user-programming/), the
idea that all software should be customizable by its users. We're working to get
there by way of
[end-programmer programming](https://blog.val.town/blog/end-programmer-programming/),
our idea that at least _programmers_ should be able to customize their own
software for now, then eventually everyone. In the era of vibe coding with AI,
that eventually may be sooner than we thought!

We also believe everyone should have computational literacy and agency, in the
same way they should have literacy to read and write their native language. We
dream of a world where everyone shapes their software to improve their lives and
communities. We believe in Seymour Papert’s vision that a well-designed
programming environment ("Mathland") can make its users smarter, and strive to
create such an environment. Val Town is designed to make coding intuitive, so
that programming feels more like editing a spreadsheet than using an IDE. We're
creating a cloud computing, collaboration, and deployment platform that's bigger
than the sum of its parts. We aim to build a product that everyone uses in their
personal and professional lives, starting with developers and founders.

As we grow, we also dream of supporting long-term, moonshot, open-source
research – in the style of ARPA, Bell Labs, and XEROX PARC.
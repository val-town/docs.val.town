---
title: "Migrate AI"
description: "Val Town migration guide: Migrate AI"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the replacement

<div class="table-scroll">

| Option | Use it when |
| --- | --- |
| Provider SDK directly | Keep the existing provider/model with your own API key |
| [AI Gateway](https://developers.cloudflare.com/ai-gateway/) | Route supported providers through Cloudflare for logging, caching, or billing |
| [Workers AI](https://developers.cloudflare.com/workers-ai/) | Run a model hosted by Cloudflare |

</div>

AI Gateway is not itself a model. Use your own provider key, or configure [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) for a supported provider with sufficient credits. Do not assume every model is available.

## Preserve the API contract

Record model, prompts, streaming, tools, structured output, image/audio inputs, and how errors are handled. Prefer keeping the model initially; changing provider or model may change behavior.

Replace the Val Town helper with the chosen SDK or API. Check authentication headers and base URL against that provider’s current documentation. Keep keys server-side using [Transfer secrets](/migration/cloudflare/transfer-secrets).

Some Workers AI models require separate terms or a paid plan. Confirm these before relying on them.

## Check privacy and cost

Decide whether Gateway may log prompts/responses or cache results. Do not enable caching where fresh output is required or private users’ responses could be shared.

Preserve existing access controls and usage limits. A public app calling your key can spend your money.

## Verify

Use a small, representative test within the user’s budget. Check streaming, cancellation, tool arguments, parsed output, errors, and timeout behavior—not just an HTTP 200. Confirm which account is billed before enabling production traffic.

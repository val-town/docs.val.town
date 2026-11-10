---
title: "Migrate AI"
description: "Val Town migration guide: Migrate AI"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose a provider

Render runs the application, not the model. Replace `std/openai` with the existing provider's Node SDK or an external gateway. Val Town's managed credits do not transfer.

Keep the same model initially when possible. Record prompts, streaming, tools, structured output, media inputs, timeout/retry behavior, and usage controls. If you change the model, test the resulting behavior rather than assuming API compatibility means equal output.

## Configure the client

Install the provider SDK and put its key/model in Render env vars. Set `OPENAI_MODEL` explicitly to the model selected for this app; do not silently switch models. For OpenAI, the [Node SDK](https://github.com/openai/openai-node) example is:

```javascript
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  messages: [{ role: "user", content: "Return a short greeting." }],
});
const text = completion.choices[0]?.message.content;
```

Use the API shape the app already needs; preserve streaming and tool-result handling. For another provider or gateway, follow its current endpoint/authentication documentation rather than blindly setting `baseURL`.

Keep model calls server-side. Configure logging and gateway caching so private prompts are not accidentally retained or shared. A public endpoint using your key needs access controls and a budget/rate limit.

## Verify

Use synthetic prompts within the authorized budget. Check structured output parsing, stream completion/cancellation, tool arguments, and error paths. Confirm the billed account and model. A successful HTTP response alone is insufficient. For work that should outlive an HTTP request, use a Render background worker with durable job status.

---
title: "Migrate AI"
description: "Val Town migration guide: Migrate AI"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the replacement

Val Town’s managed `std/openai` access and credits do not transfer. Keep the existing provider/model with your own key, or use [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) for supported models. Check billing and model availability before enabling requests.

Record prompts, tools, structured output, streaming, image/audio inputs, and failure behavior. Changing the model is a separate behavior change, not a necessary part of migrating the code.

## Adapt the client

Install `openai` in the server project. For Gateway’s [OpenAI-compatible API](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions), set `AI_GATEWAY_API_KEY` and `AI_MODEL` as server env vars. Use a model ID from the current Gateway catalog.

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

export async function ask(prompt: string) {
  const model = process.env.AI_MODEL;
  if (!model) throw new Error("AI_MODEL is required");
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0]?.message.content ?? "";
}
```

For OpenAI directly, use `OPENAI_API_KEY`, omit `baseURL`, and keep an OpenAI model ID. Other providers may need their own SDK or request shape.

This example handles plain text only. Carry over the app’s actual tools, output schema, streaming adapter, cancellation, and timeouts. Do not silently replace a streaming endpoint with a single response.

## Credentials, privacy, and cost

Use [Transfer env vars](/migration/vercel/transfer-env-vars). Keep keys and SDK calls out of the browser. Decide whether prompt logging or caching is appropriate for private inputs.

Require application authentication before calling this helper from an HTTP route, and apply per-user rate limits and spending controls. Test it locally or behind authentication; do not deploy an unrestricted paid-AI demo endpoint. Use separate test credentials where available.

## Verify

Run a small representative test within the approved budget. Check actual content, tool arguments, JSON parsing, streaming cancellation, and provider errors. Confirm the billed account and usage, not just HTTP status. Never print private prompts or keys while debugging.
